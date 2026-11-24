import asyncio
import re
import unicodedata
from uuid import UUID

import asyncpg
from google import genai
from google.genai import types
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from app.ai.rag.chroma_store import EMBEDDING_DIMENSIONS, get_chroma_store

EMBEDDING_MODEL = "gemini-embedding-2"
SENSOR_CHART_READING_LIMIT = 50
SENSOR_READING_COUNT_WORDS = {
    "un": 1,
    "une": 1,
    "deux": 2,
    "trois": 3,
    "quatre": 4,
    "cinq": 5,
    "six": 6,
    "sept": 7,
    "huit": 8,
    "neuf": 9,
    "dix": 10,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
}
DETECTION_REQUEST_STOP_WORDS = {
    "a", "all", "and", "can", "called", "detection", "detections", "disease",
    "diseases", "display", "for", "from", "get", "image", "images", "in",
    "load", "me", "my", "named", "of", "on", "only", "photo", "photos",
    "picture", "pictures", "plant", "please", "record", "records", "see",
    "show", "specific", "the", "this", "to", "what", "you",
    "au", "aux", "de", "des", "du", "et", "image", "la", "le", "les",
    "maladie", "maladies", "mon", "ma", "mes", "photo", "photos", "pour",
    "plante", "plantes", "quel", "quelle", "quels", "quelles", "sur",
    "un", "une", "voir",
}


def _normalize_text(value: str) -> str:
    decomposed = unicodedata.normalize("NFKD", value.casefold())
    without_accents = "".join(
        character
        for character in decomposed
        if not unicodedata.combining(character)
    )
    return re.sub(r"[_'’\-]+", " ", without_accents)


def _is_out_of_scope_question(
    question: str,
    conversation_history: list[dict] | None = None,
) -> bool:
    explicit_unrelated_topics = re.compile(
        r"\b("
        r"python|javascript|typescript|java|c\\+\\+|programming|code|coding|"
        r"software|computer|internet|website|app|android|windows|linux|"
        r"math|mathematics|calculus|equation|physics|chemistry|biology|"
        r"movie|film|music|song|game|football|basketball|politics|president|"
        r"election|country|capital|geography|celebrity|recipe|"
        r"cuisine|cook|cooking|python|weather forecast|stock|cryptocurrency|"
        r"programmation|logiciel|informatique|ordinateur|internet|site web|"
        r"mathematique|physique|chimie|biologie|film|musique|chanson|jeu|"
        r"football|politique|president|election|pays|capitale|geographie|"
        r"celebrite|recette|cuisine|cuisson|bourse|cryptomonnaie"
        r")\b",
        re.IGNORECASE,
    )
    normalized_question = _normalize_text(question)
    if explicit_unrelated_topics.search(normalized_question):
        return True

    agriculture_topics = re.compile(
        r"\b("
        r"agri|farm|farming|crop|crops|plant|plants|tomato|tomatoes|soil|"
        r"seed|seeds|seedling|harvest|irrigation|fertiliz|pesticide|"
        r"fungicide|disease|diseases|blight|mildew|mold|mould|rust|rot|"
        r"wilt|leaf|leaves|greenhouse|hydropon|nutrient|nutrients|"
        r"sensor|sensors|reading|readings|humidity|temperature|ph|tds|"
        r"water level|light|lux|detection|detections|"
        r"agriculture|agricole|exploitation|ferme|culture|cultures|"
        r"plante|plantes|tomate|tomates|sol|semence|semences|semis|"
        r"recolte|irrigation|engrais|pesticide|fongicide|maladie|maladies|"
        r"mildiou|oidium|moisissure|rouille|pourriture|fletrissement|"
        r"feuille|feuilles|serre|hydroponique|nutriment|nutriments|"
        r"capteur|capteurs|releve|releves|mesure|mesures|humidite|"
        r"temperature|niveau d eau|lumiere|de tection|detections"
        r")\b",
        re.IGNORECASE,
    )
    if agriculture_topics.search(normalized_question):
        return False

    history_text = " ".join(
        str(message.get("content") or "")
        for message in (conversation_history or [])
        if message.get("role") in {"user", "assistant"}
    )
    if history_text and agriculture_topics.search(_normalize_text(history_text)):
        return False

    return True


def _normalized_name_tokens(value: str | None) -> list[str]:
    return re.findall(r"[a-z0-9]+", _normalize_text(value or ""))


def _asks_for_sensor_data(question: str) -> bool:
    return bool(
        re.search(
            r"\b(sensor|readings?|measurements?|capteurs?|releves?|mesures?|lectures?|"
            r"ph|tds|humidity|humidite|light|lumiere|water\s+level|"
            r"niveau\s+d\s+eau|(?:air|water)\s+temperature|temperature)\b",
            question,
        )
    )


def _asks_for_sensor_chart(
    question: str,
    requested_sensor_count: int | None = None,
) -> bool:
    asks_for_measurements_or_trends = _asks_for_sensor_data(question) and bool(
        re.search(
            r"\b(readings?|measurements?|history|historical|trend\w*|"
            r"over\s+time|releves?|mesures?|lectures?|historique|"
            r"tendance\w*|evolution)\b",
            question,
        )
    )
    asks_for_latest = bool(
        re.search(
            r"\b(current|currently|now|right\s+now|latest|most\s+recent|"
            r"actuel\w*|maintenant|en\s+ce\s+moment)\b",
            question,
        )
    )
    return asks_for_measurements_or_trends and (
        not asks_for_latest or requested_sensor_count is not None
    )


def _format_conversation_history(messages: list[dict]) -> str:
    history_lines = []
    for message in messages:
        role = message.get("role")
        content = str(message.get("content") or "").strip()
        if role not in {"user", "assistant"} or not content:
            continue
        speaker = "Utilisateur" if role == "user" else "Assistant"
        history_lines.append(f"{speaker} : {content}")

    if not history_lines:
        return ""
    return "--- HISTORIQUE DE LA CONVERSATION ---\n" + "\n".join(history_lines)


def _mentions_today(question: str) -> bool:
    if re.search(r"\b(?:today|aujourd\s+hui)\b", question):
        return True
    return any(_is_today_word(word) for word in re.findall(r"[a-z]+", question))


def _disease_name_tokens(detection: dict) -> list[str]:
    disease_tokens = _normalized_name_tokens(detection.get("prediction"))
    crop_tokens = _normalized_name_tokens(detection.get("crop"))
    if crop_tokens and disease_tokens[:len(crop_tokens)] == crop_tokens:
        return disease_tokens[len(crop_tokens):]
    return disease_tokens


def _contains_token_sequence(tokens: list[str], sequence: list[str]) -> bool:
    return any(
        tokens[index:index + len(sequence)] == sequence
        for index in range(len(tokens) - len(sequence) + 1)
    )


def _is_today_word(word: str) -> bool:
    if word == "today":
        return True
    if not 4 <= len(word) <= 6:
        return False

    left = right = edits = 0
    while left < len(word) and right < len("today"):
        if word[left] == "today"[right]:
            left += 1
            right += 1
            continue

        edits += 1
        if edits > 1:
            return False
        if len(word) > len("today"):
            left += 1
        elif len(word) < len("today"):
            right += 1
        else:
            left += 1
            right += 1

    edits += (len(word) - left) + (len("today") - right)
    return edits <= 1


def filter_disease_detections(
    question: str,
    detections: list[dict],
) -> tuple[list[dict], bool]:
    question_tokens = _normalized_name_tokens(question)
    matching_names = {
        tuple(_normalized_name_tokens(detection.get("prediction")))
        for detection in detections
        if _disease_name_tokens(detection)
        and _contains_token_sequence(question_tokens, _disease_name_tokens(detection))
    }
    if matching_names:
        return [
            detection
            for detection in detections
            if tuple(_normalized_name_tokens(detection.get("prediction"))) in matching_names
        ], True

    named_phrase = re.search(
        r"\b(?:of|for|named|called|de|du|des|pour|nomme|appele)\b(.+)",
        _normalize_text(question),
    )
    if named_phrase:
        phrase_tokens = set(_normalized_name_tokens(named_phrase.group(1)))
        has_specific_name = bool(phrase_tokens - DETECTION_REQUEST_STOP_WORDS)
        if has_specific_name:
            return [], True

    return detections, False


class ChatService:
    def __init__(
        self,
        db_pool: asyncpg.Pool,
        gemini_api_key: str,
        gemini_model: str = "gemini-3.1-flash-lite",
    ):
        self.db_pool = db_pool
        self.gemini_client = genai.Client(api_key=gemini_api_key)
        self.gemini_model = gemini_model
        self.chat_model = ChatGoogleGenerativeAI(
            model=gemini_model,
            api_key=gemini_api_key,
            vertexai=False,
            temperature=0.2,
        )
        self.chat_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", "{system_instruction}"),
                (
                    "human",
                    "{context}\n{conversation_history}\n"
                    "Question de l’utilisateur : {question}",
                ),
            ]
        )

    async def _get_embedding(self, text: str) -> list[float]:
        """Generates a query embedding using the document-ingestion model."""
        response = self.gemini_client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=text,
            config=types.EmbedContentConfig(
                output_dimensionality=EMBEDDING_DIMENSIONS
            )
        )
        if not response.embeddings or not response.embeddings[0].values:
            raise RuntimeError("Le modèle d’embedding n’a pas renvoyé le vecteur de la question.")
        return response.embeddings[0].values

    async def get_sensor_readings(self, user_id: UUID) -> list[dict]:
        async with self.db_pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT temperature, humidity, water_temperature, water_level, ph, tds, light, recorded_at as timestamp
                FROM sensor_readings sr
                JOIN plants p ON sr.plant_id = p.id
                WHERE p.user_id = $1
                ORDER BY sr.recorded_at DESC
                """,
                user_id
            )
            return [dict(row) for row in rows]

    async def get_sensor_readings_for_today(self, user_id: UUID) -> list[dict]:
        async with self.db_pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT temperature, humidity, water_temperature, water_level, ph, tds, light,
                       recorded_at as timestamp
                FROM sensor_readings sr
                JOIN plants p ON sr.plant_id = p.id
                WHERE p.user_id = $1
                  AND sr.recorded_at >= CURRENT_DATE
                  AND sr.recorded_at < CURRENT_DATE + INTERVAL '1 day'
                ORDER BY sr.recorded_at DESC
                """,
                user_id,
            )
            return [dict(row) for row in rows]

    async def get_latest_sensor_reading_before_today(self, user_id: UUID) -> dict:
        async with self.db_pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                SELECT temperature, humidity, water_temperature, water_level, ph, tds, light,
                       recorded_at as timestamp
                FROM sensor_readings sr
                JOIN plants p ON sr.plant_id = p.id
                WHERE p.user_id = $1
                  AND sr.recorded_at < CURRENT_DATE
                ORDER BY sr.recorded_at DESC
                LIMIT 1
                """,
                user_id,
            )
            return dict(row) if row else {}

    async def get_latest_disease_detection(self, user_id: UUID) -> dict:
        async with self.db_pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                SELECT dd.disease as prediction, dd.confidence, dd.image_path, dd.detected_at as detection_time
                FROM disease_detections dd
                JOIN plants p ON dd.plant_id = p.id
                WHERE p.user_id = $1
                ORDER BY dd.detected_at DESC
                LIMIT 1;
                """,
                user_id
            )
            return dict(row) if row else {}

    async def get_disease_detections_for_today(self, user_id: UUID) -> list[dict]:
        async with self.db_pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT dd.id::text as id, dd.crop, dd.disease as prediction,
                       dd.confidence, dd.image_path,
                       dd.detected_at as detection_time, p.name as plant_name
                FROM disease_detections dd
                JOIN plants p ON dd.plant_id = p.id
                WHERE p.user_id = $1
                  AND dd.detected_at >= CURRENT_DATE
                  AND dd.detected_at < CURRENT_DATE + INTERVAL '1 day'
                ORDER BY dd.detected_at DESC
                """,
                user_id,
            )
            return [dict(row) for row in rows]

    async def get_latest_disease_detection_before_today(self, user_id: UUID) -> dict:
        async with self.db_pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                SELECT dd.disease as prediction, dd.confidence, dd.image_path,
                       dd.detected_at as detection_time
                FROM disease_detections dd
                JOIN plants p ON dd.plant_id = p.id
                WHERE p.user_id = $1
                  AND dd.detected_at < CURRENT_DATE
                ORDER BY dd.detected_at DESC
                LIMIT 1
                """,
                user_id,
            )
            return dict(row) if row else {}

    async def get_disease_detections(self, user_id: UUID) -> list[dict]:
        async with self.db_pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT dd.id::text as id, dd.crop, dd.disease as prediction,
                       dd.confidence, dd.image_path,
                       dd.detected_at as detection_time, p.name as plant_name
                FROM disease_detections dd
                JOIN plants p ON dd.plant_id = p.id
                WHERE p.user_id = $1
                ORDER BY dd.detected_at DESC;
                """,
                user_id,
            )
            return [dict(row) for row in rows]

    async def get_yesterdays_disease_detections(self, user_id: UUID) -> list[dict]:
        async with self.db_pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT dd.disease as prediction, dd.confidence,
                       dd.detected_at as detection_time
                FROM disease_detections dd
                JOIN plants p ON dd.plant_id = p.id
                WHERE p.user_id = $1
                  AND dd.detected_at >= CURRENT_DATE - INTERVAL '1 day'
                  AND dd.detected_at < CURRENT_DATE
                ORDER BY dd.detected_at DESC;
                """,
                user_id,
            )
            return [dict(row) for row in rows]

    async def search_knowledge_base(
        self,
        query_embedding: list[float],
        user_id: UUID,
        limit: int = 3,
    ) -> list[dict]:
        """Searches Chroma and confirms the matching documents are still active."""
        matches = await asyncio.to_thread(
            get_chroma_store().search,
            query_embedding,
            user_id,
            limit,
        )
        if not matches:
            return []

        document_ids = list({UUID(match["document_id"]) for match in matches})
        async with self.db_pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT id, filename
                FROM documents
                WHERE user_id = $1 AND id = ANY($2::uuid[])
                """,
                user_id,
                document_ids,
            )
        active_documents = {row["id"]: row["filename"] for row in rows}
        return [
            {
                "document_name": active_documents[UUID(match["document_id"])],
                "chunk_index": match["chunk_index"],
                "content": match["content"],
                "distance": match["distance"],
            }
            for match in matches
            if UUID(match["document_id"]) in active_documents
        ]

    async def process_chat_turn(
        self,
        user_id: UUID,
        session_id: UUID,
        user_message: str,
        conversation_history: list[dict] | None = None,
    ) -> dict:
        question = user_message.strip()
        if not question:
            raise ValueError("Veuillez saisir une question.")

        normalized_question = _normalize_text(question)
        if _is_out_of_scope_question(normalized_question, conversation_history):
            uses_french = bool(re.search(r"\b(le|la|les|de|du|des|est|dans|pour|avec|bonjour|comment|quelle|quel)\b", normalized_question))
            answer = (
                "Je peux uniquement vous aider avec l’agriculture, les cultures, "
                "les relevés de capteurs et les détections de maladies."
                if uses_french
                else "I can only help with agriculture, crops, sensor readings, and disease detections."
            )
            return {
                "session_id": session_id,
                "answer": answer,
                "sources_used": [],
                "sensor_snapshot": {},
                "sensor_readings": [],
                "sensor_chart_readings": [],
                "detection_snapshot": {},
                "detection_history": [],
                "disease_detections": [],
            }

        asks_for_sensor_data = _asks_for_sensor_data(normalized_question)
        count_pattern = (
            r"(\d+|one|two|three|four|five|six|seven|eight|nine|ten|"
            r"un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix)"
        )
        recency_pattern = (
            r"(?:last|latest|most recent|past|previous|dernier(?:e|s|es)?|"
            r"precedent(?:e|s|es)?|plus\s+recent(?:e|s|es)?)"
        )
        sensor_count_match = re.search(
            rf"\b{recency_pattern}\s+{count_pattern}\b",
            normalized_question,
        )
        count_match = re.search(
            rf"\b{count_pattern}\s+{recency_pattern}\b",
            normalized_question,
        )
        requested_sensor_count = None
        if sensor_count_match:
            count_text = sensor_count_match.group(1)
        elif count_match:
            count_text = count_match.group(1)
        else:
            count_text = None
        if count_text:
            requested_sensor_count = SENSOR_READING_COUNT_WORDS.get(
                count_text,
                int(count_text) if count_text.isdigit() else None,
            )
        asks_for_all_sensor_readings = asks_for_sensor_data and (
            requested_sensor_count is not None
            or bool(re.search(
                r"\b(all|every|entire|full|history|historical|records?|"
                r"tout|tous|toute|toutes|ensemble|historique|archives?)\b",
                normalized_question,
            ))
        )
        asks_for_current_sensor = bool(
            re.search(
                r"\b(?:current|latest|my|mon|ma|mes|actuel(?:le|s|les)?|"
                r"dernier(?:e|s|es)?)\s+(?:current\s+)?"
                r"(?:ph|tds|sensor|capteurs?|readings?|releves?|mesures?|lectures?|"
                r"temperature|humidite|lumiere|"
                r"light|water(?:\s+level|\s+temperature)?|niveau\s+d\s+eau)\b",
                normalized_question,
            )
        ) or bool(
            re.search(
                r"\b(?:ph|tds|sensor|capteurs?|readings?|releves?|mesures?|lectures?|"
                r"temperature|humidite|lumiere|"
                r"light|water(?:\s+level|\s+temperature)?|niveau\s+d\s+eau)\s+"
                r"(?:current|latest|actual|actuel(?:le|s|les)?|"
                r"dernier(?:e|s|es)?)\b",
                normalized_question,
            )
        ) or (
            bool(
                re.search(
                    r"\b(?:right\s+now|now|maintenant|en\s+ce\s+moment)\b",
                    normalized_question,
                )
            )
            and asks_for_sensor_data
        )
        asks_for_sensor_chart = _asks_for_sensor_chart(
            normalized_question,
            requested_sensor_count,
        )
        mentions_today = _mentions_today(normalized_question)
        asks_for_sensor_today = mentions_today and asks_for_sensor_data
        asks_for_detections_today = bool(
            mentions_today
            and re.search(
                r"\b(detect\w*|diagnos\w*|image|photo|picture|history|record\w*|"
                r"found|seen|historique|enregistr\w*|trouv\w*|observ\w*|vu|"
                r"maladie\w*)\b",
                normalized_question,
            )
        )
        asks_for_yesterdays_detection = bool(
            re.search(r"\b(?:yesterday|hier)\b", normalized_question)
        )
        asks_for_disease_treatment = bool(
            re.search(
                r"\b(treat\w*|manage\w*|cur\w*|control\w*|remed\w*|prevent\w*|"
                r"fungicide|chemical|symptom\w*|guidance|guide|recommend\w*|"
                r"trait\w*|soign\w*|guer\w*|ger\w*|lutt\w*|traitement\w*|"
                r"fongicide\w*|produit\w*|chimique\w*|symptome\w*|conseil\w*|"
                r"prevenir|proteger|protection|recommand\w*)\b",
                normalized_question,
            )
        )
        asks_for_detection_history = bool(
            re.search(
                r"\b(detect\w*|detection\w*|diagnos\w*|image\w*|photo\w*|picture\w*|"
                r"history|record\w*|found|seen|historique|enregistr\w*|trouv\w*|"
                r"observ\w*|photo\w*|image\w*)\b",
                normalized_question,
            )
        ) and bool(
            re.search(
                r"\b(disease\w*|detect\w*|image\w*|photo\w*|picture\w*|"
                r"diagnos\w*|infection\w*|infected|sick|blight|spot|mildew|"
                r"mosaic|rust|rot|wilt|canker|scab|septoria|anthracnose|target|"
                r"maladie\w*|infection\w*|infect\w*|mildiou|oidium|tache\w*|"
                r"mosaique|rouille|pourriture|fletr\w*|chancre\w*|gale|"
                r"septoriose|anthracnose)\b",
                normalized_question,
            )
        )
        asks_for_disease_guidance = asks_for_disease_treatment or (
            not asks_for_detection_history
            and bool(
                re.search(
                    r"\b(disease\w*|infection\w*|infected|sick|fung\w*|"
                    r"blight|spot|mildew|mosaic|rust|rot|wilt|canker|scab|"
                    r"septoria|anthracnose|target|maladie\w*|infection\w*|"
                    r"infect\w*|fung\w*|mildiou|oidium|tache\w*|mosaique|"
                    r"rouille|pourriture|fletr\w*|chancre\w*|gale|septoriose)\b",
                    normalized_question,
                )
            )
        )

        knowledge_chunks = []
        if not (
            asks_for_current_sensor
            or asks_for_all_sensor_readings
            or asks_for_sensor_today
            or asks_for_detections_today
            or asks_for_yesterdays_detection
        ):
            query_embedding = await self._get_embedding(question)
            knowledge_chunks = await self.search_knowledge_base(
                query_embedding,
                user_id,
                limit=3,
            )

        sensor_readings = (
            []
            if asks_for_sensor_today or asks_for_detections_today
            else await self.get_sensor_readings(user_id)
        )
        requested_sensor_readings = (
            sensor_readings[:requested_sensor_count]
            if requested_sensor_count is not None
            else sensor_readings
        )
        latest_sensor = sensor_readings[0] if sensor_readings else {}
        sensor_readings_today = (
            await self.get_sensor_readings_for_today(user_id)
            if asks_for_sensor_today
            else []
        )
        if asks_for_sensor_today and not sensor_readings_today:
            latest_sensor_before_today = await self.get_latest_sensor_reading_before_today(user_id)
        else:
            latest_sensor_before_today = {}
        latest_detection = (
            await self.get_latest_disease_detection(user_id)
            if not (
                asks_for_yesterdays_detection
                or asks_for_disease_guidance
                or asks_for_detection_history
                or asks_for_sensor_today
            )
            else {}
        )
        detection_history = (
            await self.get_yesterdays_disease_detections(user_id)
            if asks_for_yesterdays_detection
            else []
        )
        disease_detections = (
            await self.get_disease_detections(user_id)
            if asks_for_detection_history and not asks_for_detections_today
            else []
        )
        disease_detections_today = (
            await self.get_disease_detections_for_today(user_id)
            if asks_for_detections_today
            else []
        )
        if asks_for_detections_today and not disease_detections_today:
            latest_detection_before_today = (
                await self.get_latest_disease_detection_before_today(user_id)
            )
        else:
            latest_detection_before_today = {}
        has_disease_filter = False
        if asks_for_detection_history and not asks_for_detections_today:
            disease_detections, has_disease_filter = filter_disease_detections(
                question,
                disease_detections,
            )
        if disease_detections and not asks_for_yesterdays_detection:
            latest_detection = disease_detections[0]
        elif asks_for_detection_history:
            latest_detection = {}
        context_str = "--- EXTRAITS DE CONNAISSANCES AGRICOLES ---\n"
        for chunk in knowledge_chunks:
            context_str += (
                f"Source : {chunk['document_name']} "
                f"(extrait n° {chunk['chunk_index']})\n"
                f"{chunk['content']}\n\n"
            )

        if asks_for_sensor_today:
            context_str += "--- RELEVÉS DES CAPTEURS ENREGISTRÉS AUJOURD’HUI ---\n"
            requested_today_readings = (
                sensor_readings_today[:requested_sensor_count]
                if requested_sensor_count is not None
                else sensor_readings_today
            )
            if requested_today_readings:
                for reading in requested_today_readings:
                    context_str += (
                        f"Enregistré le : {reading.get('timestamp')} ; "
                        f"pH : {reading.get('ph')}, TDS : {reading.get('tds')} ppm, "
                        f"température de l’air : {reading.get('temperature')} °C, "
                        f"humidité : {reading.get('humidity')} %, "
                        f"température de l’eau : {reading.get('water_temperature')} °C, "
                        f"niveau d’eau : {reading.get('water_level')} %, "
                        f"luminosité : {reading.get('light')}\n"
                    )
            else:
                context_str += "Aucun relevé de capteur n’a été enregistré aujourd’hui.\n"
                if latest_sensor_before_today:
                    context_str += (
                        f"Le dernier relevé disponible avant aujourd’hui date du "
                        f"{latest_sensor_before_today.get('timestamp')} : "
                        f"pH {latest_sensor_before_today.get('ph')}, "
                        f"TDS {latest_sensor_before_today.get('tds')} ppm, "
                        f"température de l’air {latest_sensor_before_today.get('temperature')} °C, "
                        f"humidité {latest_sensor_before_today.get('humidity')} %, "
                        f"température de l’eau "
                        f"{latest_sensor_before_today.get('water_temperature')} °C, "
                        f"niveau d’eau {latest_sensor_before_today.get('water_level')} %, "
                        f"luminosité {latest_sensor_before_today.get('light')}.\n"
                    )
                else:
                    context_str += "Aucun relevé antérieur n’est disponible.\n"

        if asks_for_all_sensor_readings and not asks_for_sensor_today:
            context_str += "--- RELEVÉS DE CAPTEURS DEMANDÉS ---\n"
            if requested_sensor_readings:
                for reading in requested_sensor_readings:
                    context_str += (
                        f"Enregistré le : {reading.get('timestamp')} ; "
                        f"pH : {reading.get('ph')}, TDS : {reading.get('tds')} ppm, "
                        f"température de l’air : {reading.get('temperature')} °C, "
                        f"humidité : {reading.get('humidity')} %, "
                        f"température de l’eau : {reading.get('water_temperature')} °C, "
                        f"niveau d’eau : {reading.get('water_level')} %, "
                        f"luminosité : {reading.get('light')}\n"
                    )
            else:
                context_str += "Aucun relevé de capteur n’est disponible.\n"

        if asks_for_detections_today:
            context_str += "--- DÉTECTIONS DE MALADIES ENREGISTRÉES AUJOURD’HUI ---\n"
            if disease_detections_today:
                for detection in disease_detections_today:
                    context_str += (
                        f"Détectée le : {detection.get('detection_time')} ; "
                        f"plante : {detection.get('plant_name')} ; "
                        f"culture : {detection.get('crop')} ; "
                        f"prédiction : {detection.get('prediction')} ; "
                        f"confiance : {detection.get('confidence')}\n"
                    )
            else:
                context_str += "Aucune maladie n’a été détectée aujourd’hui.\n"
                if latest_detection_before_today:
                    context_str += (
                        f"La dernière détection antérieure date du "
                        f"{latest_detection_before_today.get('detection_time')}: "
                        f"{latest_detection_before_today.get('prediction')} "
                        f"(confiance : {latest_detection_before_today.get('confidence')}).\n"
                    )
                else:
                    context_str += "Aucune détection antérieure n’est disponible.\n"

        if not (
            asks_for_sensor_today
            or asks_for_all_sensor_readings
            or asks_for_detections_today
        ):
            context_str += "--- DERNIERS RELEVÉS DE CAPTEURS ---\n"
            if latest_sensor:
                context_str += f"Horodatage : {latest_sensor.get('timestamp')}\n" \
                               f"pH : {latest_sensor.get('ph')}, TDS : {latest_sensor.get('tds')} ppm, " \
                               f"température de l’eau : {latest_sensor.get('water_temperature')} °C, " \
                               f"niveau d’eau : {latest_sensor.get('water_level')} %\n\n"
            else:
                context_str += "Aucune donnée récente de capteur n’est disponible.\n\n"

        if not (asks_for_sensor_today or asks_for_detections_today):
            context_str += "--- DERNIÈRE DÉTECTION DE MALADIE (YOLO) ---\n"
            if latest_detection:
                context_str += f"Date : {latest_detection.get('detection_time')}\n" \
                               f"Prédiction : {latest_detection.get('prediction')} " \
                               f"(confiance : {latest_detection.get('confidence')})\n\n"
            elif not (asks_for_yesterdays_detection or asks_for_detection_history):
                context_str += "Aucune détection récente de maladie.\n\n"

        if asks_for_yesterdays_detection:
            context_str += "--- DÉTECTIONS DE MALADIES D’HIER ---\n"
            if detection_history:
                for detection in detection_history:
                    context_str += (
                        f"Date : {detection.get('detection_time')}\n"
                        f"Prédiction : {detection.get('prediction')} "
                        f"(confiance : {detection.get('confidence')})\n\n"
                    )
            else:
                context_str += "Aucune détection de maladie n’a été enregistrée hier.\n\n"

        if asks_for_detection_history and not asks_for_detections_today:
            context_str += "--- DÉTECTIONS DE MALADIES CORRESPONDANTES ---\n"
            if disease_detections:
                for detection in disease_detections[:20]:
                    context_str += (
                        f"Plante : {detection.get('plant_name')}, "
                        f"culture : {detection.get('crop')}, "
                        f"prédiction : {detection.get('prediction')}, "
                        f"confiance : {detection.get('confidence')}, "
                        f"date : {detection.get('detection_time')}\n"
                    )
            else:
                context_str += (
                    "Aucune détection de maladie correspondante n’a été trouvée.\n"
                    if has_disease_filter
                    else "Aucune détection de maladie n’a été trouvée.\n"
                )
            if len(disease_detections) > 20:
                context_str += (
                    f"Les 20 enregistrements les plus récents sur {len(disease_detections)} "
                    "sont inclus dans ce contexte. L’application affiche tous les enregistrements.\n"
                )

        conversation_history_str = _format_conversation_history(
            conversation_history or []
        )
        system_instruction = (
            "Tu es un assistant expert en agriculture intelligente, spécialisé dans la culture "
            "de la tomate, les données des capteurs et la gestion des maladies. Réponds toujours "
            "en français, quelle que soit la langue de la question ou des documents. Réponds de "
            "manière claire et naturelle. Utilise les connaissances agricoles récupérées, les "
            "relevés de capteurs et les détections fournis. N’invente aucune mesure ni détection. "
            "Distingue les recommandations documentées des mesures réelles et des prédictions "
            "du modèle. Pour les symptômes, présente des explications possibles sans affirmer "
            "qu’il s’agit d’un diagnostic certain. Cite les documents sources et les horodatages "
            "lorsqu’ils sont disponibles.\n\n"
            "Pour toute question sur les données d’aujourd’hui, utilise uniquement les données "
            "explicitement indiquées comme enregistrées aujourd’hui. S’il n’y en a pas, précise-le "
            "et, si elle est fournie, indique la date et les détails de la dernière donnée "
            "antérieure. Ne présente jamais une donnée antérieure comme une donnée d’aujourd’hui.\n\n"
            "Périmètre et informations manquantes : détermine d’abord si la question porte sur "
            "l’agriculture ou peut être résolue à partir des données et connaissances fournies. "
            "Si elle est hors sujet ou demande une information absente du contexte (par exemple, "
            "la météo locale en temps réel), ne réponds pas à partir de connaissances générales "
            "et ne cite pas de relevés, de détections ou de documents sans rapport. Réponds "
            "brièvement et naturellement en français : indique que cette information n’est pas "
            "disponible ou que la demande sort de ton rôle, rappelle que tu aides sur l’agriculture "
            "et propose une question agricole pertinente. Adapte la formulation à la demande au "
            "lieu de répéter une phrase de repli fixe. Si une partie de la question peut recevoir "
            "une réponse étayée, réponds uniquement à cette partie et précise ce qui manque.\n\n"
            "Pour les conseils agricoles, les extraits récupérés depuis la base de connaissances "
            "sont la source de référence. Si aucun extrait pertinent n’a été trouvé, indique que "
            "les documents importés ne contiennent pas assez d’informations. Ne complète pas les "
            "informations manquantes avec des connaissances générales. Les questions sur les "
            "capteurs et les détections peuvent s’appuyer sur les données correspondantes fournies."
        )
        if conversation_history_str:
            system_instruction += (
                "\n\nUtilise l’historique de conversation uniquement pour comprendre les "
                "références ; les faits doivent rester fondés sur les sources et les données "
                "fournies pour ce tour."
            )
        if asks_for_disease_guidance:
            system_instruction += (
                "\n\nPour cette question sur une maladie ou son traitement, réponds en Markdown "
                "avec les sections suivantes, dans cet ordre :\n"
                "## 1. Présentation de la maladie\n"
                "Identifie la maladie demandée. Indique l’agent pathogène et les conditions "
                "favorables (notamment la température et l’humidité) uniquement si le guide "
                "récupéré les confirme ; sinon, précise que le guide ne les indique pas.\n"
                "## 2. Symptômes et prise en charge\n"
                "Résume les symptômes documentés, puis utilise ### A. Gestion environnementale "
                "pour les pratiques culturales et ### B. Traitement chimique pour les produits "
                "nommés dans le guide. Présente les produits et leur usage documenté dans un "
                "tableau Markdown. N’invente ni produit, ni dose, ni calendrier d’application, "
                "ni efficacité. Si aucun produit chimique n’est cité dans le guide, indique-le. "
                "Ajoute cette précaution : n’utilise que des produits autorisés pour cette culture "
                "dans le pays de l’utilisateur, respecte l’étiquette et consulte un spécialiste "
                "agricole local avant toute application.\n"
                "## 3. Prévention\n"
                "Présente les pratiques de prévention documentées dans un tableau Markdown. "
                "N’ajoute aucune pratique non étayée.\n"
                "Fais correspondre la maladie et les faits à la question et aux sources récupérées. "
                "Si le guide ne traite pas la maladie ou un détail demandé, précise-le au lieu de "
                "deviner. Cite le nom des documents sources."
            )
        if asks_for_all_sensor_readings:
            if requested_sensor_count is not None:
                system_instruction += (
                    f"\n\nL’utilisateur demande les {requested_sensor_count} relevés de capteurs "
                    "les plus récents. Utilise tous les relevés fournis ; ne prétends pas que "
                    "l’historique est indisponible s’il est présent. Présente chaque relevé avec "
                    "son horodatage et ses mesures. L’application affiche également ces relevés "
                    "dans un tableau."
                )
            else:
                system_instruction += (
                    "\n\nL’utilisateur demande tous les relevés de capteurs. Utilise l’historique "
                    "complet fourni, pas seulement la dernière mesure. Présente chaque relevé avec "
                    "son horodatage et ses mesures ; n’omet aucun relevé ancien et ne résume pas "
                    "l’historique à la seule dernière valeur. L’application affiche également "
                    "ces relevés dans un tableau."
                )

        chat_chain = (
            self.chat_prompt
            | self.chat_model.bind(
                max_output_tokens=(
                    4096
                    if asks_for_all_sensor_readings
                    else 2048
                    if asks_for_disease_treatment
                    else 1024
                )
            )
            | StrOutputParser()
        )
        answer = await chat_chain.ainvoke(
            {
                "system_instruction": system_instruction,
                "context": context_str,
                "conversation_history": conversation_history_str,
                "question": question,
            }
        )

        if not answer or not answer.strip():
            raise RuntimeError("Le modèle d’IA a renvoyé une réponse vide.")

        sensor_chart_readings: list[dict] = []
        if asks_for_sensor_chart:
            if asks_for_sensor_today:
                reading_limit = requested_sensor_count or SENSOR_CHART_READING_LIMIT
                sensor_chart_readings = sensor_readings_today[:reading_limit]
            elif requested_sensor_count is not None:
                sensor_chart_readings = sensor_readings[:requested_sensor_count]
            else:
                sensor_chart_readings = sensor_readings[:SENSOR_CHART_READING_LIMIT]

        return {
            "session_id": session_id,
            "answer": answer,
            "sources_used": [
                {"document": c["document_name"], "chunk_index": c["chunk_index"]} for c in knowledge_chunks
            ],
            "sensor_snapshot": (
                sensor_readings_today[0]
                if asks_for_sensor_today and sensor_readings_today
                else {}
                if asks_for_sensor_today or asks_for_detections_today
                else latest_sensor
            ),
            "sensor_readings": (
                sensor_readings_today
                if asks_for_sensor_today and requested_sensor_count is None
                else sensor_readings_today[:requested_sensor_count]
                if asks_for_sensor_today
                else requested_sensor_readings
                if asks_for_all_sensor_readings
                else sensor_readings[:1]
                if asks_for_current_sensor or asks_for_sensor_data
                else []
            ),
            "sensor_chart_readings": sensor_chart_readings,
            "detection_snapshot": (
                disease_detections_today[0]
                if asks_for_detections_today and disease_detections_today
                else {}
                if asks_for_sensor_today or asks_for_detections_today
                else latest_detection
            ),
            "detection_history": detection_history,
            "disease_detections": (
                disease_detections_today
                if asks_for_detections_today
                else disease_detections
            ),
        }
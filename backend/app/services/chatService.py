import re
from uuid import UUID

import asyncpg
from google import genai
from google.genai import types

EMBEDDING_MODEL = "gemini-embedding-2"
DETECTION_REQUEST_STOP_WORDS = {
    "a", "all", "and", "can", "called", "detection", "detections", "disease",
    "diseases", "display", "for", "from", "get", "image", "images", "in",
    "load", "me", "my", "named", "of", "on", "only", "photo", "photos",
    "picture", "pictures", "plant", "please", "record", "records", "see",
    "show", "specific", "the", "this", "to", "what", "you",
}


def _normalized_name_tokens(value: str | None) -> list[str]:
    return re.findall(r"[a-z0-9]+", (value or "").casefold())


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

    named_phrase = re.search(r"\b(?:of|for|named|called)\b(.+)", question.casefold())
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

    async def _get_embedding(self, text: str) -> list[float]:
        """Generates a query embedding using the document-ingestion model."""
        response = self.gemini_client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=text,
            config=types.EmbedContentConfig(output_dimensionality=768)
        )
        if not response.embeddings or not response.embeddings[0].values:
            raise RuntimeError("The embedding model returned no query embedding.")
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
        """Searches this user's document chunks by vector similarity."""
        async with self.db_pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT d.filename as document_name, c.chunk_index, c.content,
                       (c.embedding <=> $1::vector) as distance
                FROM document_chunks c
                JOIN documents d ON c.document_id = d.id
                WHERE d.user_id = $2
                ORDER BY distance ASC
                LIMIT $3;
                """,
                str(query_embedding), user_id, limit
            )
            return [dict(row) for row in rows]

    async def process_chat_turn(
        self,
        user_id: UUID,
        session_id: int,
        user_message: str,
    ) -> dict:
        question = user_message.strip()
        if not question:
            raise ValueError("Please enter a question.")

        normalized_question = re.sub(r"[_-]+", " ", question.casefold())
        asks_for_current_sensor = bool(
            re.search(
                r"\b(?:current|latest|my)\s+(?:current\s+)?"
                r"(?:ph|tds|sensor|temperature|humidity|light|water(?:\s+level|\s+temperature)?)\b",
                normalized_question,
            )
        ) or (
            "right now" in normalized_question
            and bool(
                re.search(
                    r"\b(?:ph|tds|sensor|temperature|humidity|light|water)\b",
                    normalized_question,
                )
            )
        )
        mentions_today = any(
            _is_today_word(word)
            for word in re.findall(r"[a-z]+", normalized_question)
        )
        asks_for_sensor_today = bool(
            mentions_today
            and re.search(
                r"\b(sensor|readings?|measurements?|ph|tds|humidity|light|water\s+level|"
                r"(?:air|water)\s+temperature)\b",
                normalized_question,
            )
        )
        asks_for_detections_today = bool(
            mentions_today
            and re.search(
                r"\b(detect\w*|diagnos\w*|image|photo|picture|history|record\w*|found|seen)\b",
                normalized_question,
            )
        )
        asks_for_yesterdays_detection = "yesterday" in normalized_question
        asks_for_disease_treatment = bool(
            re.search(
                r"\b(treat\w*|manage\w*|cur\w*|control\w*|remed\w*|prevent\w*|"
                r"fungicide|chemical|symptom\w*|guidance|guide|recommend\w*)\b",
                normalized_question,
            )
        )
        asks_for_detection_history = bool(
            re.search(
                r"\b(detect\w*|detection\w*|diagnos\w*|image\w*|photo\w*|picture\w*|"
                r"history|record\w*|found|seen)\b",
                normalized_question,
            )
        ) and bool(
            re.search(
                r"\b(disease\w*|detect\w*|image\w*|photo\w*|picture\w*|"
                r"diagnos\w*|infection\w*|infected|sick|blight|spot|mildew|"
                r"mosaic|rust|rot|wilt|canker|scab|septoria|anthracnose|target)\b",
                normalized_question,
            )
        )
        asks_for_disease_guidance = asks_for_disease_treatment or (
            not asks_for_detection_history
            and bool(
                re.search(
                    r"\b(disease\w*|infection\w*|infected|sick|fung\w*|"
                    r"blight|spot|mildew|mosaic|rust|rot|wilt|canker|scab|"
                    r"septoria|anthracnose|target)\b",
                    normalized_question,
                )
            )
        )

        knowledge_chunks = []
        if not (
            asks_for_current_sensor
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
        context_str = "--- AGRICULTURAL KNOWLEDGE CHUNKS ---\n"
        for chunk in knowledge_chunks:
            context_str += f"Source: {chunk['document_name']} (Chunk Index: {chunk['chunk_index']})\n{chunk['content']}\n\n"

        if asks_for_sensor_today:
            context_str += "--- SENSOR READINGS RECORDED TODAY ---\n"
            if sensor_readings_today:
                for reading in sensor_readings_today:
                    context_str += (
                        f"Recorded at: {reading.get('timestamp')}; "
                        f"pH: {reading.get('ph')}, TDS: {reading.get('tds')} ppm, "
                        f"Air temperature: {reading.get('temperature')}°C, "
                        f"Humidity: {reading.get('humidity')}%, "
                        f"Water temperature: {reading.get('water_temperature')}°C, "
                        f"Water level: {reading.get('water_level')}%, "
                        f"Light: {reading.get('light')}\n"
                    )
            else:
                context_str += "No sensor readings were recorded today.\n"
                if latest_sensor_before_today:
                    context_str += (
                        f"The latest available sensor reading before today was recorded at "
                        f"{latest_sensor_before_today.get('timestamp')}: "
                        f"pH {latest_sensor_before_today.get('ph')}, "
                        f"TDS {latest_sensor_before_today.get('tds')} ppm, "
                        f"air temperature {latest_sensor_before_today.get('temperature')}°C, "
                        f"humidity {latest_sensor_before_today.get('humidity')}%, "
                        f"water temperature {latest_sensor_before_today.get('water_temperature')}°C, "
                        f"water level {latest_sensor_before_today.get('water_level')}%, "
                        f"light {latest_sensor_before_today.get('light')}.\n"
                    )
                else:
                    context_str += "No earlier sensor readings are available.\n"

        if asks_for_detections_today:
            context_str += "--- DISEASE DETECTIONS RECORDED TODAY ---\n"
            if disease_detections_today:
                for detection in disease_detections_today:
                    context_str += (
                        f"Detected at: {detection.get('detection_time')}; "
                        f"plant: {detection.get('plant_name')}; "
                        f"crop: {detection.get('crop')}; "
                        f"prediction: {detection.get('prediction')}; "
                        f"confidence: {detection.get('confidence')}\n"
                    )
            else:
                context_str += "No disease detections were recorded today.\n"
                if latest_detection_before_today:
                    context_str += (
                        f"The latest earlier disease detection was detected at "
                        f"{latest_detection_before_today.get('detection_time')}: "
                        f"{latest_detection_before_today.get('prediction')} "
                        f"(confidence {latest_detection_before_today.get('confidence')}).\n"
                    )
                else:
                    context_str += "No earlier disease detections are available.\n"

        if not (asks_for_sensor_today or asks_for_detections_today):
            context_str += "--- LATEST SENSOR READINGS ---\n"
            if latest_sensor:
                context_str += f"Timestamp: {latest_sensor.get('timestamp')}\n" \
                               f"pH: {latest_sensor.get('ph')}, TDS: {latest_sensor.get('tds')} ppm, " \
                               f"Water Temp: {latest_sensor.get('water_temperature')}°C, Water Level: {latest_sensor.get('water_level')}%\n\n"
            else:
                context_str += "No recent sensor data available.\n\n"

        if not (asks_for_sensor_today or asks_for_detections_today):
            context_str += "--- LATEST YOLO DISEASE DETECTION ---\n"
            if latest_detection:
                context_str += f"Time: {latest_detection.get('detection_time')}\n" \
                               f"Prediction: {latest_detection.get('prediction')} (Confidence: {latest_detection.get('confidence')})\n\n"
            elif not (asks_for_yesterdays_detection or asks_for_detection_history):
                context_str += "No recent disease detections.\n\n"

        if asks_for_yesterdays_detection:
            context_str += "--- DISEASE DETECTIONS FROM YESTERDAY ---\n"
            if detection_history:
                for detection in detection_history:
                    context_str += (
                        f"Time: {detection.get('detection_time')}\n"
                        f"Prediction: {detection.get('prediction')} "
                        f"(Confidence: {detection.get('confidence')})\n\n"
                    )
            else:
                context_str += "No disease detections were recorded yesterday.\n\n"

        if asks_for_detection_history and not asks_for_detections_today:
            context_str += "--- USER'S MATCHING DISEASE DETECTIONS ---\n"
            if disease_detections:
                for detection in disease_detections[:20]:
                    context_str += (
                        f"Plant: {detection.get('plant_name')}, "
                        f"Crop: {detection.get('crop')}, "
                        f"Prediction: {detection.get('prediction')}, "
                        f"Confidence: {detection.get('confidence')}, "
                        f"Time: {detection.get('detection_time')}\n"
                    )
            else:
                context_str += (
                    "No matching disease detection records were found.\n"
                    if has_disease_filter
                    else "No disease detection records were found.\n"
                )
            if len(disease_detections) > 20:
                context_str += (
                    f"Showing the 20 most recent of {len(disease_detections)} "
                    "records in this prompt. The application displays every record.\n"
                )

        system_instruction = (
            "You are an expert smart agriculture assistant focused on tomato cultivation, sensor "
            "data, and disease management. Answer using the provided retrieved agricultural "
            "knowledge, database sensor readings, and disease detection records. Do not invent "
            "measurements or detections. Distinguish documented guidance from measured readings and "
            "model predictions. For symptoms, provide possible explanations rather than claiming "
            "a definitive diagnosis. Cite source document names and include timestamps where "
            "available.\n\n"
            "For any question asking about today's records, use only records explicitly labeled "
            "as recorded today to answer for today. If there are none, state that no such records "
            "were recorded today and, when provided, give the timestamp and details of the latest "
            "earlier record. Never present an earlier record as today's data.\n\n"
            "Scope and missing-information policy: First determine whether the user's specific "
            "question is about agriculture or can be answered by the supplied farm data or "
            "knowledge. If it is unrelated to agriculture, or asks for information that is not "
            "actually available in the supplied context (for example, live local weather), do not "
            "answer from general knowledge and do not list unrelated sensor readings, detections, "
            "or documents. Instead, respond with a brief, natural message tailored to the exact "
            "question: acknowledge what they asked, clearly state that you do not have that "
            "information or that it is outside your role, identify yourself in context as an expert "
            "smart agriculture assistant focused on tomato cultivation, sensor data, and disease "
            "management, and offer a relevant agriculture question you can help with. Vary the "
            "wording naturally to fit each question; do not repeat one fixed fallback sentence. "
            "If part of an in-scope question is answerable, answer only that supported part and "
            "clearly identify what information is missing."
        )
        if asks_for_disease_guidance:
            system_instruction += (
                "\n\nFor this disease-treatment question, format the answer in Markdown using "
                "these sections in this order:\n"
                "## 1. Disease Overview\n"
                "Identify the disease being asked about. Include the causal organism and favorable "
                "conditions (including temperature and humidity) only when supported by the "
                "retrieved guide; otherwise say the guide does not specify them.\n"
                "## 2. Symptoms and Management\n"
                "Summarize documented symptoms, then use ### A. Environmental Management for "
                "cultural practices and ### B. Chemical Treatment for any named products in the "
                "retrieved guide. Put named chemical products and their documented purpose in a "
                "Markdown table. Do not invent products, doses, application schedules, or efficacy. "
                "If the guide names no chemical products, say so. Include this safety note: use "
                "only products approved for the crop in the user's country, follow the product "
                "label, and consult a local agricultural specialist before applying chemicals.\n"
                "## 3. Prevention Strategies\n"
                "Present documented prevention practices and recommendations in a Markdown table. "
                "Do not invent unsupported practices.\n"
                "Keep the disease name and facts aligned with the user's question and retrieved "
                "sources. If the retrieved guide does not cover the requested disease or a detail, "
                "state that clearly rather than filling gaps from guesswork. Cite the source "
                "document name(s)."
            )

        full_prompt = f"{context_str}\nUser Question: {question}"

        response = self.gemini_client.models.generate_content(
            model=self.gemini_model,
            contents=[full_prompt],
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.2,
                max_output_tokens=2048 if asks_for_disease_treatment else 1024
            )
        )

        if not response.text or not response.text.strip():
            raise RuntimeError("The AI model returned an empty answer.")

        return {
            "session_id": session_id,
            "answer": response.text,
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
                sensor_readings_today if asks_for_sensor_today else sensor_readings
            ),
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
import asyncpg
from google import genai
from google.genai import types

class ChatService:
    def __init__(self, db_pool: asyncpg.Pool, gemini_api_key: str):
        self.db_pool = db_pool
        self.gemini_client = genai.Client(api_key=gemini_api_key)

    async def _get_embedding(self, text: str) -> list[float]:
        """Generates a vector embedding for the user query using Gemini."""
        response = self.gemini_client.models.embed_content(
            model="gemini-embedding-001",
            contents=text,
            config=types.EmbedContentConfig(output_dimensionality=768)
        )
        return response.embeddings[0].values

    async def get_latest_sensor_reading(self, user_id: str) -> dict:
        async with self.db_pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                SELECT temperature, humidity, water_temperature, water_level, ph, tds, light, recorded_at as timestamp
                FROM sensor_readings sr
                JOIN plants p ON sr.plant_id = p.id
                WHERE p.user_id = $1
                ORDER BY sr.recorded_at DESC
                LIMIT 1;
                """,
                user_id
            )
            return dict(row) if row else {}

    async def get_latest_disease_detection(self, user_id: str) -> dict:
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

    async def search_knowledge_base(self, query_embedding: list[float], limit: int = 3) -> list[dict]:
        """Performs vector similarity search, joining document_chunks with documents to get the filename."""
        async with self.db_pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT d.filename as document_name, c.chunk_index, c.content,
                       (c.embedding <=> $1::vector) as distance
                FROM document_chunks c
                JOIN documents d ON c.document_id = d.id
                ORDER BY distance ASC
                LIMIT $2;
                """,
                str(query_embedding), limit
            )
            return [dict(row) for row in rows]

    async def process_chat_turn(self, user_id: str, session_id: int, user_message: str) -> dict:
        query_embedding = await self._get_embedding(user_message)

        knowledge_chunks = await self.search_knowledge_base(query_embedding, limit=3)
        latest_sensor = await self.get_latest_sensor_reading(user_id)
        latest_detection = await self.get_latest_disease_detection(user_id)

        context_str = "--- AGRICULTURAL KNOWLEDGE CHUNKS ---\n"
        for chunk in knowledge_chunks:
            context_str += f"Source: {chunk['document_name']} (Chunk Index: {chunk['chunk_index']})\n{chunk['content']}\n\n"

        context_str += "--- LATEST SENSOR READINGS ---\n"
        if latest_sensor:
            context_str += f"Timestamp: {latest_sensor.get('timestamp')}\n" \
                           f"pH: {latest_sensor.get('ph')}, TDS: {latest_sensor.get('tds')} ppm, " \
                           f"Water Temp: {latest_sensor.get('water_temperature')}°C, Water Level: {latest_sensor.get('water_level')}%\n\n"
        else:
            context_str += "No recent sensor data available.\n\n"

        context_str += "--- LATEST YOLO DISEASE DETECTION ---\n"
        if latest_detection:
            context_str += f"Time: {latest_detection.get('detection_time')}\n" \
                           f"Prediction: {latest_detection.get('prediction')} (Confidence: {latest_detection.get('confidence')})\n\n"
        else:
            context_str += "No recent disease detections.\n\n"

        system_instruction = (
            "You are an expert Smart Hydroponic Agriculture Assistant. Answer the user's question "
            "strictly using the provided agricultural knowledge, sensor observations, and YOLO detection history. "
            "Clearly distinguish between general documented guidelines, measured sensor observations, and AI model predictions. "
            "Include source citations and timestamps where applicable."
        )

        full_prompt = f"{context_str}\nUser Question: {user_message}"

        response = self.gemini_client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=[full_prompt],
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.2,
                max_output_tokens=1024
            )
        )

        return {
            "session_id": session_id,
            "answer": response.text,
            "sources_used": [
                {"document": c["document_name"], "chunk_index": c["chunk_index"]} for c in knowledge_chunks
            ],
            "sensor_snapshot": latest_sensor,
            "detection_snapshot": latest_detection
        }
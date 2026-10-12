import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import asyncpg
from dotenv import load_dotenv
from app.services.chatService import ChatService

# Load environment variables from .env file
load_dotenv()

router = APIRouter(prefix="/chat", tags=["Hydroponic Chatbot"])

# Configuration variables (API key defined here once and passed down)
DATABASE_URL = os.getenv("DATABASE_URL")
GEMINI_API_KEY = "AQ.Ab8RN6If1PD_9V3sme-T9R9dyTLxvANbjgljojiEXwuOBzVjgw"

class ChatRequest(BaseModel):
    user_id: str
    session_id: int
    message: str

class ChatResponse(BaseModel):
    session_id: int
    answer: str
    sources_used: list
    sensor_snapshot: Optional[dict] = None
    detection_snapshot: Optional[dict] = None

@router.post("/", response_model=ChatResponse)
async def send_chat_message(payload: ChatRequest):
    """
    Processes a chat turn using DATABASE_URL from .env and the Gemini API key.
    """
    if not DATABASE_URL:
        raise HTTPException(status_code=500, detail="DATABASE_URL is not set in environment variables.")

    db_pool = None
    try:
        # Create temporary database connection pool for the request
        db_pool = await asyncpg.create_pool(DATABASE_URL)
        
        # Instantiate ChatService, passing the API key explicitly
        service = ChatService(
            db_pool=db_pool, 
            gemini_api_key=GEMINI_API_KEY
        )

        result = await service.process_chat_turn(
            user_id=payload.user_id,
            session_id=payload.session_id,
            user_message=payload.message
        )
        return ChatResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        if db_pool:
            await db_pool.close()
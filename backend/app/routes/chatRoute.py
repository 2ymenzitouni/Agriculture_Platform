import os
<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import asyncpg
from dotenv import load_dotenv
from sqlalchemy.engine import make_url
from app.api.router.dependencies import get_current_user
from app.models.usersModel import User
=======
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import asyncpg
from dotenv import load_dotenv
>>>>>>> origin/main
from app.services.chatService import ChatService

# Load environment variables from .env file
load_dotenv()

router = APIRouter(prefix="/chat", tags=["Hydroponic Chatbot"])

# Configuration variables (API key defined here once and passed down)
DATABASE_URL = os.getenv("DATABASE_URL")
<<<<<<< HEAD
GEMINI_API_KEY = "AQ.Ab8RN6IYRHW4bXqKfHujxEi_HuhausMLgi40l42O_hphIxdUhA"  # Replace with your actual Gemini API key
GEMINI_MODEL = "gemini-3.1-flash-lite"

class ChatRequest(BaseModel):
    session_id: int = Field(default=1, gt=0)
    message: str = Field(min_length=1, max_length=4000)
=======
GEMINI_API_KEY = "AQ.Ab8RN6If1PD_9V3sme-T9R9dyTLxvANbjgljojiEXwuOBzVjgw"

class ChatRequest(BaseModel):
    user_id: str
    session_id: int
    message: str
>>>>>>> origin/main

class ChatResponse(BaseModel):
    session_id: int
    answer: str
    sources_used: list
    sensor_snapshot: Optional[dict] = None
<<<<<<< HEAD
    sensor_readings: list[dict] = Field(default_factory=list)
    detection_snapshot: Optional[dict] = None
    detection_history: list[dict] = Field(default_factory=list)
    disease_detections: list[dict] = Field(default_factory=list)

@router.post("/", response_model=ChatResponse)
async def send_chat_message(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
):
=======
    detection_snapshot: Optional[dict] = None

@router.post("/", response_model=ChatResponse)
async def send_chat_message(payload: ChatRequest):
>>>>>>> origin/main
    """
    Processes a chat turn using DATABASE_URL from .env and the Gemini API key.
    """
    if not DATABASE_URL:
        raise HTTPException(status_code=500, detail="DATABASE_URL is not set in environment variables.")

    db_pool = None
    try:
        # Create temporary database connection pool for the request
<<<<<<< HEAD
        database_url = make_url(DATABASE_URL).set(
            drivername="postgresql"
        ).render_as_string(hide_password=False)
        db_pool = await asyncpg.create_pool(database_url)
=======
        db_pool = await asyncpg.create_pool(DATABASE_URL)
>>>>>>> origin/main
        
        # Instantiate ChatService, passing the API key explicitly
        service = ChatService(
            db_pool=db_pool, 
<<<<<<< HEAD
            gemini_api_key=GEMINI_API_KEY,
            gemini_model=GEMINI_MODEL,
        )

        result = await service.process_chat_turn(
            user_id=current_user.id,
            session_id=payload.session_id,
            user_message=payload.message.strip()
=======
            gemini_api_key=GEMINI_API_KEY
        )

        result = await service.process_chat_turn(
            user_id=payload.user_id,
            session_id=payload.session_id,
            user_message=payload.message
>>>>>>> origin/main
        )
        return ChatResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        if db_pool:
            await db_pool.close()
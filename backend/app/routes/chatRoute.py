import os
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field
from typing import Optional
import asyncpg
from dotenv import load_dotenv
from sqlalchemy.engine import make_url
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.api.router.dependencies import get_current_user, get_db
from app.models.chatMessageModel import ChatMessage
from app.models.chatModel import ChatSession
from app.models.usersModel import User
from app.schemas.chatSchema import (
    ChatMessageResponse,
    ChatSessionListItem,
    ChatSessionResponse,
)
from app.services.chatService import ChatService

# Load environment variables from .env file
load_dotenv()

router = APIRouter(prefix="/chat", tags=["Hydroponic Chatbot"])

# Configuration variables (API key defined here once and passed down)
DATABASE_URL = os.getenv("DATABASE_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-3.1-flash-lite"

class ChatRequest(BaseModel):
    session_id: UUID
    message: str = Field(min_length=1, max_length=4000)

class ChatResponse(BaseModel):
    session_id: UUID
    answer: str
    sources_used: list
    sensor_snapshot: Optional[dict] = None
    sensor_readings: list[dict] = Field(default_factory=list)
    sensor_chart_readings: list[dict] = Field(default_factory=list)
    detection_snapshot: Optional[dict] = None
    detection_history: list[dict] = Field(default_factory=list)
    disease_detections: list[dict] = Field(default_factory=list)


@router.get("/sessions", response_model=list[ChatSessionListItem])
def list_chat_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    latest_message_at = (
        db.query(func.max(ChatMessage.created_at))
        .filter(ChatMessage.session_id == ChatSession.id)
        .correlate(ChatSession)
        .scalar_subquery()
    )
    latest_message_preview = (
        db.query(ChatMessage.content)
        .filter(ChatMessage.session_id == ChatSession.id)
        .order_by(ChatMessage.created_at.desc(), ChatMessage.id.desc())
        .limit(1)
        .correlate(ChatSession)
        .scalar_subquery()
    )
    message_count = (
        db.query(func.count(ChatMessage.id))
        .filter(ChatMessage.session_id == ChatSession.id)
        .correlate(ChatSession)
        .scalar_subquery()
    )
    rows = (
        db.query(
            ChatSession.id,
            ChatSession.title,
            ChatSession.created_at,
            latest_message_at.label("last_message_at"),
            latest_message_preview.label("preview"),
            message_count.label("message_count"),
        )
        .filter(ChatSession.user_id == current_user.id)
        .order_by(
            func.coalesce(latest_message_at, ChatSession.created_at).desc()
        )
        .limit(100)
        .all()
    )
    return [ChatSessionListItem.model_validate(row._mapping) for row in rows]


@router.post("/sessions", response_model=ChatSessionResponse, status_code=201)
def create_chat_session(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    chat_session = ChatSession(user_id=current_user.id)
    db.add(chat_session)
    db.commit()
    db.refresh(chat_session)
    return chat_session


@router.get(
    "/sessions/{session_id}/messages",
    response_model=list[ChatMessageResponse],
)
def list_chat_messages(
    session_id: UUID,
    limit: int = Query(default=500, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    chat_session = (
        db.query(ChatSession)
        .filter(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id,
        )
        .first()
    )
    if chat_session is None:
        raise HTTPException(status_code=404, detail="Conversation introuvable.")

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.desc(), ChatMessage.id.desc())
        .limit(limit)
        .all()
    )
    return list(reversed(messages))


@router.post("/", response_model=ChatResponse)
async def send_chat_message(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Traite un message du chatbot avec la base de données et la clé Gemini.
    """
    if not DATABASE_URL:
        raise HTTPException(
            status_code=500,
            detail="DATABASE_URL n’est pas défini dans les variables d’environnement.",
        )
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY n’est pas défini dans les variables d’environnement.",
        )

    user_message = payload.message.strip()
    if not user_message:
        raise HTTPException(status_code=422, detail="Veuillez saisir une question.")

    chat_session = (
        db.query(ChatSession)
        .filter(
            ChatSession.id == payload.session_id,
            ChatSession.user_id == current_user.id,
        )
        .first()
    )
    if chat_session is None:
        raise HTTPException(status_code=404, detail="Conversation introuvable.")

    chat_session_id = chat_session.id
    db_pool = None
    try:
        conversation_history = [
            {"role": message.role, "content": message.content}
            for message in (
                db.query(ChatMessage)
                .filter(ChatMessage.session_id == chat_session_id)
                .order_by(ChatMessage.created_at.desc(), ChatMessage.id.desc())
                .limit(10)
                .all()[::-1]
            )
        ]
        db.add(
            ChatMessage(
                session_id=chat_session_id,
                role="user",
                content=user_message,
            )
        )
        if chat_session.title == "New Chat Session":
            chat_session.title = user_message[:80]
        db.commit()

        # Create temporary database connection pool for the request
        database_url = make_url(DATABASE_URL).set(
            drivername="postgresql"
        ).render_as_string(hide_password=False)
        db_pool = await asyncpg.create_pool(database_url)
        
        # Instantiate ChatService, passing the API key explicitly
        service = ChatService(
            db_pool=db_pool,
            gemini_api_key=GEMINI_API_KEY,
            gemini_model=GEMINI_MODEL,
        )

        result = await service.process_chat_turn(
            user_id=current_user.id,
            session_id=chat_session_id,
            user_message=user_message,
            conversation_history=conversation_history,
        )
        db.add(
            ChatMessage(
                session_id=chat_session_id,
                role="assistant",
                content=result["answer"],
                details=jsonable_encoder({
                    "user_message": user_message,
                    "sources": result.get("sources_used", []),
                    "sensor_snapshot": result.get("sensor_snapshot") or {},
                    "sensor_readings": result.get("sensor_readings", []),
                    "sensor_chart_readings": result.get("sensor_chart_readings", []),
                    "disease_detections": result.get("disease_detections", []),
                }),
            )
        )
        db.commit()
        return ChatResponse(**result)
    except HTTPException:
        db.rollback()
        raise
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors du traitement de votre message : {exc}",
        ) from exc
        
    finally:
        if db_pool:
            await db_pool.close()
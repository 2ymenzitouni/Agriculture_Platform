from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field

class ChatSessionCreate(BaseModel):
    user_id: UUID
    title: str = Field(..., max_length=255)

class ChatSessionUpdate(BaseModel):
    title: str = Field(..., max_length=255)

class ChatSessionResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ChatSessionListItem(BaseModel):
    id: UUID
    title: str
    preview: str | None = None
    message_count: int
    created_at: datetime
    last_message_at: datetime | None = None


class ChatMessageResponse(BaseModel):
    id: UUID
    session_id: UUID
    role: str
    content: str
    details: dict = Field(default_factory=dict)
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
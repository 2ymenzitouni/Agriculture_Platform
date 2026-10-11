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
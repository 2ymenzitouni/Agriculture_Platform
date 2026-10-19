from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field

class DocumentCreate(BaseModel):
    user_id: UUID
    filename: str = Field(..., max_length=255)
    file_path: str | None = None
    file_type: str | None = Field(None, max_length=100)
    file_size: int | None = None

class DocumentResponse(BaseModel):
    id: UUID
    user_id: UUID
    filename: str
    file_path: str | None
    file_type: str | None
    file_size: int | None
    created_at: datetime
    chunk_count: int

    model_config = ConfigDict(from_attributes=True)

class DocumentChunkCreate(BaseModel):
    chunk_index: int
    content: str

class DocumentChunkResponse(BaseModel):
    id: UUID
    document_id: UUID
    chunk_index: int
    content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
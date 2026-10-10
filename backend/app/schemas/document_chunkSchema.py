from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class DocumentChunkBase(BaseModel):
    chunk_index: int
    content: str

class DocumentChunkCreate(DocumentChunkBase):
    document_id: UUID

class DocumentChunkResponse(DocumentChunkBase):
    id: UUID
    document_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
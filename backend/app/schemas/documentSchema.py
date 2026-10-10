from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class DocumentResponse(BaseModel):
    id: UUID
    user_id: UUID
    filename: str
    file_path: str | None
    file_type: str | None
    file_size: int | None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class DocumentChunkResponse(BaseModel):
    id: UUID
    document_id: UUID
    chunk_index: int
    content: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
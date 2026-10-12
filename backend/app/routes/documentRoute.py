from uuid import UUID
from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from app.api.router.dependencies import get_db
from app.services.documentExtractorService import DocumentExtractorService
from app.schemas.documentSchema import DocumentResponse

router = APIRouter(prefix="/documents", tags=["Documents & Chunks"])

@router.post("/upload-ai", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def upload_and_extract_with_ai(
    user_id: UUID = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload a document, process it using the Gemini utility function, 
    chunk the output, and store it in PostgreSQL.
    """
    service = DocumentExtractorService(db)
    return service.process_and_extract_file(user_id, file)
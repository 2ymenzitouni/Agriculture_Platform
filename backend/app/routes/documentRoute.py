from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, UploadFile, File, status
from sqlalchemy.orm import Session

from app.api.router.dependencies import get_current_user, get_db
from app.services.documentExtractorService import DocumentExtractorService
from app.schemas.documentSchema import DocumentResponse
from app.models.usersModel import User
from app.services.documentService import DocumentService

router = APIRouter(prefix="/documents", tags=["Documents & Chunks"])
GEMINI_MODEL = "choose-your-gemini-model-here"  # Replace with your actual Gemini model

@router.get("/mine", response_model=List[DocumentResponse])
def get_my_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return DocumentService(db).get_user_documents(current_user.id)


@router.post("/upload-ai", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def upload_and_extract_with_ai(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload a document, process it using the Gemini utility function, 
    chunk the output, and store it in PostgreSQL.
    """
    service = DocumentExtractorService(db, gemini_model=GEMINI_MODEL)
    return service.process_and_extract_file(current_user.id, file)


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_document(
    document_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    DocumentService(db).delete_user_document(document_id, current_user.id)
import uuid
from pathlib import Path
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, selectinload
from app.models.documentModel import Document, DocumentChunk
from app.models.usersModel import User  # Adjust import path if needed

class DocumentService:
    def __init__(self, db: Session):
        self.db = db

    def create_document(
        self, 
        user_id: uuid.UUID, 
        filename: str, 
        file_path: str | None = None, 
        file_type: str | None = None, 
        file_size: int | None = None
    ) -> Document:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        document = Document(
            user_id=user_id,
            filename=filename,
            file_path=file_path,
            file_type=file_type,
            file_size=file_size
        )
        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)
        return document

    def get_user_documents(self, user_id: uuid.UUID) -> list[Document]:
        return (
            self.db.query(Document)
            .options(selectinload(Document.chunks))
            .filter(Document.user_id == user_id)
            .order_by(Document.created_at.desc())
            .all()
        )

    def delete_user_document(self, document_id: uuid.UUID, user_id: uuid.UUID) -> None:
        document = (
            self.db.query(Document)
            .filter(Document.id == document_id, Document.user_id == user_id)
            .first()
        )
        if not document:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

        file_path = Path(document.file_path).resolve() if document.file_path else None
        upload_dir = Path("static/documents").resolve()
        self.db.delete(document)
        self.db.commit()

        if file_path and file_path.parent == upload_dir:
            try:
                file_path.unlink(missing_ok=True)
            except OSError as exc:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Document was deleted, but its uploaded file could not be removed.",
                ) from exc

    def get_document_by_id(self, document_id: uuid.UUID) -> Document:
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
        return document

    def add_chunk(self, document_id: uuid.UUID, chunk_index: int, content: str) -> DocumentChunk:
        self.get_document_by_id(document_id)  # Verify parent document exists

        chunk = DocumentChunk(
            document_id=document_id,
            chunk_index=chunk_index,
            content=content
        )
        self.db.add(chunk)
        self.db.commit()
        self.db.refresh(chunk)
        return chunk

    def get_document_chunks(self, document_id: uuid.UUID) -> list[DocumentChunk]:
        self.get_document_by_id(document_id)
        return self.db.query(DocumentChunk).filter(DocumentChunk.document_id == document_id).order_by(DocumentChunk.chunk_index).all()

    def delete_document(self, document_id: uuid.UUID) -> None:
        document = self.get_document_by_id(document_id)
        self.db.delete(document)
        self.db.commit()
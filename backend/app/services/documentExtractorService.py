import os
import uuid
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session

from app.models.documentModel import Document, DocumentChunk
from app.utils.gemini_extractor import extract_data_with_gemini

UPLOAD_DIR = "static/documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class DocumentExtractorService:
    def __init__(self, db: Session):
        self.db = db

    def process_and_extract_file(self, user_id: uuid.UUID, file: UploadFile) -> Document:
        # 1. Save file locally
        file_extension = file.filename.split(".")[-1].lower() if file.filename else ""
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)

        with open(file_path, "wb") as buffer:
            content = file.file.read()
            buffer.write(content)
            file_size = len(content)

        # 2. Create parent Document record in DB
        db_doc = Document(
            user_id=user_id,
            filename=file.filename,
            file_path=file_path,
            file_type=file_extension,
            file_size=file_size
        )
        self.db.add(db_doc)
        self.db.commit()
        self.db.refresh(db_doc)

        try:
            # 3. Use the Gemini utility function to extract data/content from the file
            extracted_text = extract_data_with_gemini(
                file_path=file_path, 
                prompt="Extract all key technical details, facts, and text from this document comprehensively."
            )

            # 4. Chunk the Gemini-extracted text and save into `document_chunks`
            chunks = self._chunk_text(extracted_text, chunk_size=500, overlap=50)
            for idx, chunk_content in enumerate(chunks):
                db_chunk = DocumentChunk(
                    document_id=db_doc.id,
                    chunk_index=idx,
                    content=chunk_content
                )
                self.db.add(db_chunk)
            
            self.db.commit()

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error extracting data with Gemini LLM: {str(e)}"
            )

        return db_doc

    def _chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
        words = text.split()
        chunks = []
        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i:i + chunk_size])
            if chunk.strip():
                chunks.append(chunk)
        return chunks
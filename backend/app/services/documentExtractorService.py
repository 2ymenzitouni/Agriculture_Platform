
import os
import uuid
import time
import random
from pathlib import Path

from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from google import genai
from google.genai import types
from dotenv import load_dotenv

from app.models.documentModel import Document, DocumentChunk

load_dotenv()

UPLOAD_DIR = Path("static/documents")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

EMBEDDING_MODEL = "gemini-embedding-2"
EMBEDDING_DIMENSIONS = 768
MAX_RETRIES = 4
MAX_FILE_SIZE = 100 * 1024 * 1024


def _get_status_code(exc: Exception):
    """Extract an HTTP status code from a Gemini SDK exception."""
    code = getattr(exc, "code", None)

    if isinstance(code, int):
        return code

    code = getattr(exc, "status_code", None)

    if isinstance(code, int):
        return code

    # Fallback for SDK exceptions with different representations.
    message = str(exc)
    for status_code in (408, 429, 500, 502, 503, 504):
        if str(status_code) in message:
            return status_code

    return None


def _call_with_retry(func):
    """Retry transient API failures with exponential backoff."""
    retryable_codes = {408, 429, 500, 502, 503, 504}

    for attempt in range(MAX_RETRIES):
        try:
            return func()

        except Exception as exc:
            code = _get_status_code(exc)

            if code not in retryable_codes:
                raise

            if attempt == MAX_RETRIES - 1:
                raise

            delay = min(2 ** (attempt + 1), 30)
            delay += random.uniform(0, 1)

            print(
                f"Gemini API error {code}. "
                f"Retrying in {delay:.1f} seconds "
                f"({attempt + 1}/{MAX_RETRIES - 1})"
            )
            time.sleep(delay)


class DocumentExtractorService:
<<<<<<< HEAD
    def __init__(
        self,
        db: Session,
        gemini_model: str = "gemini-3.1-flash-lite",
    ):
        self.db = db
        self.gemini_model = gemini_model
=======
    def __init__(self, db: Session):
        self.db = db
>>>>>>> origin/main

        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is missing from environment variables."
            )

        self.client = genai.Client(api_key=api_key)

<<<<<<< HEAD
    def _extract_document_text(self, file_path: Path) -> str:
        uploaded_file = _call_with_retry(
            lambda: self.client.files.upload(file=str(file_path))
        )
        extraction_prompt = (
            "Extract the key technical details, facts, "
            "and relevant text from this document. "
            "Preserve important values, units, headings, "
            "and recommendations."
        )
        response = _call_with_retry(
            lambda: self.client.models.generate_content(
                model=self.gemini_model,
                contents=[uploaded_file, extraction_prompt],
            )
        )

        return response.text

=======
>>>>>>> origin/main
    def process_and_extract_file(
        self,
        user_id: uuid.UUID,
        file: UploadFile,
    ) -> Document:

        file_path = None
        db_doc = None

        try:
            # 1. Save the uploaded file locally.
            original_filename = file.filename or "document"
            file_extension = Path(original_filename).suffix.lower().lstrip(".")

            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            file_path = UPLOAD_DIR / unique_filename

            content = file.file.read()

            if not content:
                raise HTTPException(
                    status_code=400,
                    detail="The uploaded file is empty.",
                )
            if len(content) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="The uploaded file exceeds the 100 MB size limit.",
                )

            file_path.write_bytes(content)

            # 2. Create the document record without committing yet.
            db_doc = Document(
                user_id=user_id,
                filename=original_filename,
                file_path=str(file_path),
                file_type=file_extension,
                file_size=len(content),
            )

            self.db.add(db_doc)
            self.db.flush()

            # 3. Extract document content with Gemini.
<<<<<<< HEAD
            extracted_text = self._extract_document_text(file_path)
=======
            extracted_text = _call_with_retry(
                lambda: self.client.models.generate_content(
                    model="gemini-3.8-flash",
                    contents=[
                        self.client.files.upload(file=str(file_path)),
                        (
                            "Extract the key technical details, facts, "
                            "and relevant text from this document. "
                            "Preserve important values, units, headings, "
                            "and recommendations."
                        ),
                    ],
                )
            ).text
>>>>>>> origin/main

            if not extracted_text or not extracted_text.strip():
                raise ValueError(
                    "Gemini returned no text from the document."
                )

            # 4. Split the extracted text into chunks.
            chunks = self._chunk_text(
                extracted_text,
                chunk_size=500,
                overlap=50,
            )

            if not chunks:
                raise ValueError(
                    "No text chunks were generated from the document."
                )

            # 5. Generate embeddings and add chunks to PostgreSQL.
            for idx, chunk_content in enumerate(chunks):
                embed_response = _call_with_retry(
                    lambda: self.client.models.embed_content(
                        model=EMBEDDING_MODEL,
                        contents=chunk_content,
                        config=types.EmbedContentConfig(
                            output_dimensionality=EMBEDDING_DIMENSIONS
                        ),
                    )
                )

                if (
                    not embed_response.embeddings
                    or not embed_response.embeddings[0].values
                ):
                    raise ValueError(
                        f"Gemini returned no embedding for chunk {idx}."
                    )

                vector_embedding = embed_response.embeddings[0].values

                if len(vector_embedding) != EMBEDDING_DIMENSIONS:
                    raise ValueError(
                        f"Expected {EMBEDDING_DIMENSIONS} embedding "
                        f"dimensions, got {len(vector_embedding)}."
                    )

                db_chunk = DocumentChunk(
                    document_id=db_doc.id,
                    chunk_index=idx,
                    content=chunk_content,
                    embedding=vector_embedding,
                )

                self.db.add(db_chunk)

            # 6. Commit the document and all chunks together.
            self.db.commit()
            self.db.refresh(db_doc)

            return db_doc

        except Exception as exc:
            self.db.rollback()

            # Remove the saved file if processing failed.
            if file_path is not None:
                try:
                    file_path.unlink(missing_ok=True)
                except OSError as cleanup_error:
                    print(f"File cleanup failed: {cleanup_error}")

            if isinstance(exc, HTTPException):
                raise

            print(f"Document processing failed: {exc}")

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Document processing failed: {str(exc)}",
            ) from exc

    def _chunk_text(
        self,
        text: str,
        chunk_size: int = 500,
        overlap: int = 50,
    ) -> list[str]:
        if chunk_size <= 0 or overlap < 0 or overlap >= chunk_size:
            raise ValueError("Invalid chunk size or overlap.")

        words = text.split()
        chunks = []
        step = chunk_size - overlap

        for i in range(0, len(words), step):
            chunk = " ".join(words[i:i + chunk_size])

            if chunk.strip():
                chunks.append(chunk)

        return chunks

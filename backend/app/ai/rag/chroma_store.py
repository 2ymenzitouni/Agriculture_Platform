import ast
import math
from functools import lru_cache
from pathlib import Path
from typing import Any
from uuid import UUID

import chromadb
from sqlalchemy import bindparam, text
from sqlalchemy.orm import Session

from app.core.config import settings

COLLECTION_NAME = "agriculture_documents"
EMBEDDING_DIMENSIONS = 768
LEGACY_BATCH_SIZE = 100


class ChromaVectorStore:
    def __init__(self, persist_directory: Path) -> None:
        self.client = chromadb.PersistentClient(path=str(persist_directory))
        self.collection = self.client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )

    def upsert(
        self,
        ids: list[str],
        documents: list[str],
        embeddings: list[list[float]],
        metadatas: list[dict[str, Any]],
    ) -> None:
        self.collection.upsert(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
        )

    def upsert_document_chunks(
        self,
        document_id: UUID,
        user_id: UUID,
        filename: str,
        chunk_ids: list[UUID],
        chunks: list[str],
        embeddings: list[list[float]],
        chunk_indexes: list[int],
    ) -> None:
        if not (len(chunk_ids) == len(chunks) == len(embeddings) == len(chunk_indexes)):
            raise ValueError("Chunk IDs, content, embeddings, and indexes must have equal lengths.")

        self.upsert(
            ids=[str(chunk_id) for chunk_id in chunk_ids],
            documents=chunks,
            embeddings=embeddings,
            metadatas=[
                {
                    "document_id": str(document_id),
                    "user_id": str(user_id),
                    "document_name": filename,
                    "chunk_index": chunk_index,
                }
                for chunk_index in chunk_indexes
            ],
        )

    def search(
        self,
        query_embedding: list[float],
        user_id: UUID,
        limit: int,
    ) -> list[dict[str, Any]]:
        if len(query_embedding) != EMBEDDING_DIMENSIONS:
            raise ValueError(
                f"Expected a {EMBEDDING_DIMENSIONS}-dimensional query embedding."
            )
        if limit <= 0:
            raise ValueError("Search limit must be greater than zero.")

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=limit,
            where={"user_id": str(user_id)},
            include=["documents", "metadatas", "distances"],
        )

        ids = results["ids"][0]
        documents = results["documents"][0]
        metadatas = results["metadatas"][0]
        distances = results["distances"][0]
        return [
            {
                "chunk_id": chunk_id,
                "document_id": metadata["document_id"],
                "document_name": metadata["document_name"],
                "chunk_index": metadata["chunk_index"],
                "content": content,
                "distance": distance,
            }
            for chunk_id, content, metadata, distance in zip(
                ids, documents, metadatas, distances
            )
            if content is not None and metadata is not None
        ]

    def delete_document(self, document_id: UUID) -> None:
        self.collection.delete(where={"document_id": str(document_id)})


@lru_cache(maxsize=1)
def get_chroma_store() -> ChromaVectorStore:
    return ChromaVectorStore(settings.CHROMA_PERSIST_DIRECTORY)


def migrate_legacy_embeddings(db: Session) -> int:
    columns = db.execute(
        text(
            """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = current_schema()
              AND table_name = 'document_chunks'
            """
        )
    ).mappings().all()
    if "embedding" not in {column["column_name"] for column in columns}:
        return 0

    store = get_chroma_store()
    migrated_count = 0
    clear_embeddings = text(
        "UPDATE document_chunks SET embedding = NULL WHERE id IN :ids"
    ).bindparams(bindparam("ids", expanding=True))

    while True:
        rows = db.execute(
            text(
                """
                SELECT c.id, c.document_id, c.chunk_index, c.content,
                       c.embedding::text AS vector_text, d.user_id, d.filename
                FROM document_chunks c
                JOIN documents d ON d.id = c.document_id
                WHERE c.embedding IS NOT NULL
                ORDER BY c.id
                LIMIT :batch_size
                """
            ),
            {"batch_size": LEGACY_BATCH_SIZE},
        ).mappings().all()
        if not rows:
            break

        embeddings: list[list[float]] = []
        for row in rows:
            parsed = ast.literal_eval(row["vector_text"])
            if not isinstance(parsed, list) or len(parsed) != EMBEDDING_DIMENSIONS:
                raise ValueError(
                    f"Legacy embedding for chunk {row['id']} must contain "
                    f"{EMBEDDING_DIMENSIONS} values."
                )
            embedding = [float(value) for value in parsed]
            if not all(math.isfinite(value) for value in embedding):
                raise ValueError(f"Legacy embedding for chunk {row['id']} is not finite.")
            embeddings.append(embedding)

        store.upsert(
            ids=[str(row["id"]) for row in rows],
            documents=[row["content"] for row in rows],
            embeddings=embeddings,
            metadatas=[
                {
                    "document_id": str(row["document_id"]),
                    "user_id": str(row["user_id"]),
                    "document_name": row["filename"],
                    "chunk_index": row["chunk_index"],
                }
                for row in rows
            ],
        )
        db.execute(clear_embeddings, {"ids": [row["id"] for row in rows]})
        db.commit()
        migrated_count += len(rows)

    return migrated_count

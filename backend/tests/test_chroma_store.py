import unittest
from unittest.mock import Mock, patch
from uuid import uuid4

from app.ai.rag.chroma_store import (
    ChromaVectorStore,
    EMBEDDING_DIMENSIONS,
    migrate_legacy_embeddings,
)


class ChromaVectorStoreTests(unittest.TestCase):
    def setUp(self) -> None:
        self.store = object.__new__(ChromaVectorStore)
        self.store.collection = Mock()

    def test_search_filters_by_user_and_returns_chroma_chunks(self) -> None:
        user_id = uuid4()
        self.store.collection.query.return_value = {
            "ids": [["chunk-1"]],
            "documents": [["Tomato guide content"]],
            "metadatas": [[
                {
                    "document_id": str(uuid4()),
                    "document_name": "tomato-guide.pdf",
                    "chunk_index": 2,
                }
            ]],
            "distances": [[0.12]],
        }

        results = self.store.search([0.1] * EMBEDDING_DIMENSIONS, user_id, 3)

        self.assertEqual(results[0]["content"], "Tomato guide content")
        self.assertEqual(results[0]["chunk_index"], 2)
        self.store.collection.query.assert_called_once_with(
            query_embeddings=[[0.1] * EMBEDDING_DIMENSIONS],
            n_results=3,
            where={"user_id": str(user_id)},
            include=["documents", "metadatas", "distances"],
        )

    def test_search_rejects_embedding_with_wrong_dimensions(self) -> None:
        with self.assertRaisesRegex(ValueError, "768-dimensional"):
            self.store.search([0.1], uuid4(), 3)

        self.store.collection.query.assert_not_called()

    def test_migration_copies_legacy_vectors_then_clears_postgres_values(self) -> None:
        chunk_id = uuid4()
        document_id = uuid4()
        user_id = uuid4()
        vector = [0.25] * EMBEDDING_DIMENSIONS
        row = {
            "id": chunk_id,
            "document_id": document_id,
            "chunk_index": 1,
            "content": "Tomato growing guidance",
            "vector_text": str(vector),
            "user_id": user_id,
            "filename": "guide.pdf",
        }

        class FakeResult:
            def __init__(self, rows: list[dict]) -> None:
                self.rows = rows

            def mappings(self) -> "FakeResult":
                return self

            def all(self) -> list[dict]:
                return self.rows

        class FakeSession:
            def __init__(self) -> None:
                self.pending_rows = [row]
                self.cleared_ids = []
                self.commit_count = 0

            def get_bind(self) -> object:
                return object()

            def execute(self, statement: object, params: dict | None = None) -> FakeResult:
                if "SELECT column_name" in str(statement):
                    return FakeResult([{"column_name": "embedding"}])
                if "SELECT c.id" in str(statement):
                    rows, self.pending_rows = self.pending_rows, []
                    return FakeResult(rows)
                self.cleared_ids = params["ids"]
                return FakeResult([])

            def commit(self) -> None:
                self.commit_count += 1

        db = FakeSession()
        store = Mock()

        with (
            patch("app.ai.rag.chroma_store.get_chroma_store", return_value=store),
        ):
            migrated = migrate_legacy_embeddings(db)

        self.assertEqual(migrated, 1)
        store.upsert.assert_called_once()
        self.assertEqual(store.upsert.call_args.kwargs["embeddings"], [vector])
        self.assertEqual(db.cleared_ids, [chunk_id])
        self.assertEqual(db.commit_count, 1)


if __name__ == "__main__":
    unittest.main()

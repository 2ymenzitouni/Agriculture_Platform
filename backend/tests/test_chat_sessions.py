import unittest

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base
from app.models.chatMessageModel import ChatMessage
from app.models.chatModel import ChatSession
from app.models.disease_detectionModel import DiseaseDetection
from app.models.documentModel import Document, DocumentChunk
from app.models.plantModel import Plant
from app.models.sensor_readingsModel import SensorReading
from app.models.usersModel import User
from app.routes.chatRoute import (
    clear_chat_sessions,
    create_chat_session,
    delete_chat_session,
    list_chat_messages,
    list_chat_sessions,
)


class ChatSessionRouteTests(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(
            self.engine,
            tables=[
                User.__table__,
                ChatSession.__table__,
                ChatMessage.__table__,
            ],
        )
        self.db = sessionmaker(bind=self.engine)()
        self.user = User(
            name="Test User",
            email="test@example.com",
            password_hash="not-a-real-password",
        )
        self.db.add(self.user)
        self.db.commit()

    def tearDown(self) -> None:
        self.db.close()
        self.engine.dispose()

    def test_create_and_list_session_with_messages(self) -> None:
        chat_session = create_chat_session(current_user=self.user, db=self.db)
        self.db.add_all([
            ChatMessage(
                session_id=chat_session.id,
                role="user",
                content="Question",
            ),
            ChatMessage(
                session_id=chat_session.id,
                role="assistant",
                content="Answer",
            ),
        ])
        self.db.commit()

        sessions = list_chat_sessions(current_user=self.user, db=self.db)
        messages = list_chat_messages(
            session_id=chat_session.id,
            limit=500,
            current_user=self.user,
            db=self.db,
        )

        self.assertEqual(len(sessions), 1)
        self.assertEqual(sessions[0].message_count, 2)
        self.assertEqual(sessions[0].preview, "Answer")
        self.assertEqual([message.content for message in messages], ["Question", "Answer"])

    def test_user_cannot_load_another_users_session(self) -> None:
        other_user = User(
            name="Other User",
            email="other@example.com",
            password_hash="not-a-real-password",
        )
        self.db.add(other_user)
        self.db.commit()
        other_session = create_chat_session(current_user=other_user, db=self.db)

        self.assertEqual(list_chat_sessions(current_user=self.user, db=self.db), [])
        with self.assertRaises(HTTPException) as error:
            list_chat_messages(
                session_id=other_session.id,
                limit=500,
                current_user=self.user,
                db=self.db,
            )
        self.assertEqual(error.exception.status_code, 404)

    def test_clear_sessions_removes_only_current_users_conversations(self) -> None:
        current_session = create_chat_session(current_user=self.user, db=self.db)
        other_user = User(
            name="Other User",
            email="other@example.com",
            password_hash="not-a-real-password",
        )
        self.db.add(other_user)
        self.db.commit()
        other_session = create_chat_session(current_user=other_user, db=self.db)
        self.db.add_all([
            ChatMessage(
                session_id=current_session.id,
                role="user",
                content="Question",
            ),
            ChatMessage(
                session_id=other_session.id,
                role="user",
                content="Other question",
            ),
        ])
        self.db.commit()

        clear_chat_sessions(current_user=self.user, db=self.db)

        self.assertEqual(list_chat_sessions(current_user=self.user, db=self.db), [])
        self.assertEqual(len(list_chat_sessions(current_user=other_user, db=self.db)), 1)

    def test_delete_session_removes_messages(self) -> None:
        chat_session = create_chat_session(current_user=self.user, db=self.db)
        self.db.add(ChatMessage(
            session_id=chat_session.id,
            role="user",
            content="Question",
        ))
        self.db.commit()

        delete_chat_session(
            session_id=chat_session.id,
            current_user=self.user,
            db=self.db,
        )

        self.assertEqual(list_chat_sessions(current_user=self.user, db=self.db), [])


if __name__ == "__main__":
    unittest.main()

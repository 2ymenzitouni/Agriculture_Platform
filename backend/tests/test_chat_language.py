import unittest

from app.services.chatService import (
    _format_conversation_history,
    _asks_for_sensor_chart,
    _asks_for_sensor_data,
    _mentions_today,
    _normalize_text,
)


class FrenchChatLanguageTests(unittest.TestCase):
    def test_french_sensor_question_for_today_is_recognized(self) -> None:
        question = _normalize_text(
            "Quels sont mes relevés d’humidité enregistrés aujourd’hui ?"
        )

        self.assertTrue(_asks_for_sensor_data(question))
        self.assertTrue(_mentions_today(question))

    def test_sensor_reading_history_requests_enable_chart_data(self) -> None:
        question = _normalize_text("Montre les relevés des capteurs")
        self.assertTrue(_asks_for_sensor_chart(question))

        owned_readings = _normalize_text("Show my sensor readings")
        self.assertTrue(_asks_for_sensor_chart(owned_readings))

    def test_latest_sensor_reading_does_not_enable_history_chart(self) -> None:
        question = _normalize_text("Show the latest sensor readings")
        self.assertFalse(_asks_for_sensor_chart(question))

    def test_requested_recent_readings_enable_history_chart(self) -> None:
        question = _normalize_text("Show the last 5 humidity readings")
        self.assertTrue(_asks_for_sensor_chart(question, requested_sensor_count=5))

    def test_french_accents_are_normalized_for_intent_matching(self) -> None:
        question = _normalize_text("Quelle est la température de l’eau ?")

        self.assertEqual(question, "quelle est la temperature de l eau ?")
        self.assertTrue(_asks_for_sensor_data(question))

    def test_conversation_history_keeps_roles_and_ignores_invalid_entries(self) -> None:
        history = _format_conversation_history([
            {"role": "user", "content": "First question"},
            {"role": "assistant", "content": "First answer"},
            {"role": "system", "content": "Ignore this"},
        ])

        self.assertEqual(
            history,
            "--- HISTORIQUE DE LA CONVERSATION ---\n"
            "Utilisateur : First question\nAssistant : First answer",
        )


if __name__ == "__main__":
    unittest.main()

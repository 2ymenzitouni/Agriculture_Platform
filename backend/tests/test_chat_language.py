import unittest

from app.services.chatService import (
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

    def test_french_accents_are_normalized_for_intent_matching(self) -> None:
        question = _normalize_text("Quelle est la température de l’eau ?")

        self.assertEqual(question, "quelle est la temperature de l eau ?")
        self.assertTrue(_asks_for_sensor_data(question))


if __name__ == "__main__":
    unittest.main()

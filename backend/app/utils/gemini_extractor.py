# import os
# from google import genai
# from google.genai import types

# def extract_data_with_gemini(file_path: str, prompt: str = "Extract and summarize all relevant information from this document.") -> str:
#     """
#     Utility function to send a file to Gemini LLM and extract data.
#     """
#     # Explicitly pass your API key here to bypass environment variable issues
#     client = genai.Client(api_key="AQ.Ab8RN6JjFdEilOlrNTYrTAMZA-xDMRfzfK3ZNHROZm1JAVeP7g")

#     if not os.path.exists(file_path):
#         raise FileNotFoundError(f"File not found at: {file_path}")

#     # Upload the file using the Files API so Gemini can read PDFs/text files directly
#     uploaded_file = client.files.upload(file=file_path)

#     try:
#         # Generate content using gemini-2.5-flash-lite
#         response = client.models.generate_content(
#             model="gemini-2.5-flash-lite",
#             contents=[uploaded_file, prompt]
#         )
#         return response.text
#     finally:
#         # Clean up the file from Gemini storage after processing
#         client.files.delete(name=uploaded_file.name)


import os
from google import genai


def extract_data_with_gemini(file_path: str) -> str:
    """
    Extract the original text and data from a document using Gemini.

    Returns plain text only, without summaries, explanations,
    interpretations, or JSON.
    """

    API_KEY = "AQ.Ab8RN6If1PD_9V3sme-T9R9dyTLxvANbjgljojiEXwuOBzVjgw"
    MODEL = "gemini-3.1-flash-lite"

    client = genai.Client(api_key=API_KEY)

    if not os.path.exists(file_path):
        raise FileNotFoundError(
            f"File not found at: {file_path}"
        )

    prompt = """
    You are a document text extraction system.

    Extract the original text and data from the provided document.

    Rules:
    1. Return only the extracted text.
    2. Do not summarize, explain, analyze, or interpret.
    3. Do not convert the content into JSON.
    4. Preserve the original wording, numbers, dates, names,
       units, headings, lists, and table values.
    5. Preserve the reading order as much as possible.
    6. Represent tables as plain text with headers and rows.
    7. Do not invent, correct, or modify information.
    8. If text is unreadable, write [unreadable].
    9. Do not add introductions, conclusions, or comments.
    """

    uploaded_file = client.files.upload(file=file_path)

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=[uploaded_file, prompt]
        )

        return response.text or ""

    finally:
        client.files.delete(name=uploaded_file.name)


# Example usage
if __name__ == "__main__":
    file_path = input("Enter the document path: ").strip().strip('"')

    try:
        extracted_text = extract_data_with_gemini(file_path)

        print("\n--- EXTRACTED TEXT ---\n")
        print(extracted_text)

        output_path = os.path.splitext(file_path)[0] + "_extracted.txt"

        with open(output_path, "w", encoding="utf-8") as file:
            file.write(extracted_text)

        print(f"\nExtracted text saved to: {output_path}")

    except Exception as error:
        print(f"Error: {error}")

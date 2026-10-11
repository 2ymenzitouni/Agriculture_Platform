import os
from google import genai
from google.genai import types

def extract_data_with_gemini(file_path: str="rapport_linkedin.pdf", prompt: str = "Extract and summarize all relevant information from this document.") -> str:
    """
    Utility function to send a file to Gemini LLM and extract data.
    Requires GEMINI_API_KEY set in your environment variables.
    """
    # Initialize the official Gemini client
    client = genai.Client()

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found at: {file_path}")

    # Upload the file using the Files API so Gemini can read PDFs/text files directly
    uploaded_file = client.files.upload(file=file_path)

    try:
        # Generate content using gemini-2.5-flash
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[uploaded_file, prompt]
        )
        return response.text
    finally:
        # Clean up the file from Gemini storage after processing
        client.files.delete(name=uploaded_file.name)


# print(extract_data_with_gemini())

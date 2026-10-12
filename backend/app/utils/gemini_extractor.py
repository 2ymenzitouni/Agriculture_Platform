# import os
# from google import genai
# from google.genai import types

# def extract_data_with_gemini(file_path: str, prompt: str = "Extract and summarize all relevant information from this document.") -> str:
#     """
#     Utility function to send a file to Gemini LLM and extract data.
#     Requires GEMINI_API_KEY set in your environment variables.
#     """
#     # Initialize the official Gemini client
#     client = genai.Client()

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


# # print(extract_data_with_gemini())

import os
from google import genai
from google.genai import types

def extract_data_with_gemini(file_path: str, prompt: str = "Extract and summarize all relevant information from this document.") -> str:
    """
    Utility function to send a file to Gemini LLM and extract data.
    """
    # Explicitly pass your API key here to bypass environment variable issues
    client = genai.Client(api_key="AQ.Ab8RN6JjFdEilOlrNTYrTAMZA-xDMRfzfK3ZNHROZm1JAVeP7g")

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found at: {file_path}")

    # Upload the file using the Files API so Gemini can read PDFs/text files directly
    uploaded_file = client.files.upload(file=file_path)

    try:
        # Generate content using gemini-2.5-flash-lite
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=[uploaded_file, prompt]
        )
        return response.text
    finally:
        # Clean up the file from Gemini storage after processing
        client.files.delete(name=uploaded_file.name)
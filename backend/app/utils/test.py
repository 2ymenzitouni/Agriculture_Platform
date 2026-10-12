import os
from google import genai
from google.genai import types

def extract_data_with_gemini(file_path: str, api_key: str, prompt: str = "Extract all key data points, facts, and structured text from this document."):
    """
    Uploads a file to Gemini, runs data extraction using gemini-2.5-flash,
    and automatically cleans up the file from Gemini server storage afterward.
    """
    # Initialize the Gemini client with your API key
    client = genai.Client(api_key=api_key)

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found at: {file_path}")

    print(f"Uploading '{file_path}' to Gemini Files API...")
    
    # Upload the file (supports PDFs, images, code files, audio, etc.)
    uploaded_file = client.files.upload(file=file_path)

    try:
        print("Extracting data with gemini-2.5-flash...")
        
        # Generate content using the stable flash model
        response = client.models.generate_content(
            model="gemini-3.8-flash",
            contents=[uploaded_file, prompt]
        )
        
        return response.text

    finally:
        # Cleanup: Delete the file from Gemini server storage
        print("Cleaning up file from Gemini server...")
        client.files.delete(name=uploaded_file.name)

if __name__ == "__main__":
    # Replace with your target file path
    TARGET_FILE = "rapport_linkedin.pdf"
    
    # Your Gemini API key
    GEMINI_API_KEY = "AQ.Ab8RN6JjFdEilOlrNTYrTAMZA-xDMRfzfK3ZNHROZm1JAVeP7g"

    try:
        extracted_result = extract_data_with_gemini(
            file_path=TARGET_FILE, 
            api_key=GEMINI_API_KEY,
            prompt="Extract the key findings, summary points, and technical metrics from this document."
        )
        
        print("\n" + "="*45)
        print("GEMINI EXTRACTED DATA:")
        print("="*45 + "\n")
        print(extracted_result)
        
    except Exception as e:
        print(f"\nAn error occurred: {e}")

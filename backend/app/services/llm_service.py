import requests
import json
from typing import Dict, Any, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = "gemini-1.5-flash"  # Using a currently available model
        self.base_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"
    
    async def get_response(self, question: str, context: Optional[str] = None) -> Dict[str, Any]:
        """
        Get a response from Gemini for the given question using direct API calls
        """
        try:
            # Create system prompt for better responses
            system_prompt = """
            You are an expert AI assistant providing accurate, well-structured answers.
            
            When responding to user queries:
            1. Research the topic thoroughly using your knowledge
            2. Organize information into clear sections with bullet points when appropriate
            3. Be concise yet comprehensive
            4. Format your response to be easy to read and understand
            5. Include all necessary details relevant to the query
            6. If the query is travel-related, include visa requirements, passport info, and any advisories
            
            Respond in markdown format for better readability.
            """
            
            # Build the message content
            message_content = question
            if context:
                message_content = f"Context: {context}\n\nQuestion: {question}"
            
            # Full prompt combining system instructions and user query
            full_prompt = f"{system_prompt}\n\nUser Query: {message_content}"
            
            # Prepare the API request payload
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": full_prompt}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.7,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 1024,
                }
            }
            
            # Add the API key as a URL parameter
            url = f"{self.base_url}?key={self.api_key}"
            
            # Make the API call
            headers = {"Content-Type": "application/json"}
            response = requests.post(url, headers=headers, json=payload)
            
            # Check for successful response
            if response.status_code == 200:
                response_data = response.json()

                # Extract text from the response
                if "candidates" in response_data and len(response_data["candidates"]) > 0:
                    if "content" in response_data["candidates"][0]:
                        content = response_data["candidates"][0]["content"]
                        if "parts" in content and len(content["parts"]) > 0:
                            answer_text = content["parts"][0]["text"]
                            return {
                                "answer": answer_text,
                                "success": True,
                                "metadata": {
                                    "model": self.model
                                }
                            }
            
            # If we get here, something went wrong with the response format
            error_message = f"API Error: {response.status_code} - {response.text}"
            logger.error(error_message)
            return {
                "answer": "",
                "success": False,
                "error": error_message
            }
            
        except Exception as e:
            error_message = f"Error querying Gemini: {str(e)}"
            logger.error(error_message)
            return {
                "answer": "",
                "success": False,
                "error": error_message
            }

llm_service = LLMService()

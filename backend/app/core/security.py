from fastapi import HTTPException, status
from app.core.config import settings
import secrets

def verify_api_key(api_key: str) -> bool:
    """
    Verify that the API key is valid.
    This is a simple check for demonstration - in production you would use a more secure method.
    """
    # Simple validation for the assessment
    return len(api_key) > 0

def generate_request_id() -> str:
    """Generate a unique request ID for tracking"""
    return secrets.token_hex(16)

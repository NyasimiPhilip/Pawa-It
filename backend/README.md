# Q&A System Backend

A FastAPI backend for an interactive Q&A system using Claude AI.

## Features

- FastAPI with proper project structure
- Claude AI integration for advanced responses
- Question history tracking
- API documentation with Swagger
- SQLite database for storing history

## Setup Instructions

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file with your API key:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   DATABASE_URL=sqlite:///./qa_history.db
   ```

4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

5. Access API documentation:
   - Swagger UI: http://localhost:8000/api/v1/docs
   - ReDoc: http://localhost:8000/api/v1/redoc

## API Endpoints

- `GET /api/v1/`: Health check
- `POST /api/v1/ask`: Ask a question
- `GET /api/v1/history`: Get question history

## Example Usage

```python
import requests
import json

url = "http://localhost:8000/api/v1/ask"
payload = {
    "question": "What documents do I need to travel from Kenya to Ireland?",
    "context": "I am planning a business trip next month."
}
headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, data=json.dumps(payload), headers=headers)
print(response.json())
```
```

This backend implementation includes:

1. **Well-structured FastAPI Project:**
   - Modular organization with separate directories for APIs, models, services, and config
   - Clean separation of concerns

2. **LLM Integration:**
   - Claude AI integration with proper error handling
   - Structured prompt engineering for better responses

3. **Features:**
   - Question/answer history with database storage
   - Advanced input validation
   - Detailed error handling
   - Request tracking
   - Comprehensive API documentation

4. **Technical Elements:**
   - Environment variable management
   - SQLAlchemy database integration
   - Pydantic models for validation
   - Proper dependency injection

To run the backend:
1. Set up a virtual environment
2. Install dependencies from requirements.txt
3. Add your Anthropic API key to the .env file
4. Run `uvicorn main:app --reload`
5. Access the Swagger docs at http://localhost:8000/api/v1/docs

This implementation follows best practices for FastAPI development and meets all the requirements for the assessment.
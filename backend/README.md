# Q&A System Backend with FastAPI and Gemini

A comprehensive FastAPI backend for an interactive Q&A system that uses Google's Gemini AI model to provide intelligent responses to user queries. This system includes user authentication, query history tracking, and robust database management.

## Features

- **AI-powered responses** using Google's Gemini model
- **User authentication system** with registration, login, and account management
- **Query history** tracking per user
- **RESTful API** with comprehensive Swagger documentation
- **PostgreSQL integration** for reliable data storage
- **Robust database initialization** that adapts to schema changes

## System Architecture

The backend is built with a modular architecture:

```
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── auth.py    # Authentication endpoints
│   │   │   └── qa.py      # Q&A endpoints
│   ├── core/
│   │   ├── config.py      # Configuration settings
│   │   └── security.py    # Authentication utilities
│   ├── db/
│   │   └── database.py    # Database models and connection
│   ├── models/
│   │   └── schema.py      # Pydantic schemas
│   └── services/
│       └── llm_service.py # Gemini AI integration
├── .env                   # Environment variables
├── requirements.txt       # Dependencies
├── main.py                # Application entry point
└── README.md              # Documentation
```

## Technical Stack

- **FastAPI**: High-performance web framework
- **SQLAlchemy**: ORM for database interactions
- **PostgreSQL**: Primary database
- **Pydantic**: Data validation and settings management
- **JWT**: Authentication via JSON Web Tokens
- **Google Gemini API**: AI model for answering questions
- **Swagger/OpenAPI**: API documentation

## Setup Instructions

### Prerequisites

- Python 3.8+
- PostgreSQL
- Google Gemini API key

### Step 1: Set up the database

Create a PostgreSQL database for the application:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE qa_llm;

# Connect to the new database
\c qa_llm

# Exit PostgreSQL
\q
```

### Step 2: Set up the environment

```bash
# Clone the repository (if applicable)
git clone <repository-url>
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Configure environment variables

Create a `.env` file in the root directory with the following variables:

```
# API Key for Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# PostgreSQL configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_DB=qa_llm
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/qa_llm

# JWT Authentication
SECRET_KEY=your_secret_key_here
```

Replace the placeholders with your actual values. For the SECRET_KEY, you can generate a secure key with:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### Step 4: Run the application

```bash
# Start the development server
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

API documentation is available at:
- Swagger UI: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc

## API Endpoints

### Authentication Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/v1/auth/register` | POST | Register a new user | `{"email": "user@example.com", "username": "user", "password": "password123"}` | User details |
| `/api/v1/auth/login` | POST | OAuth2 login (form-based) | Form with username & password | Access token |
| `/api/v1/auth/login-json` | POST | JSON login | `{"email": "user@example.com", "password": "password123"}` | Access token |
| `/api/v1/auth/me` | GET | Get current user | None (requires token) | User details |
| `/api/v1/auth/me` | PUT | Update user | `{"username": "newname"}` (requires token) | Updated user |
| `/api/v1/auth/me` | DELETE | Delete user | None (requires token) | 204 No Content |

### Q&A Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/v1` | GET | Health check | None | Status message |
| `/api/v1/ask` | POST | Ask a question | `{"question": "travel to Ireland?", "context": "Business trip"}` | AI response |
| `/api/v1/history` | GET | Get question history | None (requires token) | List of previous Q&A |

## Authentication Flow

1. **Register** a new user account
2. **Login** to receive a JWT token
3. **Use the token** in the Authorization header for authenticated endpoints
4. **View, update, or delete** your account as needed

All authentication works with JWT tokens which must be included in the `Authorization` header as `Bearer <token>`.

## Using the API

### Registration

```bash
curl -X 'POST' \
  'http://localhost:8000/api/v1/auth/register' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "username": "testuser",
  "password": "password123"
}'
```

### Login

```bash
curl -X 'POST' \
  'http://localhost:8000/api/v1/auth/login-json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "password": "password123"
}'
```

The response will contain your access token:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Asking a Question

```bash
curl -X 'POST' \
  'http://localhost:8000/api/v1/ask' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -H 'Content-Type: application/json' \
  -d '{
  "question": "What documents do I need to travel from Kenya to Ireland?",
  "context": "Business trip next month"
}'
```

### Getting Question History

```bash
curl -X 'GET' \
  'http://localhost:8000/api/v1/history' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

## Database Schema

The application uses two primary tables:

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR | Primary key (UUID) |
| email | VARCHAR | User's email (unique) |
| username | VARCHAR | User's username (unique) |
| hashed_password | VARCHAR | Bcrypt-hashed password |
| is_active | BOOLEAN | Account status |
| created_at | TIMESTAMP | Account creation time |

### QA_LLM Table (Query History)

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR | Primary key (UUID) |
| question | TEXT | User's question |
| answer | TEXT | AI-generated answer |
| timestamp | TIMESTAMP | When the query was made |
| user_id | VARCHAR | Foreign key to users.id |

## Error Handling

The API uses standard HTTP status codes:

- **200/201**: Successful operations
- **400**: Bad request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **404**: Resource not found
- **422**: Validation error
- **500**: Server error

Each error response includes a detail message explaining the issue.

## Security Considerations

- Passwords are hashed using bcrypt
- Authentication uses JWT with configurable expiration
- Database queries use parameterized statements to prevent SQL injection
- Input validation prevents malformed data

## Development and Extension

### Adding New Endpoints

To add a new endpoint:

1. Create a new file in `app/api/endpoints/` or extend an existing one
2. Define your router and endpoints
3. Include the router in `main.py`

### Changing the AI Model

To use a different model:

1. Update the `llm_service.py` file with the new API calls
2. Update the environment variables in `config.py`

### Database Migrations

The system automatically adapts to schema changes by:
- Checking for missing tables and creating them
- Adding missing columns to existing tables
- Establishing proper relationships between tables

## Troubleshooting

### Common Issues

1. **Connection refused**: Ensure PostgreSQL is running and the connection details are correct
2. **Authentication failed**: Check your Gemini API key
3. **JWT errors**: Verify your SECRET_KEY is properly set
4. **Database errors**: Run the PostgreSQL client and check the database structure

### Logging

The application logs important events and errors. Check the console output for detailed information about what's happening.

## Performance Considerations

- Database connections use connection pooling
- API responses are validated and serialized efficiently
- Gemini API calls include proper error handling and timeouts

## Deployment

For production deployment:

1. Set up a production PostgreSQL database
2. Configure a proper `SECRET_KEY` in the environment variables
3. Run the application behind a reverse proxy like Nginx
4. Consider using Gunicorn as the WSGI server:

```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
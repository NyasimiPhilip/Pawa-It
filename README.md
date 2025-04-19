# Pawa-It Q&A Assistant

A full-stack AI-powered Q&A application that provides intelligent answers with context support. Built with Next.js for the frontend and FastAPI for the backend.

![Project Banner](frontend/app/public/background.svg)

## 🌟 Features

### Core Features
- 🤖 AI-Powered Question Answering
- 💡 Context-Aware Responses
- 🔐 Secure User Authentication
- 📚 Chat History Management
- 🌙 Dark Mode Interface
- 📱 Responsive Design

### Frontend Features
- ✨ Typewriter Effect for AI Responses
- 🔄 Real-time Updates
- 📝 Context Input Support
- 📱 Mobile-First Design
- 🎨 Modern UI with Tailwind CSS

### Backend Features
- 🚀 Fast and Efficient API
- 🔒 JWT Authentication
- 📊 SQLite Database
- 🔄 Async Request Handling
- 📝 Swagger Documentation

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Fonts**: Geist Sans & Geist Mono

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.8+
- **Database**: SQLite
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI

## 🚀 Getting Started

### Prerequisites
- Python 3.8 or higher
- Node.js 18.0 or later
- npm or yarn
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file:
   ```env
   SECRET_KEY=your_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   DATABASE_URL=sqlite:///./qa_history.db
   ```

5. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

The API will be available at `http://localhost:8000`. Swagger documentation can be accessed at `http://localhost:8000/docs`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The frontend will be available at `http://localhost:3000`.

## 📁 Project Structure

```
pawa-it/
├── frontend/                # Next.js frontend application
│   ├── app/
│   │   ├── public/         # Static assets
│   │   └── src/
│   │       ├── app/        # Pages and routes
│   │       ├── components/ # React components
│   │       ├── context/    # Context providers
│   │       ├── services/   # API services
│   │       └── utils/      # Utility functions
│   └── package.json
│
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Core configurations
│   │   ├── db/            # Database models
│   │   └── services/      # Business logic
│   ├── requirements.txt
│   └── main.py
│
└── README.md
```

## 🔒 Authentication Flow

1. **Registration**: Users register with email and password
2. **Login**: Users receive a JWT token upon successful login
3. **Authorization**: Protected routes require valid JWT token
4. **Token Refresh**: Automatic token refresh mechanism

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### Q&A
- `POST /api/v1/ask` - Submit question with optional context
- `GET /api/v1/history` - Get chat history

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- FastAPI team for the efficient backend framework
- All contributors who have helped shape this project
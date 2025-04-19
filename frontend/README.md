# Q&A Assistant Frontend

A modern, responsive Q&A application built with Next.js that provides an AI-powered question-answering interface with context support.

## Features

- 🔐 User Authentication (Login/Register)
- 💬 Real-time AI-powered Q&A Interface
- ✨ Typewriter Effect for AI Responses
- 📝 Context Support for Better Answers
- 📱 Responsive Design
- 🌙 Dark Mode Interface
- 📚 Chat History
- 🔄 New Chat Creation

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Authentication**: JWT-based Auth
- **State Management**: React Context
- **Typescript**: For type safety
- **Fonts**: Geist Sans & Geist Mono

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── public/            # Static files
│   └── src/
│       ├── app/           # App routes and pages
│       ├── components/    # Reusable components
│       ├── context/       # React Context providers
│       ├── services/      # API services
│       └── utils/         # Utility functions
├── package.json
└── tsconfig.json
```

## Key Features Explained

### Authentication
- JWT-based authentication system
- Protected routes and API endpoints
- Persistent login state
- Registration with email validation

### Q&A Interface
- Real-time question answering
- Context support for more accurate answers
- Typewriter effect for AI responses
- Loading states and error handling
- Chat history with timestamp tracking

### User Experience
- Responsive design for all screen sizes
- Dark mode optimized interface
- Smooth animations and transitions
- Intuitive chat-like interface
- Easy context toggling

## API Integration

The frontend integrates with a REST API with the following endpoints:

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/ask` - Submit question with optional context
- `GET /api/v1/history` - Get chat history



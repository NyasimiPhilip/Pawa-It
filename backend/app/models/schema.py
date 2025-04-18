from pydantic import BaseModel, Field, validator, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v
    
    @validator('username')
    def username_valid(cls, v):
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    
    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

# Question schemas
class QuestionRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000, description="The user's question")
    context: Optional[str] = Field(None, description="Optional context for the question")
    
    @validator('question')
    def question_must_be_valid(cls, v):
        if not v.strip():
            raise ValueError('Question cannot be empty')
        return v.strip()

class HistoryItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    timestamp: datetime = Field(default_factory=datetime.now)
    
    class Config:
        orm_mode = True

class QuestionResponse(BaseModel):
    answer: str
    success: bool
    request_id: str
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class HistoryResponse(BaseModel):
    items: List[HistoryItem]
    count: int

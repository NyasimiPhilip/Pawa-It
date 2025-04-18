from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

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

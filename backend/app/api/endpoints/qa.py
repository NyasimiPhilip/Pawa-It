from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime

from app.core.security import generate_request_id, get_current_user
from app.models.schema import QuestionRequest, QuestionResponse, HistoryResponse, HistoryItem
from app.services.llm_service import llm_service
from app.db.database import get_db, QueryHistory, User

router = APIRouter(tags=["qa"])

@router.get("/", status_code=status.HTTP_200_OK)
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Q&A API"}

@router.post("/ask", response_model=QuestionResponse, status_code=status.HTTP_200_OK)
async def ask_question(
    request: QuestionRequest, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Ask a question to the LLM and get a response
    
    - **question**: The user's question (required)
    - **context**: Optional additional context
    """
    # Generate a unique request ID
    request_id = generate_request_id()
    
    try:
        # Get response from LLM service
        result = await llm_service.get_response(request.question, request.context)
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=result.get("error", "Failed to get response from LLM")
            )
        
        # Save to history with user_id
        history_entry = QueryHistory(
            id=str(uuid.uuid4()),
            question=request.question,
            answer=result["answer"],
            timestamp=datetime.now(),
            user_id=current_user.id  # Associate with the current user
        )
        db.add(history_entry)
        db.commit()
        
        # Return response
        return QuestionResponse(
            answer=result["answer"],
            success=True,
            request_id=request_id,
            metadata=result.get("metadata")
        )
        
    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log the error and return a 500
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )

@router.get("/history", response_model=HistoryResponse)
async def get_history(
    limit: int = Query(10, ge=1, le=100), 
    skip: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get the history of questions and answers for the current user
    
    - **limit**: Maximum number of items to return (1-100)
    - **skip**: Number of items to skip (pagination)
    """
    # Query the database for history, filtering by user_id
    query = db.query(QueryHistory).filter(QueryHistory.user_id == current_user.id) \
              .order_by(QueryHistory.timestamp.desc())
    
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    
    # Convert to Pydantic models and ensure id is a string
    history_items = [
        HistoryItem(
            id=str(item.id),  # Convert UUID to string explicitly
            question=item.question,
            answer=item.answer,
            timestamp=item.timestamp
        ) for item in items
    ]

    return HistoryResponse(items=history_items, count=total)

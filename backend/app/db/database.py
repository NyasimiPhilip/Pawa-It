from sqlalchemy import create_engine, Column, String, DateTime, Text, inspect
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
import datetime
import logging

logger = logging.getLogger(__name__)

# Create SQLAlchemy engine
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Define ORM models
class QueryHistory(Base):
    __tablename__ = "qa_llm"  

    id = Column(String, primary_key=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

# Initialize database
def init_db():
    try:
        # Check if table exists before creating
        inspector = inspect(engine)
        if not inspector.has_table("qa_llm"):
            Base.metadata.create_all(bind=engine)
            logger.info("Database tables created successfully")
        else:
            logger.info("Tables already exist, skipping creation")
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        raise

# Get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from sqlalchemy import create_engine, Column, String, DateTime, Text, inspect, Boolean, ForeignKey, MetaData, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from app.core.config import settings
import datetime
import logging
import uuid

logger = logging.getLogger(__name__)

# Create SQLAlchemy engine
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Define User model
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationship with QueryHistory
    queries = relationship("QueryHistory", back_populates="user")

# Define QueryHistory model with user relationship
class QueryHistory(Base):
    __tablename__ = "qa_llm"  # Use the existing table name

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Add user relationship
    user_id = Column(String, ForeignKey("users.id", name="fk_user_id"), nullable=True)
    user = relationship("User", back_populates="queries")

def create_tables_if_needed():
    """Create tables if they don't exist, and add missing columns."""
    
    inspector = inspect(engine)
    
    # Check if tables exist
    if not inspector.has_table("users"):
        # Users table doesn't exist, create it
        logger.info("Creating users table")
        User.__table__.create(engine)
    else:
        # Verify all columns exist in users table
        existing_columns = {col['name'] for col in inspector.get_columns("users")}
        required_columns = {col.name for col in User.__table__.columns}
        
        missing_columns = required_columns - existing_columns
        if missing_columns:
            logger.warning(f"Missing columns in users table: {missing_columns}")
            # Add missing columns if needed
            with engine.connect() as connection:
                for column_name in missing_columns:
                    column = User.__table__.columns[column_name]
                    column_type = column.type.compile(engine.dialect)
                    nullable = "NULL" if column.nullable else "NOT NULL"
                    
                    sql = f"ALTER TABLE users ADD COLUMN {column_name} {column_type} {nullable}"
                    logger.info(f"Adding column with: {sql}")
                    try:
                        connection.execute(text(sql))
                        connection.commit()
                        logger.info(f"Added column {column_name} to users table")
                    except Exception as e:
                        logger.error(f"Error adding column {column_name}: {str(e)}")
                        connection.rollback()

    # Check qa_llm table
    if not inspector.has_table("qa_llm"):
        # qa_llm table doesn't exist, create it
        logger.info("Creating qa_llm table")
        QueryHistory.__table__.create(engine)
    else:
        # Verify all columns exist in qa_llm table
        existing_columns = {col['name'] for col in inspector.get_columns("qa_llm")}
        required_columns = {col.name for col in QueryHistory.__table__.columns}
        
        missing_columns = required_columns - existing_columns
        if missing_columns:
            logger.warning(f"Missing columns in qa_llm table: {missing_columns}")
            
            # Add missing columns with appropriate SQL
            with engine.connect() as connection:
                for column_name in missing_columns:
                    column = QueryHistory.__table__.columns[column_name]
                    column_type = column.type.compile(engine.dialect)
                    nullable = "NULL" if column.nullable else "NOT NULL"
                    
                    sql = f"ALTER TABLE qa_llm ADD COLUMN {column_name} {column_type} {nullable}"
                    logger.info(f"Adding column with: {sql}")
                    try:
                        connection.execute(text(sql))
                        connection.commit()
                        logger.info(f"Added column {column_name} to qa_llm table")
                    except Exception as e:
                        logger.error(f"Error adding column {column_name}: {str(e)}")
                        connection.rollback()

    # Check if foreign key exists
    if inspector.has_table("qa_llm") and "user_id" in {col['name'] for col in inspector.get_columns("qa_llm")}:
        # Check if foreign key constraint exists
        fk_exists = False
        for fk in inspector.get_foreign_keys("qa_llm"):
            if "user_id" in fk['constrained_columns']:
                fk_exists = True
                break
        
        # Add foreign key if it doesn't exist
        if not fk_exists:
            logger.info("Adding foreign key constraint to qa_llm.user_id")
            with engine.connect() as connection:
                try:
                    # Use the text() function to make a proper SQL text object
                    sql = text("ALTER TABLE qa_llm ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)")
                    connection.execute(sql)
                    connection.commit()
                    logger.info("Added foreign key constraint successfully")
                except Exception as e:
                    logger.error(f"Error adding foreign key constraint: {str(e)}")
                    connection.rollback()

# Initialize database
def init_db():
    try:
        logger.info("Initializing database")
        create_tables_if_needed()
        logger.info("Database initialization complete")
    except Exception as e:
        logger.error(f"Database initialization error: {str(e)}")
        raise

# Get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

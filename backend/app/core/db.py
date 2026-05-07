from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings
from .base import Base




_engine = create_engine(settings.DATABASE_URL, echo=settings.DEBUG)
SessionLocal = sessionmaker(bind=_engine, autocommit=False, autoflush=False)


def init_db(engine):
    from app.models import User, Table, Column, Record, Value
    Base.metadata.create_all(bind=engine)

def reset_db(engine):
    from app.models import User, Table, Column, Record, Value
    
    if settings.DEBUG:
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
    else:
        print("Not allowed to reset database in production")

def test_connection():
    with _engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("DB connection OK:", result.scalar())

def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


if __name__ == "__main__":
    reset_db(_engine)

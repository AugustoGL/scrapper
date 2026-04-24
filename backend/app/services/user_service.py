from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models import User


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return session.execute(statement).first()

def create_user(*, session: Session, username: str, email: str, password: str) -> User:
    new_user = User(
        username=username,
        email=email,
        password=password
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user 
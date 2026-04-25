from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.models import User
from app.schema.user import UpdateUser


def get_user_by_id(session: Session, id_user: int) -> User | None:
    return session.get(User, id_user)

def get_user_by_email(session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return session.execute(statement).scalars().first()

def create_user(session: Session, username: str, email: str, password: str) -> User:
    new_user = User(
        username=username,
        email=email,
        password=password
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user 

def edit_user(session: Session, id_user: int, edit_user: UpdateUser):
    user = get_user_by_id(session, id_user)
    if not user:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "user not found")
    
    user.username = edit_user.username
    user.email = edit_user.email
    user.password = hash_password(edit_user.password)
    
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
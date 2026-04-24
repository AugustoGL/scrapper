from fastapi import HTTPException, status
from app.core.security import hash_password
from .user_service import get_user_by_email, create_user
    

def register_user(session, username: str, email: str, password: str):
    user_existing = get_user_by_email(session=session, email=email)

    if user_existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    hashed_password = hash_password(password)

    return create_user(
        session=session,
        username=username,
        email=email,
        password=hashed_password
    )

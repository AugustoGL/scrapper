from fastapi import HTTPException, status
from app.core.security import hash_password
from .user_service import get_user_by_email, create_user
from app.schema.auth import RegisterRequest
    

def register_user(session, data_user: RegisterRequest):
    user_existing = get_user_by_email(session=session, email=data_user.email)

    if user_existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    hashed_password = hash_password(data_user.password)

    return create_user(
        session=session,
        username=data_user.username,
        email=data_user.email,
        password=hashed_password
    )

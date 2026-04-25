from datetime import timedelta
from fastapi import HTTPException, status
from app.core.config import settings
from app.core.security import hash_password, verify_password, create_token, verify_token, decode_token
from .user_service import get_user_by_email, create_user
from app.schema.auth import RegisterRequest, LoginRequest, TokenType, TokenPair
    

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

def login_user(session, data_login: LoginRequest) -> TokenPair:
    user = get_user_by_email(session=session, email=data_login.email)
        
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect email or password")
    
    if not verify_password(data_login.password, user.password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    access_token = create_token(TokenType.ACCESS, user.id_user, access_token_expires)
    refresh_token = create_token(TokenType.REFRESH, user.id_user, refresh_token_expires)
    
    return TokenPair(access_token=access_token, refresh_token=refresh_token)

def refresh_tokens(refresh_token):
    if not verify_token(refresh_token, TokenType.REFRESH):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token.")
    
    payload = decode_token(refresh_token)
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_token(TokenType.ACCESS, payload["sub"], access_token_expires)
    
    return TokenPair(access_token=access_token, refresh_token=refresh_token)

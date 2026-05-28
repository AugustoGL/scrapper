from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.security import verify_token, decode_token
from app.core.db import get_session
from app.models import User
from app.schema.auth import TokenType
from app.repository.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.exceptions.exceptions import UserNotFoundError



SessionDep = Annotated[Session, Depends(get_session)]

def get_user_repository(session: SessionDep):
    return UserRepository(session)

UserRepoDep = Annotated[UserRepository, Depends(get_user_repository)]

def get_auth_service(repo: UserRepoDep):
    return AuthService(repo)

AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]

oauth2 = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
TokenDep = Annotated[str, Depends(oauth2)]

def get_current_user(repo: UserRepoDep, token: TokenDep) -> User:
    verify_token(token, TokenType.ACCESS)
    payload = decode_token(token)

    user = repo.find_by_id(int(payload["sub"]))
    if not user:
        raise UserNotFoundError("User not found.")
    
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]

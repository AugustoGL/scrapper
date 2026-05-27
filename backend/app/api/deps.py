from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.security import verify_token, decode_token
from app.core.db import get_session
from app.models import User
from app.schema.auth import TokenType
from app.services.user_service import get_user_by_id
from app.repository.user_repository import UserRepository
from app.services.auth_service import AuthService



SessionDep = Annotated[Session, Depends(get_session)]

def get_user_repository(session: SessionDep):
    return UserRepository(session)

UserRepoDep = Annotated[UserRepository, Depends(get_user_repository)]

def get_auth_service(repo: UserRepoDep):
    return AuthService(repo)

AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]

oauth2 = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
TokenDep = Annotated[str, Depends(oauth2)]

def get_current_user(session: SessionDep, token: TokenDep) -> User:
    if not verify_token(token, TokenType.ACCESS):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token invalid")
    
    payload = decode_token(token)

    user = get_user_by_id(session=session, id_user=int(payload["sub"]))
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]

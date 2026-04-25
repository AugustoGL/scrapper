from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.security import verify_token, decode_token
from app.core.db import get_session
from app.models import User
from app.schema.auth import TokenType
from app.services.user_service import get_user_by_id


SessionDep = Annotated[Session, Depends(get_session)]

oauth2 = OAuth2PasswordBearer(tokenUrl="auth/login/")
TokenDep = Annotated[str, Depends(oauth2)]

def get_current_user(session: SessionDep, token: TokenDep) -> User:
    if not verify_token(token, TokenType.ACCESS):
        raise HTTPException("Token invalid")
    
    payload = decode_token(token)

    user = get_user_by_id(session=session, id_user=int(payload["sub"]))
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]

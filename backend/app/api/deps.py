from typing import Annotated
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.db import get_session


SessionDep = Annotated[Session, Depends(get_session)]

oauth2 = OAuth2PasswordBearer(tokenUrl="auth/login/")
TokenDep = Annotated[str, Depends(oauth2)]

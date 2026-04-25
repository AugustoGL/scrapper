from datetime import datetime, timedelta, timezone
import jwt
from jwt import PyJWTError
from passlib.context import CryptContext
from .config import settings
from app.schema.auth import TokenType


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_token(type_token: TokenType, user_id: int, expires_delta: timedelta):
    expire = datetime.now(timezone.utc) + expires_delta
    payload = {
        "sub": str(user_id), "type": type_token.value, "exp": expire
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload
    except PyJWTError:
        return None
    
def verify_token(token: str, expected_type: TokenType | None = None):
    payload = decode_token(token)

    if not payload:
        return False

    if payload.get("type") != expected_type.value:
        return False

    return True

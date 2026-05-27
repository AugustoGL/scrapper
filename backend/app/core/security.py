from datetime import datetime, timedelta, timezone
import jwt
from jwt import PyJWTError
from passlib.context import CryptContext
from .config import settings
from app.schema.auth import TokenType
from ..exceptions.exceptions import InvalidTokenError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_token(payload: dict, expires_delta: timedelta):
    expire = datetime.now(timezone.utc) + expires_delta
    payload["exp"] = expire
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload
    except PyJWTError as e:
        return None
    
def verify_token(token: str, expected_type: TokenType) -> None:
    payload = decode_token(token)

    if not payload:
        raise InvalidTokenError("Invalid token.")

    if payload.get("type") != expected_type.value:
        raise InvalidTokenError("Invalid token. A different type of token was expected.")

    exp = payload.get("exp")
    now = datetime.now().timestamp()

    if now > exp:
        raise InvalidTokenError("Invalid token. Token already expired.")

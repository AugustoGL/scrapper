from enum import Enum
from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    
    
class LoginRequest(BaseModel):
    email: str
    password: str


class TokenType(str, Enum):
    ACCESS = "access"
    REFRESH = "refresh"

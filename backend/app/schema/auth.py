from enum import Enum
from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    
    
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    password: str

class TokenType(str, Enum):
    RESET_PASSWORD = "reset_password"
    ACCESS = "access"
    REFRESH = "refresh"
    VERIFY = "verify"


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    access_token_type: str = "bearer"

class MessageResponse(BaseModel):
    detail: str

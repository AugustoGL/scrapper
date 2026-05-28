from datetime import timedelta
from fastapi import HTTPException, status

from app.core.config import settings
from app.core.security import hash_password, verify_password, create_token, verify_token, decode_token
from app.repository.user_repository import UserRepository
from .user_service import get_user_by_email, create_user
from app.services.email_service import EmailService
from app.schema.auth import RegisterRequest, LoginRequest, TokenType, TokenPair
from app.models import User
from app.exceptions.exceptions import UserNotFoundError, ConflictError, AuthenticationError


class AuthService:
    def __init__(self, repositosry: UserRepository):
        self.repo = repositosry
        self.email_service = EmailService()
        
    def register_user(self, data: RegisterRequest) -> None:
        if self.repo.exists_by_email(data.email):
            raise ConflictError("Email already registered")
        
        hashed_password = hash_password(data.password)
        user = User(
            username=data.username,
            email=data.email,
            password=hashed_password
        )
        saved_user = self.repo.save(user)
        token = create_token(
            {
                "sub": str(saved_user.id_user),
                "type": TokenType.VERIFY,
            },
            timedelta(hours=1)
        )
        self.email_service.send_verification_email(saved_user.email, token)

    def verify_user(self, token: str) -> None:
        verify_token(token, TokenType.VERIFY)
        payload = decode_token(token)

        user = self.repo.find_by_id(int(payload["sub"]))
        if not user:
            raise UserNotFoundError("User not found.")
        if user.is_verified:
            raise ConflictError("User already verified.")

        user.is_verified = True
        self.repo.save(user)

    def login(self, data: LoginRequest):
        user = self.repo.find_by_email(data.email)

        if not user:
            raise AuthenticationError()

        is_valid_password = verify_password(data.password, user.password)
        if not is_valid_password:
            raise AuthenticationError()

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

        payload_access_token = {"sub": str(user.id_user), "type": TokenType.ACCESS.value}
        payload_refresh_token = {"sub": str(user.id_user), "type": TokenType.REFRESH.value}

        access_token = create_token(payload_access_token, access_token_expires)
        refresh_token = create_token(payload_refresh_token, refresh_token_expires)

        return TokenPair(access_token=access_token, refresh_token=refresh_token)

    def refresh_token(self, refresh_token: str):
        verify_token(refresh_token, TokenType.REFRESH)

        payload = decode_token(refresh_token)
        payload["type"] = TokenType.ACCESS.value
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

        access_token = create_token(payload, access_token_expires)
        return TokenPair(access_token=access_token, refresh_token=refresh_token)

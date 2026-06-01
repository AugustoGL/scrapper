from datetime import timedelta

from app.core.config import settings
from app.core.security import hash_password, verify_password, create_token, verify_token, decode_token
from app.repository.user_repository import UserRepository
from app.services.email_service import EmailService
from app.schema.auth import RegisterRequest, LoginRequest, TokenType, TokenPair, ResetPasswordRequest
from app.models import User
from app.exceptions.exceptions import UserNotFoundError, ConflictError, AuthenticationError, UserNotVerified


class AuthService:
    def __init__(self, repository: UserRepository):
        self.repo = repository
        self.email_service = EmailService()

    def _send_verification_email(self, user: User) -> None:
        token = create_token(
            {
                "sub": str(user.id_user),
                "type": TokenType.VERIFY,
            },
            timedelta(minutes=settings.VERIFY_TOKEN_EXPIRE_MINUTES)
        )

        self.email_service.send_verification_email(
            user.email,
            token
        )
        
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
        self._send_verification_email(saved_user)

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

    def resend_verification_email(self, email: str) -> None:
        user = self.repo.find_by_email(email)

        if not user:
            return

        if user.is_verified:
            return

        self._send_verification_email(user)

    def login(self, data: LoginRequest):
        user = self.repo.find_by_email(data.email)

        if not user:
            raise AuthenticationError()

        is_valid_password = verify_password(data.password, user.password)
        if not is_valid_password:
            raise AuthenticationError()

        if not user.is_verified:
            raise UserNotVerified()

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

    def forgot_password(self, email: str):
        user = self.repo.find_by_email(email)
        if not user:
            return
        payload = {
            "sub": str(user.id_user),
            "type": TokenType.RESET_PASSWORD
        }
        token_expires = timedelta(minutes=settings.RESET_PASSWORD_TOKEN_EXPIRE_MINUTES)
        reset_password_token = create_token(payload, token_expires)
        self.email_service.send_password_reset_email(user.email, reset_password_token)

        user.reset_token = reset_password_token
        self.repo.save(user)

    def reset_password(self, data: ResetPasswordRequest):
        verify_token(data.token, TokenType.RESET_PASSWORD)
        payload = decode_token(data.token)
        user = self.repo.find_by_id(payload["sub"])
        if not user:
            raise UserNotFoundError("User not found.")
        if user.reset_token != data.token:
            return AuthenticationError("Invalid reset token.")
        hashed_password = hash_password(data.password)
        user.password = hashed_password
        self.repo.save(user)

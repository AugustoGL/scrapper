import smtplib
from email.mime.multipart import  MIMEMultipart
from email.mime.text import MIMEText

from uvicorn.server import logger

from app.exceptions.exceptions import EmailDeliveryError
from app.core.security import settings


class EmailService:

    def _send(self, to_email: str, subject: str, html: str):
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.FROM_EMAIL
        msg["To"] = to_email
        msg.attach(MIMEText(html, "html"))
    
        try:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.sendmail(settings.FROM_EMAIL, to_email, msg.as_string())
        except Exception as e:
            raise EmailDeliveryError(f"No se pudo enviar email a {to_email}") from e

    def send_verification_email(self, to_email: str, token: str):
        link = f"{settings.FRONTEND_URL}{settings.FRONTEND_VERIFY_EMAIL_PATH}?token={token}"
        self._send(
            to_email,
            "Verificá tu cuenta",
            f"<a href='{link}'>Verificar email</a>"
        )

    def send_password_reset_email(self, to_email: str, token: str):
        link = f"{settings.FRONTEND_URL}{settings.FRONTEND_RESET_PASSWORD_PATH}?token={token}"
        self._send(
            to_email,
            "Recuperar contraseña",
            f"<a href='{link}'>Resetear contraseña</a>"
        )

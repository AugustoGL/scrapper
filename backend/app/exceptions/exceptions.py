class AppError(Exception):
    detail = "Application Error"


class NotFoundError(AppError):
    pass

class ConflictError(AppError):
    pass

class AuthenticationError(AppError):
    detail = "Authentication failed. Invalid credentials"

class ValidationError(AppError):
    pass

class ForbiddenError(AppError):
    pass

class ExternalServiceError(AppError):
    pass

# Específicas
class UserNotFoundError(NotFoundError):
    pass

class EmailAlreadyRegisteredError(ConflictError):
    pass

class InvalidTokenError(ValidationError):
    pass

class EmailNotVerifiedError(ForbiddenError):
    pass

class EmailDeliveryError(ExternalServiceError):
    pass
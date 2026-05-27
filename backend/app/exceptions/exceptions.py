class AppError(Exception):
    pass

class NotFoundError(AppError):
    pass

class ConflictError(AppError):
    pass

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
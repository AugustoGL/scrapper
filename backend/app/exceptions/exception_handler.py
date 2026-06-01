from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.exceptions.exceptions import (
    NotFoundError,
    ConflictError,
    ValidationError,
    ForbiddenError,
    ExternalServiceError,
    AuthenticationError
)

def register_exception_handlers(app: FastAPI):

    @app.exception_handler(NotFoundError)
    async def not_found(request: Request, exc: NotFoundError):
        return JSONResponse(status_code=404, content={"detail": str(exc)})

    @app.exception_handler(AuthenticationError)
    async def auth(request: Request, exc: AuthenticationError):
        return JSONResponse(status_code=401, content={"detail": exc.detail})

    @app.exception_handler(ConflictError)
    async def conflict(request: Request, exc: ConflictError):
        return JSONResponse(status_code=409, content={"detail": str(exc)})

    @app.exception_handler(ValidationError)
    async def validation(request: Request, exc: ValidationError):
        return JSONResponse(status_code=400, content={"detail": str(exc)})

    @app.exception_handler(ForbiddenError)
    async def forbidden(request: Request, exc: ForbiddenError):
        return JSONResponse(status_code=403, content={"detail": exc.detail})

    @app.exception_handler(ExternalServiceError)
    async def external_service(request: Request, exc: ExternalServiceError):
        return JSONResponse(status_code=502, content={"detail": str(exc)})

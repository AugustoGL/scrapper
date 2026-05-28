from fastapi import APIRouter, status
from app.api.deps import AuthServiceDep, TokenDep
from app.schema.auth import RegisterRequest, LoginRequest, TokenPair


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="""Create a new user account.
    - Does not return tokens
    - Use `/login` after registration to obtain tokens"""
)
def register(auth_service: AuthServiceDep, data_user: RegisterRequest):
    auth_service.register_user(data_user)

@router.post(
    "/verify-user",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Verifiy email user with token"
)
def verify_user(auth_service: AuthServiceDep, token: str):
    auth_service.verify_user(token)


@router.post(
    "/login",
    summary="Authenticate user",
    description="""
    Authenticate a user using email and password.

    Returns:

    - **access_token**: Short-lived token used to access protected endpoints
    - **refresh_token**: Long-lived token used to obtain new access tokens

    ### Token usage

    Use the access token in protected endpoints:
    (Header)Authorization: Bearer <access_token>"""
)
def login(auth_service: AuthServiceDep, data: LoginRequest) -> TokenPair:
    return auth_service.login(data)

@router.post(
    "/refresh",
    summary="Refresh access token",
    description="""
    Generate a new access token using a valid refresh token.

    ### How to use

    Send the refresh token in the Authorization header:

    Authorization: Bearer <refresh_token>


    ### Behavior

    - Validates refresh token
    - Generates a new access token
    - Returns both tokens (optional strategy)

    ### Notes

    - Refresh token must be valid and not expired
    - Access tokens are short-lived
    """
)
def refresh_access_token(auth_service: AuthServiceDep, refresh_token: TokenDep) -> TokenPair:
    return auth_service.refresh_token(refresh_token)

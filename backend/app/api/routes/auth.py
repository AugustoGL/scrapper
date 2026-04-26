from fastapi import APIRouter, status
from app.api.deps import SessionDep, TokenDep
from app.services.auth_service import register_user, login_user, refresh_tokens
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
def register(session: SessionDep, data_user: RegisterRequest):
    register_user(session=session, data_user=data_user)

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
def login(session: SessionDep, data_login: LoginRequest) -> TokenPair:
    return login_user(session=session, data_login=data_login)

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
def refresh_access_token(refresh_token: TokenDep) -> TokenPair:
    return refresh_tokens(refresh_token)

from fastapi import APIRouter, status
from app.api.deps import SessionDep
from app.services.auth_service import register_user 
from app.schema.auth import RegisterRequest


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register",status_code=status.HTTP_201_CREATED)
def register(session: SessionDep, data: RegisterRequest):
    register_user(session=session, username=data.username, email=data.email, password=data.password) 

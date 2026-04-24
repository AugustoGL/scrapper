from fastapi import APIRouter, status
from app.api.deps import SessionDep
from app.services.auth_service import register_user 
from app.schema.auth import RegisterRequest


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register",status_code=status.HTTP_201_CREATED)
def register(session: SessionDep, data_user: RegisterRequest):
    register_user(session=session, data_user=data_user)

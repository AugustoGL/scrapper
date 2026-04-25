from fastapi import APIRouter
from app.api.deps import SessionDep, CurrentUser
from app.schema.user import ReadUser, UpdateUser
from app.services.user_service import edit_user


router = APIRouter(prefix="/users", tags=["User"])

@router.get("/me")
def get_my_user(user: CurrentUser) -> ReadUser:
    return user

@router.put("/me")
def edit_my_user(session: SessionDep, user: CurrentUser, updateUser: UpdateUser) -> ReadUser:
    return edit_user(session, user.id_user, user)
    
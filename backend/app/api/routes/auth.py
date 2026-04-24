from fastapi import APIRouter


router = APIRouter(prefix="/auth", tags=["Auth"])

@router.get("/hello", summary="Test endpoint", description="Returns a simple message to confirm the auth router is active.")
def hello_auth():
    return {"message": "Hello from auth"}

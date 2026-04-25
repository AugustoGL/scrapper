from pydantic import BaseModel


class ReadUser(BaseModel):
    username: str
    email: str

class UpdateUser(BaseModel):
    username: str
    email: str
    password: str
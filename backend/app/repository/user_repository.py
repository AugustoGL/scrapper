from sqlalchemy.orm import Session
from sqlalchemy import select, exists
from app.models import User



class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def find_by_id(self, id_user: int) -> User | None:
        return self.session.get(User, id_user)

    def find_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email)
        return self.session.execute(statement).scalars().first()

    def exists_by_email(self, email: str) -> bool:
        stmt = select(exists().where(User.email == email))
        return bool(self.session.scalar(stmt))

    def save(self, user: User) -> User:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user
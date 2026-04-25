from typing import List
from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from app.models import Table, User
from app.schema.table import CreateTable, UpdateTable


def get_tables(session: Session, user: User) -> List[Table]:
    statement = select(Table).options(joinedload(Table.columns)).where(Table.id_user == user.id_user)
    return session.execute(statement).unique().scalars().all()

def create_table(session: Session, id_user: int, table: CreateTable) -> Table:
    new_table = Table(**table.model_dump(), id_user=id_user, creation_at=datetime.now())
    session.add(new_table)
    session.commit()
    session.refresh(new_table)
    return new_table

def get_table(session: Session, user: User, id_table: int) -> Table:
    statement = select(Table).where(
        Table.id_user == user.id_user, 
        Table.id_table == id_table
    )
    table = session.execute(statement).unique().scalars().first()
    if not table:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Table not found")
    return table

def edit_table(session: Session, user: User, id_table: int, updateTable: UpdateTable) -> Table:
    table = get_table(session, user, id_table)
    table.name = updateTable.name
    session.add(table)
    session.commit()
    session.refresh(table)
    return table

def delete_table(session: Session, user: User, id_table: int) -> Table:
    table = get_table(session, user, id_table)
    session.delete(table)
    session.commit()
    return table
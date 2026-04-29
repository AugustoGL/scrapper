from typing import List
from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from app.models import Table, User, TableColumn
from app.schema.table import CreateTable, UpdateTable, CreateColumn, UpdateColumn


def get_tables(session: Session, user: User) -> List[Table]:
    statement = select(Table).options(joinedload(Table.columns)).where(Table.id_user == user.id_user)
    return session.execute(statement).unique().scalars().all()

def create_table(session: Session, id_user: int, table: CreateTable) -> Table:
    new_table: Table = Table(name=table.name, id_user=id_user, creation_at=datetime.now())
    session.add(new_table)
    session.flush()

    for column in table.columns:
        
        new_column = TableColumn(
            **column.model_dump(),
            id_table = new_table.id_table
        )
        session.add(new_column)
        
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

def get_columns(session: Session, user: User, id_table: int) -> TableColumn:
    table = get_table(session, user, id_table)
    return table.columns
    
def create_column(session: Session, user: User, id_table: int, createColumn: CreateColumn) -> TableColumn:
    get_table(session, user, id_table)
    new_column = TableColumn(**createColumn.model_dump(), id_table=id_table)
    session.add(new_column)
    session.commit()
    session.refresh(new_column)
    return new_column

def get_column(session: Session, user: User, id_table: int, id_column) -> TableColumn:
    get_table(session, user, id_table)
    statement = select(TableColumn).where(
        Table.id_table == id_table,
        TableColumn.id_column == id_column
    )
    return session.execute(statement).scalars().first()

def edit_column(session: Session, user: User, id_table: int, id_column: int, updateColumn: UpdateColumn)-> TableColumn:
    column = get_column(session, user, id_table, id_column)
    column.name=updateColumn.name
    column.data_type=updateColumn.data_type
    session.add(column)
    session.commit()
    session.refresh(column)
    return column
    
def delete_column(session: Session, user: User, id_table: int, int_column: int) -> Table:
    column = get_column(session, user, id_table, int_column)
    session.delete(column)
    session.commit()
    return column    

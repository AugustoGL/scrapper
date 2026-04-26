from typing import List
from fastapi import APIRouter
from app.api.deps import SessionDep, CurrentUser
from app.schema.table import ReadTable, CreateTable, UpdateTable
from app.services import table_service


router = APIRouter(prefix="/tables", tags=["Table"])

@router.get("/")
def get_tables(session: SessionDep, user: CurrentUser) -> List[ReadTable]:
    result = table_service.get_tables(session, user)
    return result

@router.post("/")
def create_tables(session: SessionDep, user: CurrentUser, table: CreateTable) -> ReadTable:
    return table_service.create_table(session, user.id_user, table)

@router.get("/{id_table}")
def get_table(session: SessionDep, user: CurrentUser, id_table: int) -> ReadTable:
    return table_service.get_table(session, user, id_table)

@router.put("/{id_table}")
def update_table(session: SessionDep, user: CurrentUser, id_table: int, updateTable: UpdateTable) -> ReadTable:
    return table_service.edit_table(session, user, id_table, updateTable)

@router.delete("/{id_table}")
def update_table(session: SessionDep, user: CurrentUser, id_table: int) -> ReadTable:
    return table_service.delete_table(session, user, id_table)

    
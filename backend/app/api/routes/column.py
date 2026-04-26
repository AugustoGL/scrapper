from typing import List
from fastapi import APIRouter
from app.api.deps import SessionDep, CurrentUser
from app.schema.table import ReadColumn, CreateColumn, UpdateColumn
from app.services import table_service


router = APIRouter(prefix="/tables/{id_table}/columns", tags=["Column"])

@router.get("/")
def get_columns(session: SessionDep, user: CurrentUser, id_table: int) -> List[ReadColumn]:
    return table_service.get_columns(session, user, id_table)


@router.post("/")
def create_column(
    session: SessionDep,
    user: CurrentUser,
    id_table,
    column: CreateColumn
) -> ReadColumn:
    return table_service.create_column(session, user, id_table, column)


@router.get("/{id_column}")
def get_column(
    session: SessionDep,
    user: CurrentUser,
    id_table: int,
    id_column: int
) -> ReadColumn:
    return table_service.get_column(session, user, id_table, id_column)


@router.put("/{id_column}")
def update_column(
    session: SessionDep,
    user: CurrentUser,
    id_table: int,
    id_column: int,
    updateColumn: UpdateColumn
) -> ReadColumn:
    return table_service.edit_column(session, user, id_table, id_column, updateColumn)

@router.delete("/{id_column}")
def delete_column(
    session: SessionDep,
    user: CurrentUser,
    id_table: int,
    id_column: int
) -> ReadColumn:
    return table_service.delete_column(session, user, id_table, id_column)
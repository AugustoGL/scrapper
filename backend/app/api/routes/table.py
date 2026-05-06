from typing import List
from fastapi import APIRouter, BackgroundTasks
from app.api.deps import SessionDep, CurrentUser
from app.schema.table import ReadTable, CreateTable, UpdateTable, ProcessHtmlRequest, ReadProcessing, DetailTable
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
def get_table(session: SessionDep, user: CurrentUser, id_table: int) -> DetailTable:
    return table_service.get_table(session, user, id_table)

@router.put("/{id_table}")
def update_table(session: SessionDep, user: CurrentUser, id_table: int, updateTable: UpdateTable) -> ReadTable:
    return table_service.edit_table(session, user, id_table, updateTable)

@router.delete("/{id_table}")
def update_table(session: SessionDep, user: CurrentUser, id_table: int) -> ReadTable:
    return table_service.delete_table(session, user, id_table)

@router.post("/{id_table}/processing")
def init_processing(
    session: SessionDep, 
    user: CurrentUser, 
    id_table: int, 
    processingCreate: ProcessHtmlRequest, 
    background_tasks: BackgroundTasks
)-> ReadProcessing:
    return table_service.init_processing(session, user, id_table, processingCreate, background_tasks)
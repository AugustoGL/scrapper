from typing import List
from datetime import datetime
from fastapi import HTTPException, status, BackgroundTasks
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload, selectinload
from app.models import Table, User, TableColumn, Processing, Record, Value
from app.schema.table import CreateTable, UpdateTable, CreateColumn, UpdateColumn, ProcessHtmlRequest, ProcessingStatus, ReadProcessing
from app.ai_client import extract_from_html, ExtractionResult
from app.core.db import SessionLocal


def get_tables(session: Session, user: User) -> List[Table]:
    statement = select(Table).options(
        selectinload(Table.columns),
        selectinload(Table.processings)
    ).where(Table.id_user == user.id_user)
    
    return session.execute(statement).unique().scalars().all()

def create_table(session: Session, id_user: int, table: CreateTable) -> Table:
    new_table: Table = Table(name=table.name, id_user=id_user, created_at=datetime.now())
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
    statement = select(Table).options(
        selectinload(Table.columns),
        selectinload(Table.processings),
        selectinload(Table.records).selectinload(Record.values)
    ).where(
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

def init_processing(
    session: Session, 
    user: User, 
    id_table: int, 
    processHtmlRequest: ProcessHtmlRequest, 
    background_tasks: BackgroundTasks
) -> ReadProcessing:
    
    get_table(session, user, id_table)
    
    new_processing = Processing(
        status=ProcessingStatus.PENDING,
        created_at=datetime.now(),
        started_at=None,
        finished_at=None,
        error_message=None,
        error_detail=None,
        id_table=id_table
    )
    session.add(new_processing)
    session.commit()
    session.refresh(new_processing)
    
    print("BACKGROUND TASK: add task 'run_extraction'")
    background_tasks.add_task(run_extraction, new_processing.id_processing, id_table, processHtmlRequest)

    return new_processing


def run_extraction(id_processing: int, id_table: int, processHtmlRequest: ProcessHtmlRequest) -> None:
    print("BACKGROUND TASK: starting task 'run_extraction'...")
    session = SessionLocal()
    try:
        processing = session.get(Processing, id_processing)
        processing.status = ProcessingStatus.PROCESSING
        processing.started_at = datetime.now()
        session.add(processing)
        session.commit()
        
        statement = select(TableColumn).where(
            TableColumn.id_table == id_table,
        )
        columns = session.execute(statement).scalars().all()
        
        print("BACKGROUND TASK: request to AI API ")
        result, error_message, error_detail = _do_extraction(columns, processHtmlRequest)

        if result:
            _persist_result(session, processing, result)
            processing.status = ProcessingStatus.COMPLETED
            print()
        else:
            print("BACKGROUND TASK: Error request to AI API")
            processing.status = ProcessingStatus.FAILED
        
        processing.finished_at = datetime.now()
        processing.error_message = error_message
        processing.error_detail = error_detail
        

        session.add(processing)
        session.commit()
        print("BACKGROUND TASK: Executed commit")
    finally:
        session.close()
        print("BACKGROUND TASK: Finished task")


def _do_extraction(columns: List[dict], processHtmlRequest: ProcessHtmlRequest) -> tuple[ExtractionResult | None, str | None, str | None]:
    try:
        result = extract_from_html(
            extra_instructions=processHtmlRequest.extra_instructions,
            html=processHtmlRequest.html,
            columns=columns,
        )
        return result, None, None
    except ValidationError as e:
        return None, "Extracted data didn't match expected format", str(e)
    except Exception as e:
        return None, "Unexpected error during extraction", str(e)
    

def _persist_result(session: Session, processing: Processing, result: ExtractionResult) -> None:
    for extracted_record in result.records:
        record = Record(
            created_at=datetime.now(),
            id_table=processing.id_table,
            id_processing=processing.id_processing,
        )
        session.add(record)
        session.flush()

        for extracted_value in extracted_record.values:
            value = Value(
                value=str(extracted_value.value) if extracted_value.value is not None else None,
                id_record=record.id_record,
                id_column=extracted_value.id_column,
            )
            session.add(value)
    session.flush()

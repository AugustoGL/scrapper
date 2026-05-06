from typing import List
from enum import Enum
from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class ReadValue(BaseModel):
    id_value: int
    value: str | None
    id_column: int

class ReadRecord(BaseModel):
    id_record: int
    values: List[ReadValue]
    creation_at: datetime

class ReadColumn(BaseModel):
    id_column: int
    name: str
    description: str
    data_type: str
    description: str

    class Config:
        from_attributes = True

class CreateColumn(BaseModel):
    name: str
    description: str
    data_type: str
    description: str
    
class UpdateColumn(CreateColumn):
    pass

class ReadProcessing(BaseModel):
    id_processing: int
    status: str
    creation_at: datetime
    error_message: str | None
    id_table: int

class ProcessingStatus(str, Enum):
    PENDING = "pending"
    FAILED = "failed"
    COMPLETED = "completed"

class ReadTable(BaseModel):
    id_table: int
    name: str
    creation_at: datetime
    columns : List[ReadColumn]
    processings: List[ReadProcessing]
    
    class Config:
        from_attributes = True
        
class DetailTable(ReadTable):
    records: List[ReadRecord]

class CreateTable(BaseModel):
    name: str = Field(min_length=1, strip_whitespace=True)
    columns: List[CreateColumn]
    
class UpdateTable(CreateTable):
    pass

class ProcessHtmlRequest(BaseModel):
    html: str
    
    @field_validator("html")
    @classmethod
    def validate_html(cls, v: str):
        if not v or not v.strip():
            raise ValueError("Field 'html' must not be empty or contain only whitespace.")

        if len(v.strip()) < 25:
            raise ValueError("Field 'html' must contain at least 25 non-whitespace characters.")

        return v

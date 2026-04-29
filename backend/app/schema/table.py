from typing import List
from datetime import datetime
from pydantic import BaseModel, Field


class ReadValue(BaseModel):
    id_value: int
    value: str
    id_column: int

class ReadRecord(BaseModel):
    id_record: int
    values: List[ReadValue]
    creation_at: datetime

class ReadColumn(BaseModel):
    id_column: int
    name: str
    data_type: str
    description: str

    class Config:
        from_attributes = True

class CreateColumn(BaseModel):
    name: str
    data_type: str
    description: str
    
class UpdateColumn(CreateColumn):
    pass

class ReadTable(BaseModel):
    id_table: int
    name: str
    creation_at: datetime
    columns : List[ReadColumn]
    records: List[ReadRecord]
    
    class Config:
        from_attributes = True

class CreateTable(BaseModel):
    name: str = Field(min_length=1, strip_whitespace=True)
    columns: List[CreateColumn]
    
class UpdateTable(CreateTable):
    pass

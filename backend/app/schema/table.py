from typing import List
from datetime import datetime
from pydantic import BaseModel, Field


class ReadColumn(BaseModel):
    id_column: int
    name: str
    data_type: str

    class Config:
        from_attributes = True

class CreateColumn(BaseModel):
    name: str
    data_type: str
    
class UpdateColumn(CreateColumn):
    pass

class ReadTable(BaseModel):
    id_table: int
    name: str
    creation_at: datetime
    columns : List[ReadColumn]
    
    class Config:
        from_attributes = True

class CreateTable(BaseModel):
    name: str = Field(min_length=1, strip_whitespace=True)
    
class UpdateTable(CreateTable):
    pass

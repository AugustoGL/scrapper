from typing import Literal, Any
from pydantic import BaseModel, Field
from app.schema.table import ReadColumn


DataType = Literal["string", "int", "float", "url"]

    
class ExtractedValue(BaseModel):
    id_column: int = Field(description="The id of the column this value belongs to")
    value: Any = Field(description="The extracted value, or null if not found in the HTML")
    data_type: DataType = Field(description="The data type of the value")

class ExtractionRecord(BaseModel):
    values: list[ExtractedValue] = Field(description="All extracted values for this record")

class ExtractionResult(BaseModel):
    records: list[ExtractionRecord] = Field(description="One record per item/row found in the HTML")

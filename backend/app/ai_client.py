import os
from google import genai
from google.genai import types
from app.core.config import settings
from app.schema.ai import ReadColumn, ExtractionResult


DEFAULT_MODEL = "gemini-2.5-flash-lite"
client = genai.Client(api_key=settings.GEMINI_API_KEY)

def columns_to_string(columns: list[dict]) -> str:
    return "\n".join(
        f'  - id="{col.id_column}" | name="{col.name}" | description="{col.description}" | data_type="{col.data_type}"'
        for col in columns
    )

def extract_from_html(
    html: str,
    columns: list[ReadColumn],
    model: str = DEFAULT_MODEL,
) -> ExtractionResult:
    """
    Extrae registros de un HTML string según las columnas definidas.
 
    Args:
        html:     HTML como string (puede ser resumido/acortado).
        columns:  Lista de Column con id, name, description y data_type.
        model:    Modelo de Gemini a usar.
 
    Returns:
        ExtractionResult con la lista de records encontrados.
    """
    columns_desc = columns_to_string(columns)

    prompt = f"""
        You are a data extraction assistant.
        Extract ALL records from the HTML below and map each one to the given columns.
        
        COLUMNS:
        {columns_desc}
        
        RULES:
        - Return one record per item/row found in the HTML.
        - Use null if a value is not found for a column.
        - For data_type "int" or "float": return numeric values (no quotes, no currency symbols).
        - For data_type "string" or "url": return plain strings.
        
        HTML:
        {html}
    """
 
    response = client.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0,
            response_mime_type="application/json",
            response_schema=ExtractionResult,
        ),
    )
 
    return response.parsed

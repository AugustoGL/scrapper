from fastapi import FastAPI


app = FastAPI(
    title="Scrapper API",
    description="API for scraping and processing data.",
    version="1.0.0"
)

@app.get(
    "/health",
    summary="Health check",
    description="Checks if the API is up and running.",
    tags=["Health"]
)
def health():
    return {"status": "ok"}

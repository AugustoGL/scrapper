#!/bin/sh

echo "Running DB setup..."
python -m app.core.db

echo "Starting app..."
# run (production) or dev (development) 
uvicorn app.main:app --host 0.0.0.0 --port 80

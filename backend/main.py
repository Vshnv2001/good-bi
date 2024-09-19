from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message" : "Root Message"}

@app.post("/api/datasets")
async def create_dataset(
    datasetName: str = Form(...),
    datasetDescription: str = Form(...),
    datasetFile: UploadFile = File(...)
):
    print(f"Dataset Name: {datasetName}")
    print(f"Dataset Description: {datasetDescription}")

    # Read the CSV file
    df = pd.read_csv(datasetFile.file)

    # Connect to the database
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    # Create table with columns from CSV
    columns = ', '.join([f'"{col}" TEXT' for col in df.columns])
    cursor.execute(f'CREATE TABLE IF NOT EXISTS "{datasetName}" ({columns})')

    # Insert rows into the table
    for row in df.itertuples(index=False, name=None):
        placeholders = ', '.join(['?'] * len(row))
        cursor.execute(f'INSERT INTO "{datasetName}" VALUES ({placeholders})', row)

    conn.commit()
    conn.close()

    return {"message": "Dataset created successfully"}

@app.get("/health_check")
def health_check():
    print("Health Check Passed, API is up and running LOLLLL!")
    return {"data" : "Health Check Passed, API is up and running!"}
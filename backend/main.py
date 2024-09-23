from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import psycopg2.extras
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.get("/")
def read_root():
    return {"message" : "Root Message"}

@app.post("/api/projects/new")
async def create_project(
    name: str = Form(...),
):
    print(f"Project Name: {name}")

    # Connect to the database
    import os

    POSTGRES_URI = os.getenv('POSTGRES_URI')
    print(f"POSTGRES_URI: {POSTGRES_URI}")
    conn = psycopg2.connect(POSTGRES_URI)
    cursor = conn.cursor()

    cursor.execute(f'CREATE TABLE IF NOT EXISTS projects (project_id SERIAL PRIMARY KEY, user_id VARCHAR(255), name VARCHAR(255), created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)')

    cursor.execute(f'INSERT INTO projects (user_id, name) VALUES (%s, %s)', ('1', name))

    conn.commit()
    conn.close()

    return {"message": "Project created successfully"}

@app.get("/api/projects/get")
async def get_projects():
    # Connect to the database
    import os

    POSTGRES_URI = os.getenv('POSTGRES_URI')
    print(f"POSTGRES_URI: {POSTGRES_URI}")
    conn = psycopg2.connect(POSTGRES_URI)
    cursor = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)

    cursor.execute(f'SELECT * FROM projects WHERE user_id = %s', "1")

    res = cursor.fetchall()

    conn.commit()
    conn.close()

    return res

@app.post("/api/projects/{project_id}/update")
async def update_project(
    project_id,
    name: str = Form(...),
):
    # Connect to the database
    import os

    POSTGRES_URI = os.getenv('POSTGRES_URI')
    print(f"POSTGRES_URI: {POSTGRES_URI}")
    conn = psycopg2.connect(POSTGRES_URI)
    cursor = conn.cursor()

    cursor.execute(f'UPDATE projects SET name = %s WHERE project_id = {project_id}', (name))

    conn.commit()
    conn.close()

    return {"message": "Project updated successfully"}

@app.get("/health_check")
def health_check():
    print("Health Check Passed, API is up and running LOLLLL!")
    return {"data" : "Health Check Passed, API is up and running!"}
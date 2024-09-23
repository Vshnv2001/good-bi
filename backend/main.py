from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import psycopg2.extras
import json
from uuid import uuid4 

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
    user_id: str = Form(...),
    name: str = Form(...),
):
    print(f"Project Name: {name}")

    # Connect to the database
    import os

    POSTGRES_URI = os.getenv('POSTGRES_URI')
    print(f"POSTGRES_URI: {POSTGRES_URI}")
    conn = psycopg2.connect(POSTGRES_URI)
    cursor = conn.cursor()

    cursor.execute(f'CREATE TABLE IF NOT EXISTS projects (project_id UUID, user_id UUID, name VARCHAR(255), created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)')

    cursor.execute(f'INSERT INTO projects (project_id, user_id, name) VALUES (%s, %s, %s)', (str(uuid4()), user_id, name))

    conn.commit()
    conn.close()

    return {"message": "Project created successfully"}

@app.post("/api/projects")
async def get_projects(
    user_id: str = Form(...),
):
    print(f"User ID: {user_id}")
    # Connect to the database
    import os

    POSTGRES_URI = os.getenv('POSTGRES_URI')
    print(f"POSTGRES_URI: {POSTGRES_URI}")
    conn = psycopg2.connect(POSTGRES_URI)
    cursor = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)

    cursor.execute('SELECT * FROM projects WHERE user_id = %s', (user_id,))

    res = cursor.fetchall()

    print(res)

    conn.commit()
    conn.close()

    return res

@app.post("/api/projects/update")
async def update_project(
    name: str = Form(...),
    project_id: str = Form(...),
    user_id: str = Form(...),
):
    # Connect to the database
    import os

    POSTGRES_URI = os.getenv('POSTGRES_URI')
    print(f"POSTGRES_URI: {POSTGRES_URI}")
    conn = psycopg2.connect(POSTGRES_URI)
    cursor = conn.cursor()

    cursor.execute(f'UPDATE projects SET name = %s, updated_at = CURRENT_TIMESTAMP WHERE project_id = %s AND user_id = %s', (name, project_id, user_id))

    conn.commit()
    conn.close()

    return {"message": "Project updated successfully"}

@app.post("/api/projects/delete")
async def delete_project(
    project_id: str = Form(...),
    user_id: str = Form(...),
):
    # Connect to the database
    import os

    POSTGRES_URI = os.getenv('POSTGRES_URI')
    print(f"POSTGRES_URI: {POSTGRES_URI}")
    conn = psycopg2.connect(POSTGRES_URI)
    cursor = conn.cursor()

    cursor.execute(f'DELETE FROM projects WHERE project_id = %s AND user_id = %s', (project_id, user_id))

    conn.commit()
    conn.close()

    return {"message": "Project deleted successfully"}

@app.get("/health_check")
def health_check():
    print("Health Check Passed, API is up and running LOLLLL!")
    return {"data" : "Health Check Passed, API is up and running!"}
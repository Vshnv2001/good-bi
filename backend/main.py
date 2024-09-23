from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import psycopg2.extras
import json
from uuid import uuid4 
from datetime import datetime

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

    cursor.execute(f'CREATE TABLE IF NOT EXISTS projects (project_id UUID, user_id UUID, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)')

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

@app.post("/api/insights/new")
async def create_insight(
    dataset_id: str = Form(...),
    chart_type: str = Form(...),
    start_date: str = Form(...),
    end_date: str = Form(...),
    y_range_start: float = Form(...),
    y_range_end: float = Form(...),
    title: str = Form(...),
    kpi_description: str = Form(...),
    project_id: str = Form(...),
    user_id: str = Form(...),
):
    print(start_date)
    print(end_date)
    print(f"Insight Title: {title}")

    # Connect to the database
    import os

    POSTGRES_URI = os.getenv('POSTGRES_URI')
    print(f"POSTGRES_URI: {POSTGRES_URI}")
    conn = psycopg2.connect(POSTGRES_URI)
    cursor = conn.cursor()

    cursor.execute(f'CREATE TABLE IF NOT EXISTS insights (insight_id UUID, user_id UUID, project_id UUID, dataset_id UUID, title VARCHAR(255), kpi_description TEXT, chart_type VARCHAR(255), start_date TIMESTAMPTZ, end_date TIMESTAMPTZ, y_range_start DOUBLE PRECISION, y_range_end DOUBLE PRECISION, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)')

    # Replace dataset_id with actual UUID
    cursor.execute(f'INSERT INTO insights (insight_id, user_id, project_id, dataset_id, title, kpi_description, chart_type, start_date, end_date, y_range_start, y_range_end) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', (str(uuid4()), user_id, project_id, '7bf63769-f738-4bab-8d86-bfd18fa1341f', title, kpi_description, chart_type, datetime.strptime(start_date, '%m-%d-%Y'), datetime.strptime(end_date, '%m-%d-%Y'), y_range_start, y_range_end))

    conn.commit()
    conn.close()

    return {"message": "Insight created successfully"}

@app.post("/api/insights")
async def get_insights(
    user_id: str = Form(...),
    project_id: str = Form(...),
):
    print(f"User ID: {user_id}")
    # Connect to the database
    import os

    POSTGRES_URI = os.getenv('POSTGRES_URI')
    print(f"POSTGRES_URI: {POSTGRES_URI}")
    conn = psycopg2.connect(POSTGRES_URI)
    cursor = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)

    cursor.execute('SELECT * FROM insights WHERE project_id = %s AND user_id = %s', (project_id, user_id,))

    res = cursor.fetchall()

    print(res)

    conn.commit()
    conn.close()

    return res

@app.post("/api/insights/delete")
async def delete_insight(
    insight_id: str = Form(...),
    project_id: str = Form(...),
    user_id: str = Form(...),
):
    # Connect to the database
    import os

    POSTGRES_URI = os.getenv('POSTGRES_URI')
    print(f"POSTGRES_URI: {POSTGRES_URI}")
    conn = psycopg2.connect(POSTGRES_URI)
    cursor = conn.cursor()

    cursor.execute(f'DELETE FROM insights WHERE insight_id = %s AND project_id = %s AND user_id = %s', (insight_id, project_id, user_id))

    conn.commit()
    conn.close()

    return {"message": "Insight deleted successfully"}

@app.get("/health_check")
def health_check():
    print("Health Check Passed, API is up and running LOLLLL!")
    return {"data" : "Health Check Passed, API is up and running!"}
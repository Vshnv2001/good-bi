import uuid
from fastapi import FastAPI, File, UploadFile, Form, File, UploadFile, Form
from fastapi.responses import FileResponse, JSONResponse
from starlette.responses import FileResponse, JSONResponse
from starlette.middleware.cors import CORSMiddleware
import pandas as pd
from supertokens_python.recipe.session.framework.fastapi import verify_session
from supertokens_python.recipe.session import SessionContainer
from fastapi import Depends
from utils.db_utils import get_db
from models.org_tables import OrgTables
from sqlalchemy import text
from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe import emailpassword, session
from sqlalchemy.ext.asyncio import AsyncSession
from supertokens_python.framework.fastapi import get_middleware
from datetime import datetime


init(
    app_info=InputAppInfo(
        app_name="goodbi",
        api_domain="http://localhost:3000",
        website_domain="http://localhost:3000",
        api_base_path="/api/auth",
        website_base_path="/auth"
    ),
    supertokens_config=SupertokensConfig(
        connection_uri="https://st-dev-d077cc10-75bf-11ef-822f-59b1a0e8c720.aws.supertokens.io",
        api_key="FNvAao5-YkZKaRMPzgOhiVOek8",
    ),
    framework='fastapi',
    recipe_list=[
        session.init(), # initializes session features
        emailpassword.init()
    ],
    mode='asgi' # use wsgi if you are running using gunicorn
)

app = FastAPI()
app.add_middleware(get_middleware())

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

@app.delete("/api/datasets/{datasetName}")
async def delete_dataset(datasetName: str, auth_session: SessionContainer = Depends(verify_session()), db: AsyncSession = Depends(get_db)):
    user_id = auth_session.get_user_id()

    # Delete the file from the database
    await db.execute(text(f'DROP TABLE IF EXISTS "{user_id}"."{datasetName}"'))
    await db.commit()
    
@app.get("/api/datasetnames")
async def get_dataset_names(auth_session: SessionContainer = Depends(verify_session()), db: AsyncSession = Depends(get_db)):
    user_id = auth_session.get_user_id()
    result = await db.execute(text(f"""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = :user_id AND table_type = 'BASE TABLE'
    """), {'user_id': user_id})
    tables = result.fetchall()
    tables = [table[0] for table in tables]
    return JSONResponse(content={"data": tables})

@app.get("/api/datasets")
async def get_datasets(auth_session: SessionContainer = Depends(verify_session()), db: AsyncSession = Depends(get_db)):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")
    
    # Query to get the list of tables for the user
    result = await db.execute(text(f"""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = :user_id AND table_type = 'BASE TABLE'
    """), {'user_id': user_id})
    tables = result.fetchall()
    tables = [table[0] for table in tables]
    
    datasets = []
    
    for table_name in tables:
        # Query to get the first three rows from the table
        result = await db.execute(text(f'SELECT * FROM "{user_id}"."{table_name}" LIMIT 3'))
        rows = result.fetchall()
        
        # Convert rows to JSON format
        columns = [col for col in result.keys()]
        json_rows = [dict(zip(columns, [str(value) for value in row])) for row in rows]
        description = await db.execute(text(f'SELECT description FROM "{user_id}"."{table_name}" LIMIT 1'))
        description = description.fetchone()[0]
        
        datasets.append({
            "datasetName": table_name,
            "datasetDescription": description,
            "datasetJson": json_rows
        })
    
    # Return JSON response with dataset information
    return JSONResponse(content={"data": datasets})

@app.post("/api/datasets")
async def create_dataset(
    datasetName: str = Form(...),
    datasetDescription: str = Form(...),
    datasetFile: UploadFile = File(...),
    file_id: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db)
):
    print(f"Dataset Name: {datasetName}")
    print(f"Dataset Description: {datasetDescription}")

    # Read the CSV file
    df = pd.read_csv(datasetFile.file)

    user_id = auth_session.get_user_id()
    # user_id = "test"
    print(f"User ID: {user_id}")

    # Create table with columns from CSV and user_id. Format for schema is user_id.datasetName
    columns = ', '.join([f'"{col}" TEXT' for col in df.columns] + ['user_id TEXT'] + [f'"file_id" TEXT'] + ['description TEXT'] + ['created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP'])
    await db.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{user_id}";'))
    await db.execute(text(f'CREATE TABLE IF NOT EXISTS "{user_id}"."{datasetName}" ({columns})'))
    await db.commit()
    orgtable = OrgTables(user_id=user_id, table_name=datasetName, table_description=datasetDescription)
    db.add(orgtable)
    await db.commit()

    print(f"Columns: {columns}")
    # Insert rows into the table
    for row in df.itertuples(index=False, name=None):
        print(row)
        row = list(row)
        row += [user_id, file_id, datasetDescription]
        placeholders = ', '.join([':{}'.format(i) for i in range(len(row))])
        # Convert all values to strings
        row_as_str = tuple(str(value) for value in row)
        await db.execute(text(f'INSERT INTO "{user_id}"."{datasetName}" VALUES ({placeholders})'), {str(i): value for i, value in enumerate(row_as_str)})

    await db.commit()

    return {"message": "Dataset created successfully"}

@app.post("/api/projects/new")
async def create_project(
    name: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db)
):
    print(f"Project Name: {name}")

    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{user_id}.user_data";'))
    await db.execute(text(f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data".projects (project_id UUID, user_id UUID, name VARCHAR(255), created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'))
    await db.commit()

    await db.execute(text(f"""
        INSERT INTO "{user_id}.user_data".projects
        (project_id, user_id, name)
        VALUES (:project_id, :user_id, :name)
    """), {'project_id': str(uuid.uuid4()), 'user_id': user_id, 'name': name})

    await db.commit()

    return JSONResponse(content={"message": "Project created successfully"}) 

@app.get("/api/projects")
async def get_projects(
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db)
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{user_id}.user_data";'))
    await db.execute(text(f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data".projects (project_id UUID, user_id UUID, name VARCHAR(255), created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'))
    await db.commit()

    result = await db.execute(text(f"""
        SELECT * 
        FROM "{user_id}.user_data".projects
        WHERE user_id = :user_id
    """), {'user_id': user_id})

    projects = result.fetchall()
    projects = [r._asdict() for r in projects]

    def create_project_card_object(project):
        return {
            "id": str(project['project_id']),
            "name": project['name'],
            "lastUpdated": str(project['updated_at'])
        }
    
    projects = list(map(create_project_card_object, projects))

    print(projects)

    return JSONResponse(content=projects)

@app.post("/api/projects/update")
async def update_project(
    name: str = Form(...),
    project_id: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db)
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(text(f"""
        UPDATE "{user_id}.user_data".projects
        SET name = :name, updated_at = CURRENT_TIMESTAMP 
        WHERE project_id = :project_id AND user_id = :user_id
    """), {'name': name, 'project_id': project_id, 'user_id': user_id})

    await db.commit()

    return JSONResponse(content={"message": "Project updated successfully"}) 

@app.post("/api/projects/delete")
async def delete_project(
    project_id: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db)
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(text(f"""
        DELETE FROM "{user_id}.user_data".projects
        WHERE project_id = :project_id AND user_id = :user_id
    """), {'project_id': project_id, 'user_id': user_id})

    await db.commit()

    return JSONResponse(content={"message": "Project deleted successfully"}) 

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
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db)
):
    print(f"Insight Title: {title}")

    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(text(f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data".insights (insight_id UUID, user_id UUID, project_id UUID, dataset_id UUID, title VARCHAR(255), kpi_description TEXT, chart_type VARCHAR(255), start_date TIMESTAMPTZ, end_date TIMESTAMPTZ, y_range_start DOUBLE PRECISION, y_range_end DOUBLE PRECISION, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'))
    await db.commit()

    await db.execute(text(f"""
        INSERT INTO "{user_id}.user_data".insights
        (insight_id, user_id, project_id, dataset_id, title, kpi_description, chart_type, start_date, end_date, y_range_start, y_range_end)
        VALUES (:insight_id, :user_id, :project_id, :dataset_id, :title, :kpi_description, :chart_type, :start_date, :end_date, :y_range_start, :y_range_end)
    """), {'insight_id': str(uuid.uuid4()), 'user_id': user_id, 'project_id': project_id, 'dataset_id': dataset_id, 'title': title, 'kpi_description': kpi_description, 'chart_type': chart_type, 'start_date': datetime.strptime(start_date, '%m-%d-%Y'), 'end_date': datetime.strptime(end_date, '%m-%d-%Y'), 'y_range_start': y_range_start, 'y_range_end': y_range_end})

    await db.commit()

    return JSONResponse(content={"message": "Insight created successfully"}) 

@app.post("/api/insights")
async def get_insights(
    project_id: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db)
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(text(f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data".insights (insight_id UUID, user_id UUID, project_id UUID, dataset_id UUID, title VARCHAR(255), kpi_description TEXT, chart_type VARCHAR(255), start_date TIMESTAMPTZ, end_date TIMESTAMPTZ, y_range_start DOUBLE PRECISION, y_range_end DOUBLE PRECISION, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'))
    await db.commit()

    result = await db.execute(text(f"""
        SELECT * 
        FROM "{user_id}.user_data".insights
        WHERE project_id = :project_id AND user_id = :user_id
    """), {'project_id': project_id, 'user_id': user_id})

    insights = result.fetchall()
    insights = [r._asdict() for r in insights]

    chart_config = {
        "desktop": {
            "label": "Desktop",
            "color": "hsl(var(--chart-1))",
        },
        "mobile": {
            "label": "Mobile",
            "color": "hsl(var(--chart-2))",
        },
    }

    # dbData equivalent in Python
    db_data = [
        {"month": "January", "desktop": 186, "mobile": 80},
        {"month": "February", "desktop": 305, "mobile": 200},
        {"month": "March", "desktop": 237, "mobile": 120},
        {"month": "April", "desktop": 73, "mobile": 190},
        {"month": "May", "desktop": 209, "mobile": 130},
        {"month": "June", "desktop": 214, "mobile": 140},
    ]

    # browserChartConfig equivalent in Python
    browser_chart_config = {
        "visitors": {
            "label": "Visitors",
        },
        "chrome": {
            "label": "Chrome",
            "color": "hsl(var(--chart-1))",
        },
        "safari": {
            "label": "Safari",
            "color": "hsl(var(--chart-2))",
        },
        "firefox": {
            "label": "Firefox",
            "color": "hsl(var(--chart-3))",
        },
        "edge": {
            "label": "Edge",
            "color": "hsl(var(--chart-4))",
        },
        "other": {
            "label": "Other",
            "color": "hsl(var(--chart-5))",
        },
    }

    # browserChartData equivalent in Python
    browser_chart_data = [
        {"browser": "chrome", "visitors": 275, "fill": "var(--color-chrome)"},
        {"browser": "safari", "visitors": 200, "fill": "var(--color-safari)"},
        {"browser": "firefox", "visitors": 187, "fill": "var(--color-firefox)"},
        {"browser": "edge", "visitors": 173, "fill": "var(--color-edge)"},
        {"browser": "other", "visitors": 90, "fill": "var(--color-other)"},
    ]

    def create_dashboard_card_object(insight):
        return {
            "id": str(insight['insight_id']),
            "key": str(insight['insight_id']),
            "title": insight['title'],
            "chartType": insight['chart_type'],
            "chartData": {
                "chartConfig": browser_chart_config,
                "data": browser_chart_data,
                "nameKey": "browser",
                "dataKey": "visitors"
            } if insight['chart_type'] == "pie" else {
                "chartConfig": chart_config,
                "data": db_data,
                "xAxisDataKey": "month",
                "dataKeys": ["desktop", "mobile"]
            },
            "projectId": str(insight['project_id'])
        }
    
    insights = list(map(create_dashboard_card_object, insights))

    return JSONResponse(content=insights)

@app.post("/api/insights/update")
async def update_project(
    title: str = Form(...),
    insight_id: str = Form(...),
    project_id: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db)
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(text(f"""
        UPDATE "{user_id}.user_data".insights
        SET title = :title, updated_at = CURRENT_TIMESTAMP 
        WHERE insight_id = :insight_id AND project_id = :project_id AND user_id = :user_id
    """), {'title': title, 'insight_id': insight_id, 'project_id': project_id, 'user_id': user_id})

    await db.commit()

    return JSONResponse(content={"message": "Insight updated successfully"}) 

@app.post("/api/insights/delete")
async def delete_insight(
    insight_id: str = Form(...),
    project_id: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db)
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(text(f"""
        DELETE FROM "{user_id}.user_data".insights
         WHERE insight_id = :insight_id AND project_id = :project_id AND user_id = :user_id
    """), {'insight_id': insight_id, 'project_id': project_id, 'user_id': user_id})

    await db.commit()

    return JSONResponse(content={"message": "Insight deleted successfully"})

@app.get("/health_check")
def health_check():
    print("Health Check Passed, API is up and running LOLLLL!")
    return {"data" : "Health Check Passed, API is up and running!"}
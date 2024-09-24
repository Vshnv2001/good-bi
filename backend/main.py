import os
import uuid
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import FileResponse, JSONResponse
from starlette.middleware.cors import CORSMiddleware
import pandas as pd
from supertokens_python.recipe.session.framework.fastapi import verify_session
from supertokens_python.recipe.session import SessionContainer
from fastapi import Depends
from utils.db_utils import get_db
from models.org_tables import OrgTables
import csv
import io
from sqlalchemy import text
from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe import emailpassword, session
from sqlalchemy.ext.asyncio import AsyncSession
from supertokens_python.framework.fastapi import get_middleware

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

@app.get("/health_check")
def health_check():
    print("Health Check Passed, API is up and running LOLLLL!")
    return {"data" : "Health Check Passed, API is up and running!"}
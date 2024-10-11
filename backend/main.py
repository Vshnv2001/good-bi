import json
import uuid
import asyncpg
from fastapi import FastAPI, File, UploadFile, Form, File, UploadFile, Form
from fastapi.responses import FileResponse, JSONResponse
from starlette.responses import FileResponse, JSONResponse
from starlette.middleware.cors import CORSMiddleware
import pandas as pd
from supertokens_python.recipe.session.framework.fastapi import verify_session
from supertokens_python.recipe.session import SessionContainer
from fastapi import Depends
from goodbi_agent.agent import GoodBIAgent
from utils.db_utils import get_db
from sqlalchemy import text
from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe import emailpassword, session
from sqlalchemy.ext.asyncio import AsyncSession
from supertokens_python.framework.fastapi import get_middleware
from datetime import datetime
from goodbi_agent.MetadataAgent import MetadataAgent
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv
from supertokens_python import get_all_cors_headers
from supertokens_python.recipe.emailpassword.interfaces import (
    APIInterface,
    APIOptions,
    SignUpPostOkResult,
)
from supertokens_python.recipe.emailpassword.types import FormField
from supertokens_python.recipe.emailpassword import InputFormField
from utils.goodbi_utils import get_goodbi_agent
from sqlalchemy.exc import SQLAlchemyError

def override_email_password_apis(original_implementation: APIInterface):
    original_sign_up_post = original_implementation.sign_up_post

    async def sign_up_post(
        form_fields: List[FormField],
        tenant_id: str,
        api_options: APIOptions,
        user_context: Dict[str, Any],
    ):
        # First we call the original implementation of sign_up_post.
        response = await original_sign_up_post(
            form_fields, tenant_id, api_options, user_context
        )

        # Post sign up response, we check if it was successful
        if isinstance(response, SignUpPostOkResult):
            user_id = response.user.user_id
            __ = response.user.email

            name = ""

            for field in form_fields:
                if field.id == "name":
                    name = field.value

            async for db_session in get_db():
                async with db_session as session:
                    await session.execute(
                        text(
                            f"CREATE TABLE IF NOT EXISTS users (user_id UUID PRIMARY KEY, name VARCHAR(255), created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)"
                        )
                    )
                    await session.commit()

                    await session.execute(
                        text(
                            f"""
                        INSERT INTO users
                        (user_id, name)
                        VALUES (:user_id, :name)
                    """
                        ),
                        {"user_id": user_id, "name": name},
                    )

                    await session.commit()

        return response

    original_implementation.sign_up_post = sign_up_post
    return original_implementation


load_dotenv()
print(os.getenv("NEXT_PUBLIC_FRONTEND_URL"))

init(
    app_info=InputAppInfo(
        app_name="goodbi",
        api_domain=os.getenv("NEXT_PUBLIC_API_URL"),
        website_domain=os.getenv("NEXT_PUBLIC_FRONTEND_URL"),
        api_base_path="/api/auth",
        website_base_path="/auth",
    ),
    supertokens_config=SupertokensConfig(
        connection_uri="https://st-dev-d077cc10-75bf-11ef-822f-59b1a0e8c720.aws.supertokens.io",
        api_key="FNvAao5-YkZKaRMPzgOhiVOek8",
    ),
    framework="fastapi",
    recipe_list=[
        session.init(),  # initializes session features
        emailpassword.init(
            sign_up_feature=emailpassword.InputSignUpFeature(
                form_fields=[InputFormField(id="name")]
            ),
            override=emailpassword.InputOverrideConfig(
                apis=override_email_password_apis
            ),
        ),
    ],
    mode="asgi",  # use wsgi if you are running using gunicorn
)

app = FastAPI()
app.add_middleware(get_middleware())

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://good-bi.vercel.app",
    ],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type"] + get_all_cors_headers(),
)


@app.get("/")
def read_root():
    return {"message": "Root Message"}


@app.delete("/api/datasets/{datasetName}")
async def delete_dataset(
    datasetName: str,
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
):
    user_id = auth_session.get_user_id()

    # Delete the file from the database
    await db.execute(text(f'DROP TABLE IF EXISTS "{user_id}"."{datasetName}"'))
    await db.execute(text(f'DELETE FROM "org_tables" WHERE user_id = :user_id AND table_name = :table_name'), {"user_id": user_id, "table_name": datasetName})
    await db.execute(text(f'DELETE FROM "{user_id}"."user_tables_metadata" WHERE table_name = :table_name'), {"user_id": user_id, "table_name": datasetName})
    await db.commit()


@app.get("/api/datasetnames")
async def get_dataset_names(
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
):
    user_id = auth_session.get_user_id()
    result = await db.execute(
        text(
            f"""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = :user_id AND table_type = 'BASE TABLE'
    """
        ),
        {"user_id": user_id},
    )
    tables = result.fetchall()
    tables = [table[0] for table in tables]
    tables.remove("user_tables_metadata")
    return JSONResponse(content={"data": tables})


@app.get("/api/datasets")
async def get_datasets(
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    # Query to get the list of tables for the user
    result = await db.execute(
        text(
            f"""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = :user_id AND table_type = 'BASE TABLE'
    """
        ),
        {"user_id": user_id},
    )
    tables = result.fetchall()
    tables = [table[0] for table in tables]

    datasets = []

    print(f"Tables: {tables}")

    for table_name in tables:
        # Query to get the first three rows from the table
        if table_name == "user_tables_metadata" or table_name == "projects":
            continue
        result = await db.execute(
            text(f'SELECT * FROM "{user_id}"."{table_name}" LIMIT 3')
        )
        rows = result.fetchall()

        # Convert rows to JSON format
        columns = [col for col in result.keys()]
        json_rows = [dict(zip(columns, [str(value) for value in row])) for row in rows]
        description = await db.execute(
            text(f'SELECT gb_description FROM "{user_id}"."{table_name}" LIMIT 1')
        )
        description = description.fetchone()[0]

        datasets.append(
            {
                "datasetName": table_name,
                "datasetDescription": description,
                "datasetJson": json_rows,
            }
        )

    # Return JSON response with dataset information
    return JSONResponse(content={"data": datasets})


@app.post("/api/datasets")
async def create_dataset(
    datasetName: str = Form(...),
    datasetDescription: str = Form(...),
    datasetFile: UploadFile = File(...),
    file_id: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
    agent: GoodBIAgent = Depends(get_goodbi_agent),
):
    print(f"Dataset Name: {datasetName}")
    print(f"Dataset Description: {datasetDescription}")
    
    try:
        agent.set_user_id(auth_session.get_user_id())

        # Read the CSV file
        df = pd.read_csv(datasetFile.file)

        metadata_agent = agent
        metadata = metadata_agent.get_table_metadata(df)
        print(f"Metadata: {metadata}")
        column_types = metadata["column_types"]
        valid_postgres_column_types = [
            "TEXT",
            "INTEGER",
            "BOOLEAN",
            "TIMESTAMP",
            "FLOAT",
            "DOUBLE PRECISION",
            "NUMERIC",
            "GEOGRAPHY",
            "GEOMETRY",
            "JSONB",
            "BIGINT",
        ]
        # If the column type is not in the valid_postgres_column_types, set it to 'TEXT'
        for column, col_type in column_types.items():
            if col_type not in valid_postgres_column_types:
                column_types[column] = "TEXT"
        
        print(f"Column Types: {column_types}")
        for column, col_type in column_types.items():
            if col_type == "INTEGER" or col_type == "BIGINT":
                df[column] = df[column].astype(str)  # Convert all values to strings
                df[column] = df[column].str.replace(',', '')  # Remove commas
                df[column] = pd.to_numeric(df[column], errors='coerce').astype('Int64') 
                df[column] = df[column].fillna(value=pd.NA)
            elif col_type == "FLOAT" or col_type == "DOUBLE PRECISION":
                df[column] = df[column].astype("float64")
            elif col_type == "BOOLEAN":
                df[column] = df[column].astype("bool")
            elif col_type == "TIMESTAMP":
                df[column] = pd.to_datetime(df[column])
            else:
                df[column] = df[column].astype("str")

        print(f"DataFrame: {df.head()}")
        user_id = auth_session.get_user_id()
        await metadata_agent.save_metadata(datasetName, metadata, db, user_id)

        # Create table with columns from CSV and user_id. Format for schema is user_id.datasetName
        columns = ", ".join(
            [f'"{col}" {col_type}' for col, col_type in column_types.items()]
            + [
                "user_id TEXT",
                "file_id TEXT",
                "gb_description TEXT",
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
            ]
        )

        # Create schema if it doesn't exist for storing the table/datas
        await db.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{user_id}";'))
        await db.execute(
            text(f'CREATE TABLE IF NOT EXISTS "{user_id}"."{datasetName}" ({columns})')
        )

        await db.execute(
            text(
                f'CREATE TABLE IF NOT EXISTS "org_tables" (user_id TEXT, table_name TEXT, table_description TEXT)'
            )
        )

        await db.execute(
            text(
                f'INSERT INTO "org_tables" (user_id, table_name, table_description) VALUES (:user_id, :table_name, :table_description)'
            ),
            {
                "user_id": user_id,
                "table_name": datasetName,
                "table_description": datasetDescription,
            },
        )

        print(f"Columns: {columns}")
        # Insert rows into the table
        for row in df.itertuples(index=False, name=None):
            row = list(row)
            row = [None if pd.isna(value) else value for value in row]
            row += [user_id, file_id, datasetDescription]
            placeholders = ", ".join([":{}".format(i) for i in range(len(row))])
            # Use the original data types
            await db.execute(
                text(f'INSERT INTO "{user_id}"."{datasetName}" VALUES ({placeholders})'),
                {str(i): value for i, value in enumerate(row)},
            )

        await db.commit()

        return {"message": "Dataset created successfully"}
    except Exception as e:
        print(f"Error: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/api/projects/new")
async def create_project(
    name: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
):
    print(f"Project Name: {name}")

    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{user_id}.user_data";'))
    await db.execute(
        text(
            f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data".projects (project_id UUID, user_id UUID, name VARCHAR(255), created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'
        )
    )
    await db.commit()

    await db.execute(
        text(
            f"""
        INSERT INTO "{user_id}.user_data".projects
        (project_id, user_id, name)
        VALUES (:project_id, :user_id, :name)
    """
        ),
        {"project_id": str(uuid.uuid4()), "user_id": user_id, "name": name},
    )

    await db.commit()

    return JSONResponse(content={"message": "Project created successfully"})


@app.get("/api/projects")
async def get_projects(
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{user_id}.user_data";'))
    await db.execute(
        text(
            f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data".projects (project_id UUID, user_id UUID, name VARCHAR(255), created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'
        )
    )
    await db.commit()

    result = await db.execute(
        text(
            f"""
        SELECT * 
        FROM "{user_id}.user_data".projects
        WHERE user_id = :user_id
    """
        ),
        {"user_id": user_id},
    )

    projects = result.fetchall()
    projects = [r._asdict() for r in projects]

    def create_project_card_object(project):
        return {
            "id": str(project["project_id"]),
            "name": project["name"],
            "lastUpdated": str(project["updated_at"]),
        }

    projects = list(map(create_project_card_object, projects))

    print(projects)

    return JSONResponse(content=projects)


@app.get("/api/project/{project_id}")
async def get_project(
    project_id: str,
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    result = await db.execute(
        text(
            f"""
        SELECT * 
        FROM "{user_id}.user_data".projects
        WHERE project_id = :project_id AND user_id = :user_id LIMIT 1
    """
        ),
        {"project_id": project_id, "user_id": user_id},
    )

    projects = result.fetchall()

    if len(projects) == 1:
        projects = [r._asdict() for r in projects]

        def create_project_card_object(project):
            return {
                "id": str(project["project_id"]),
                "name": project["name"],
                "lastUpdated": str(project["updated_at"]),
            }

        projects = list(map(create_project_card_object, projects))

        return JSONResponse(content=projects[0])

    return JSONResponse(content={})


@app.post("/api/projects/update")
async def update_project(
    name: str = Form(...),
    project_id: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(
        text(
            f"""
        UPDATE "{user_id}.user_data".projects
        SET name = :name, updated_at = CURRENT_TIMESTAMP 
        WHERE project_id = :project_id AND user_id = :user_id
    """
        ),
        {"name": name, "project_id": project_id, "user_id": user_id},
    )

    await db.commit()

    return JSONResponse(content={"message": "Project updated successfully"})


@app.post("/api/projects/delete")
async def delete_project(
    project_id: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(
        text(
            f"""
        DELETE FROM "{user_id}.user_data".projects
        WHERE project_id = :project_id AND user_id = :user_id
    """
        ),
        {"project_id": project_id, "user_id": user_id},
    )

    await db.commit()

    return JSONResponse(content={"message": "Project deleted successfully"})


@app.post("/api/insights/new")
async def create_insight(
    chart_type: str = Form(...),
    title: str = Form(...),
    kpi_description: str = Form(...),
    project_id: str = Form(...),
    visualization_data: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
):
    print(f"Insight Title: {title}")

    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    insight_id = str(uuid.uuid4())

    await db.execute(
        text(
            f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data".insights (insight_id UUID, user_id UUID, project_id UUID, title VARCHAR(255), kpi_description TEXT, chart_type VARCHAR(255), visualization_data JSONB, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'
        )
    )
    await db.commit()

    await db.execute(
        text(
            f"""
        INSERT INTO "{user_id}.user_data".insights
        (insight_id, user_id, project_id, title, kpi_description, chart_type, visualization_data)
        VALUES (:insight_id, :user_id, :project_id, :title, :kpi_description, :chart_type, :visualization_data)
    """
        ),
        {
            "insight_id": insight_id,
            "user_id": user_id,
            "project_id": project_id,
            "title": title,
            "kpi_description": kpi_description,
            "chart_type": chart_type,
            "visualization_data": visualization_data
        },
    )

    await db.commit()

    await db.execute(
        text(f'CREATE SCHEMA IF NOT EXISTS "{user_id}.user_data.layouts";')
    )
    await db.commit()

    await db.execute(
        text(
            f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data.layouts".sm (insight_id UUID PRIMARY KEY, user_id UUID, project_id UUID, x INT, y INT, w INT, h INT, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'
        )
    )
    await db.execute(
        text(
            f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data.layouts".md (insight_id UUID PRIMARY KEY, user_id UUID, project_id UUID, x INT, y INT, w INT, h INT, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'
        )
    )
    await db.execute(
        text(
            f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data.layouts".lg (insight_id UUID PRIMARY KEY, user_id UUID, project_id UUID, x INT, y INT, w INT, h INT, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'
        )
    )
    await db.commit()

    await db.execute(
        text(
            f"""
        INSERT INTO "{user_id}.user_data.layouts".sm 
        (insight_id, user_id, project_id, x, y, w, h)
        VALUES (:insight_id, :user_id, :project_id, 0, COALESCE((SELECT MAX(y + h) FROM "{user_id}.user_data.layouts".sm WHERE project_id = :project_id), 0), 1, 1)
    """
        ),
        {"insight_id": insight_id, "project_id": project_id, "user_id": user_id},
    )

    await db.execute(
        text(
            f"""
        INSERT INTO "{user_id}.user_data.layouts".md 
        (insight_id, user_id, project_id, x, y, w, h)
        VALUES (:insight_id, :user_id, :project_id, 0, COALESCE((SELECT MAX(y + h) FROM "{user_id}.user_data.layouts".md WHERE project_id = :project_id), 0), 1, 1)
    """
        ),
        {"insight_id": insight_id, "project_id": project_id, "user_id": user_id},
    )

    await db.execute(
        text(
            f"""
        INSERT INTO "{user_id}.user_data.layouts".lg 
        (insight_id, user_id, project_id, x, y, w, h)
        VALUES (:insight_id, :user_id, :project_id, 0, COALESCE((SELECT MAX(y + h) FROM "{user_id}.user_data.layouts".lg WHERE project_id = :project_id), 0), 1, 1)
    """
        ),
        {"insight_id": insight_id, "project_id": project_id, "user_id": user_id},
    )

    await db.commit()

    return JSONResponse(content={"message": "Insight created successfully"})


@app.post("/api/{user_id}/query")
async def user_query(
    query: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
    agent: GoodBIAgent = Depends(get_goodbi_agent),
):
    # Get the user ID
    user_id = auth_session.get_user_id()

    # get metadata
    metadata = await db.execute(
        text(f'SELECT * FROM "{user_id}"."user_tables_metadata"')
    )
    # if not agent.state["sql_valid"]:
    #     return JSONResponse(content=agent.state["sql_issues"])
    agent.core_sql_pipeline(user_id, query, metadata)
    print(agent.state)
    print()
    print(agent.state["sql_query"])

    # Execute the query
    result = await db.execute(text(agent.state["sql_query"]))
    result = result.fetchall()
    result = [r._asdict() for r in result]
    agent.state["results"] = result
    return JSONResponse(content=result)


# Get the suggested KPIs
@app.post("/api/{user_id}/suggest_kpis")
async def suggest_kpis(
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
    query: Optional[str] = Form(None),
    agent: GoodBIAgent = Depends(get_goodbi_agent),
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    metadata = await db.execute(
        text(f'SELECT * FROM "{user_id}"."user_tables_metadata"')
    )

    agent.suggest_kpis(query, metadata, k=5)
    return JSONResponse(content=agent.state["kpi_suggested"])


@app.post("/api/{user_id}/interpret")
async def interpret_results(
    auth_session: SessionContainer = Depends(verify_session()),
    agent: GoodBIAgent = Depends(get_goodbi_agent),
):
    user_id = auth_session.get_user_id()
    if user_id != agent.state["user_id"]:
        print(f"User ID: {user_id}")
        print(f"Agent User ID: {agent.state['user_id']}")
        return JSONResponse(content={"error": "User ID does not match"})
    if agent.state["results"] == "" or agent.state["results"] == []:
        return JSONResponse(content={"error": "Execute a query first"})
    agent.core_interpretation_pipeline()
    if agent.state["error"] != "":
        return JSONResponse(content=agent.state["error"])
    try:
        return JSONResponse(content=agent.state["interpreted_answer"]["answer"])
    except:
        return JSONResponse(content=agent.state["interpreted_answer"])


@app.post("/api/visualize")
async def visualize_query(
    query: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
    agent: GoodBIAgent = Depends(get_goodbi_agent),
):
    print("Visualize Query")
    try:
        user_id = auth_session.get_user_id()
        # Check to ensure same user
        if user_id != agent.state["user_id"] or agent.state["question"] != query:
            agent.state = {
                "question": "",
                "user_id": user_id,
                "parsed_question": {},
                "sql_query": "",
                "sql_valid": False,
                "sql_issues": "",
                "results": [],
                "answer": "",
                "error": "",
                "visualization": "",
                "visualization_reason": "",
                "formatted_data_for_visualization": {},
            }

            metadata = await db.execute(
                text(f'SELECT * FROM "{user_id}"."user_tables_metadata"')
            )
            
            agent.core_sql_pipeline(user_id, query, metadata)

            if not agent.state["sql_valid"] and "corrected_query" not in agent.state:
                print("Error", agent.state["sql_issues"])
                return JSONResponse(
                    status_code=500,
                    content={
                        "error": agent.state["sql_issues"] + ". Please refine your KPI description and try again."
                    }
                )

            try:
                result = await db.execute(text(agent.state["sql_query"]))
            except asyncpg.exceptions.UndefinedTableError as e:
                return JSONResponse(
                    status_code=500,
                    content={
                        "error": "Error in generating SQL Query - Table not found. Please check your KPI description, add more descriptions and try again."
                    }
                )
            except SQLAlchemyError as e:
                error = str(e.__dict__['orig'])
                print("Error", error)
                return JSONResponse(
                    status_code=500,
                    content={
                        "error": "Error in generating SQL Query. Please check your KPI description, add more descriptions and try again."
                    }
                )
            
            result = result.fetchall()
            result = [r._asdict() for r in result]
            
            print("Fetched Result")

            if len(result) == 0:
                print("Empty Result")
                return JSONResponse(
                    status_code=500,
                    content={
                        "error": "Query result is empty. Please check your KPI description and try again."
                    }
                )
            agent.state["results"] = result

        agent.core_visualization_pipeline()

        if agent.state["error"] != "":
            print("Error", agent.state["error"])
            return JSONResponse(
                status_code=500,
                content={
                    "error": agent.state["error"] + ". Please refine your KPI description and try again."
                }
            )

        response = JSONResponse(
            status_code=200,
            content={
                "explanation": agent.state["interpreted_answer"]["answer"],
                "visualization": agent.state["visualization"],
                "visualization_reason": agent.state["visualization_reason"],
                "formatted_data_for_visualization": agent.state[
                    "formatted_data_for_visualization"
                ],
            }
        )
        print("response", response.body)

        return response
    except Exception as e:
        print("Error", e)
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/api/visualize/regenerate")
async def regenerate_visualize_query(
    query: str = Form(...),
    chart_type: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
    agent: GoodBIAgent = Depends(get_goodbi_agent),
):
    user_id = auth_session.get_user_id()
    # Check to ensure same user
    if user_id != agent.state["user_id"] or agent.state["question"] != query:
        agent.state = {
            "question": "",
            "user_id": user_id,
            "parsed_question": {},
            "sql_query": "",
            "sql_valid": False,
            "sql_issues": "",
            "results": [],
            "answer": "",
            "error": "",
            "visualization": "",
            "visualization_reason": "",
            "formatted_data_for_visualization": {},
        }

        metadata = await db.execute(
            text(f'SELECT * FROM "{user_id}"."user_tables_metadata"')
        )
        
        agent.core_sql_pipeline(user_id, query, metadata)

        if not agent.state["sql_valid"] and "corrected_query" not in agent.state:
            return JSONResponse(
                content={
                    "error": agent.state["sql_issues"] + ". Please refine your KPI description and try again."
                }
            )

        result = await db.execute(text(agent.state["sql_query"]))
        result = result.fetchall()
        result = [r._asdict() for r in result]

        if len(result) == 0:
            return JSONResponse(
                content={
                    "error": "Query result is empty. Please check your KPI description and try again."
                }
            )
        agent.state["results"] = result

    agent.core_regeneration_pipeline(chart_type)

    if agent.state["error"] != "":
        return JSONResponse(
            content={
                "error": agent.state["error"] + " Please refine your KPI description and try again."
            }
        )

    return JSONResponse(
        content={
            "explanation": agent.state["interpreted_answer"]["answer"],
            "visualization": agent.state["visualization"],
            "visualization_reason": agent.state["visualization_reason"],
            "formatted_data_for_visualization": agent.state[
                "formatted_data_for_visualization"
            ],
        }
    )

@app.post("/api/insights")
async def get_insights(
    project_id: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(
        text(
            f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data".insights (insight_id UUID, user_id UUID, project_id UUID, dataset_id VARCHAR(255), title VARCHAR(255), kpi_description TEXT, chart_type VARCHAR(255), start_date TIMESTAMPTZ, end_date TIMESTAMPTZ, visualization_data JSONB, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'
        )
    )
    await db.commit()

    result = await db.execute(
        text(
            f"""
        SELECT * 
        FROM "{user_id}.user_data".insights
        WHERE project_id = :project_id AND user_id = :user_id
    """
        ),
        {"project_id": project_id, "user_id": user_id},
    )

    insights = result.fetchall()
    insights = [r._asdict() for r in insights]
    
    def create_dashboard_card_object(insight):
        return {
            "id": str(insight["insight_id"]),
            "key": str(insight["insight_id"]),
            "title": insight["title"],
            "chartType": insight["chart_type"],
            "chartData": insight["visualization_data"],
            "projectId": str(insight["project_id"]),
        }

    insights = list(map(create_dashboard_card_object, insights))

    return JSONResponse(content=insights)


@app.get("/api/insight/{insight_id}")
async def get_insight(
    insight_id: str,
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    result = await db.execute(
        text(
            f"""
        SELECT * 
        FROM "{user_id}.user_data".insights
        WHERE insight_id = :insight_id AND user_id = :user_id LIMIT 1
    """
        ),
        {"insight_id": insight_id, "user_id": user_id},
    )

    insights = result.fetchall()

    if len(insights) == 1:
        insights = [r._asdict() for r in insights]

        def create_dashboard_card_object(insight):
            return {
                "id": str(insight["insight_id"]),
                "key": str(insight["insight_id"]),
                "title": insight["title"],
                "projectId": str(insight["project_id"]),
            }

        insights = list(map(create_dashboard_card_object, insights))

        return JSONResponse(content=insights[0])

    return JSONResponse(content={})


@app.post("/api/insights/update")
async def update_insight(
    title: str = Form(...),
    insight_id: str = Form(...),
    project_id: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(
        text(
            f"""
        UPDATE "{user_id}.user_data".insights
        SET title = :title, updated_at = CURRENT_TIMESTAMP 
        WHERE insight_id = :insight_id AND project_id = :project_id AND user_id = :user_id
    """
        ),
        {
            "title": title,
            "insight_id": insight_id,
            "project_id": project_id,
            "user_id": user_id,
        },
    )

    await db.commit()

    return JSONResponse(content={"message": "Insight updated successfully"})


@app.post("/api/insights/delete")
async def delete_insight(
    insight_id: str = Form(...),
    project_id: str = Form(...),
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(
        text(
            f"""
        DELETE FROM "{user_id}.user_data".insights
        WHERE insight_id = :insight_id AND project_id = :project_id AND user_id = :user_id
    """
        ),
        {"insight_id": insight_id, "project_id": project_id, "user_id": user_id},
    )

    await db.commit()

    await db.execute(
        text(
            f"""
        DELETE FROM "{user_id}.user_data.layouts".sm 
        WHERE insight_id = :insight_id AND project_id = :project_id AND user_id = :user_id
    """
        ),
        {"insight_id": insight_id, "project_id": project_id, "user_id": user_id},
    )

    await db.execute(
        text(
            f"""
        DELETE FROM "{user_id}.user_data.layouts".md 
        WHERE insight_id = :insight_id AND project_id = :project_id AND user_id = :user_id
    """
        ),
        {"insight_id": insight_id, "project_id": project_id, "user_id": user_id},
    )

    await db.execute(
        text(
            f"""
        DELETE FROM "{user_id}.user_data.layouts".lg 
        WHERE insight_id = :insight_id AND project_id = :project_id AND user_id = :user_id
    """
        ),
        {"insight_id": insight_id, "project_id": project_id, "user_id": user_id},
    )

    await db.commit()

    return JSONResponse(content={"message": "Insight deleted successfully"})


class ItemLayout(BaseModel):
    i: str
    w: int
    h: int
    x: int
    y: int
    minH: int
    minW: int


class Layouts(BaseModel):
    lg: List[ItemLayout]
    md: List[ItemLayout]
    sm: List[ItemLayout]


@app.get("/api/layouts/{project_id}")
async def get_insights_layout(
    project_id: str,
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(
        text(f'CREATE SCHEMA IF NOT EXISTS "{user_id}.user_data.layouts";')
    )
    await db.commit()

    await db.execute(
        text(
            f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data.layouts".sm (insight_id UUID PRIMARY KEY, user_id UUID, project_id UUID, x INT, y INT, w INT, h INT, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'
        )
    )
    await db.execute(
        text(
            f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data.layouts".md (insight_id UUID PRIMARY KEY, user_id UUID, project_id UUID, x INT, y INT, w INT, h INT, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'
        )
    )
    await db.execute(
        text(
            f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data.layouts".lg (insight_id UUID PRIMARY KEY, user_id UUID, project_id UUID, x INT, y INT, w INT, h INT, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'
        )
    )
    await db.commit()

    def create_layout_item_object(sm_layout_item):
        return {
            "i": str(sm_layout_item["insight_id"]),
            "x": sm_layout_item["x"],
            "y": sm_layout_item["y"],
            "w": sm_layout_item["w"],
            "h": sm_layout_item["h"],
            "minH": 1,
            "minW": 1,
        }

    result = await db.execute(
        text(
            f"""
        SELECT * 
        FROM "{user_id}.user_data.layouts".sm
        WHERE project_id = :project_id AND user_id = :user_id
    """
        ),
        {"project_id": project_id, "user_id": user_id},
    )

    sm_layout_items = result.fetchall()
    sm_layout_items = [r._asdict() for r in sm_layout_items]

    sm_layout_items = list(map(create_layout_item_object, sm_layout_items))

    result = await db.execute(
        text(
            f"""
        SELECT * 
        FROM "{user_id}.user_data.layouts".md
        WHERE project_id = :project_id AND user_id = :user_id
    """
        ),
        {"project_id": project_id, "user_id": user_id},
    )

    md_layout_items = result.fetchall()
    md_layout_items = [r._asdict() for r in md_layout_items]

    md_layout_items = list(map(create_layout_item_object, md_layout_items))

    result = await db.execute(
        text(
            f"""
        SELECT * 
        FROM "{user_id}.user_data.layouts".lg
        WHERE project_id = :project_id AND user_id = :user_id
    """
        ),
        {"project_id": project_id, "user_id": user_id},
    )

    lg_layout_items = result.fetchall()
    lg_layout_items = [r._asdict() for r in lg_layout_items]

    lg_layout_items = list(map(create_layout_item_object, lg_layout_items))

    return JSONResponse(
        content={"sm": sm_layout_items, "md": md_layout_items, "lg": lg_layout_items}
    )


@app.post("/api/layouts/{project_id}")
async def update_insights_layout(
    project_id: str,
    layouts: Layouts,
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(
        text(f'CREATE SCHEMA IF NOT EXISTS "{user_id}.user_data.layouts";')
    )
    await db.commit()

    await db.execute(
        text(
            f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data.layouts".sm (insight_id UUID PRIMARY KEY, user_id UUID, project_id UUID, x INT, y INT, w INT, h INT, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'
        )
    )
    await db.execute(
        text(
            f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data.layouts".md (insight_id UUID PRIMARY KEY, user_id UUID, project_id UUID, x INT, y INT, w INT, h INT, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'
        )
    )
    await db.execute(
        text(
            f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data.layouts".lg (insight_id UUID PRIMARY KEY, user_id UUID, project_id UUID, x INT, y INT, w INT, h INT, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'
        )
    )
    await db.commit()

    for layout in layouts.sm:
        await db.execute(
            text(
                f"""
            INSERT INTO "{user_id}.user_data.layouts".sm 
            (insight_id, user_id, project_id, x, y, w, h)
            VALUES (:insight_id, :user_id, :project_id, :x, :y, :w, :h)
            ON CONFLICT (insight_id)
            DO UPDATE SET x = :x, y = :y, h = :h, w = :w, updated_at = CURRENT_TIMESTAMP
        """
            ),
            {
                "x": layout.x,
                "y": layout.y,
                "h": layout.h,
                "w": layout.w,
                "insight_id": layout.i,
                "project_id": project_id,
                "user_id": user_id,
            },
        )

    await db.commit()

    for layout in layouts.md:
        await db.execute(
            text(
                f"""
            INSERT INTO "{user_id}.user_data.layouts".md 
            (insight_id, user_id, project_id, x, y, w, h)
            VALUES (:insight_id, :user_id, :project_id, :x, :y, :w, :h)
            ON CONFLICT (insight_id)
            DO UPDATE SET x = :x, y = :y, h = :h, w = :w, updated_at = CURRENT_TIMESTAMP
        """
            ),
            {
                "x": layout.x,
                "y": layout.y,
                "h": layout.h,
                "w": layout.w,
                "insight_id": layout.i,
                "project_id": project_id,
                "user_id": user_id,
            },
        )

    await db.commit()

    for layout in layouts.lg:
        await db.execute(
            text(
                f"""
            INSERT INTO "{user_id}.user_data.layouts".lg 
            (insight_id, user_id, project_id, x, y, w, h)
            VALUES (:insight_id, :user_id, :project_id, :x, :y, :w, :h)
            ON CONFLICT (insight_id)
            DO UPDATE SET x = :x, y = :y, h = :h, w = :w, updated_at = CURRENT_TIMESTAMP
        """
            ),
            {
                "x": layout.x,
                "y": layout.y,
                "h": layout.h,
                "w": layout.w,
                "insight_id": layout.i,
                "project_id": project_id,
                "user_id": user_id,
            },
        )

    await db.commit()

    return JSONResponse(content={"message": "Layout updated successfully"})


@app.post("/api/layouts/{breakpoint}/{project_id}")
async def update_insights_layout(
    breakpoint: str,
    project_id: str,
    layouts: List[ItemLayout],
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    await db.execute(
        text(f'CREATE SCHEMA IF NOT EXISTS "{user_id}.user_data.layouts";')
    )
    await db.commit()

    await db.execute(
        text(
            f'CREATE TABLE IF NOT EXISTS "{user_id}.user_data.layouts".{breakpoint} (insight_id UUID PRIMARY KEY, user_id UUID, project_id UUID, x INT, y INT, w INT, h INT, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)'
        )
    )
    await db.commit()

    for layout in layouts:
        await db.execute(
            text(
                f"""
            INSERT INTO "{user_id}.user_data.layouts".{breakpoint} 
            (insight_id, user_id, project_id, x, y, w, h)
            VALUES (:insight_id, :user_id, :project_id, :x, :y, :w, :h)
            ON CONFLICT (insight_id)
            DO UPDATE SET x = :x, y = :y, h = :h, w = :w, updated_at = CURRENT_TIMESTAMP
        """
            ),
            {
                "x": layout.x,
                "y": layout.y,
                "h": layout.h,
                "w": layout.w,
                "insight_id": layout.i,
                "project_id": project_id,
                "user_id": user_id,
            },
        )

    await db.commit()

    return JSONResponse(content={"message": "Layout updated successfully"})


@app.get("/api/user/data")
async def get_datasets(
    auth_session: SessionContainer = Depends(verify_session()),
    db: AsyncSession = Depends(get_db),
):
    user_id = auth_session.get_user_id()
    print(f"User ID: {user_id}")

    result = await db.execute(
        text(
            f"""
        SELECT * 
        FROM users 
        WHERE user_id = :user_id 
    """
        ),
        {"user_id": user_id},
    )
    user_data_list = result.fetchall()
    user_data_list = [r._asdict() for r in user_data_list]

    user_data = user_data_list[0]

    # Return JSON response with user data
    return JSONResponse(content={"name": user_data["name"]})


@app.get("/health_check")
def health_check():
    print("Health Check Passed, API is up and running LOLLLL!")
    return {"data": "Health Check Passed, API is up and running!"}

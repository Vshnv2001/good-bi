import json
import pandas as pd
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from sqlalchemy.ext.asyncio import AsyncSession
from .LLMManager import LLMManager
from sqlalchemy import inspect, text


class MetadataAgent:
    def __init__(self, llm_manager=None):
        # Initialize LangChain or any other necessary components
        if llm_manager is not None:
            self.llm_manager = llm_manager
        else:
            self.llm_manager = LLMManager()
        self.prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """You are a data analyst that can help summarize SQL tables in a database by extracting metadata. 
        Given a sample of a database table (first 3 rows) in the form of a json string and the column names in a list, you must extract metadata about the table and return it in a JSON format.

        Your response should be in the following JSON format:
        {{
            "table_name": string,
            "column_names": [string],
            "column_descriptors": dict[string, string],
            "column_types": dict[string, string],
            "data_sample": [string]
        }}

        The "noun_columns" field should contain only the columns that are relevant to the question and contain nouns or names, for example, the column "Artist name" contains nouns relevant to the question "What are the top selling artists?", but the column "Artist ID" is not relevant because it does not contain a noun. Do not include numeric columns in the "noun_columns" field.
        """,
                ),
                (
                    "human",
                    "===Database sample:\n{sample}\n\n===User Column Names:\n{column_names}\n\nIdentify table metadata in the format you have been told.",
                ),
            ]
        )

    def get_table_metadata(self, df: pd.DataFrame):
        """
        Takes in a pandas dataframe and returns the first three rows and the column names.
        """
        first_three_rows_list = df.head(3).to_dict(orient="records")
        column_names = df.columns.tolist()

        output_parser = JsonOutputParser()

        response = self.llm_manager.invoke(
            self.prompt, sample=first_three_rows_list, column_names=column_names
        )
        parsed_response = output_parser.parse(response)
        return parsed_response

    async def save_metadata(self, metadata: dict, db: AsyncSession, user_id: str):
        # Create the schema if it doesn't exist
        await db.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{user_id}"'))

        # Create the table if it doesn't exist
        await db.execute(
            text(
                f"""
            CREATE TABLE IF NOT EXISTS "{user_id}".user_tables_metadata (
                id SERIAL PRIMARY KEY,
                table_name TEXT,
                column_names JSONB,
                column_descriptors JSONB,
                column_types JSONB,
                data_sample JSONB
            )
        """
            )
        )
        await db.commit()

        # Check if the table already has an entry for this table_name
        result = await db.execute(
            text(
                f'SELECT table_name FROM "{user_id}".user_tables_metadata WHERE table_name = :table_name'
            ),
            {"table_name": metadata["table_name"]},
        )
        if result.scalar_one_or_none():
            await db.commit()
            return

        # Serialize the JSON data

        serialized_metadata = {
            "table_name": metadata["table_name"],
            "column_names": json.dumps(metadata["column_names"]),
            "column_descriptors": json.dumps(metadata["column_descriptors"]),
            "column_types": json.dumps(metadata["column_types"]),
            "data_sample": json.dumps(metadata["data_sample"]),
        }

        # Insert the metadata into the table
        await db.execute(
            text(
                f"""
                INSERT INTO "{user_id}".user_tables_metadata 
                (table_name, column_names, column_descriptors, column_types, data_sample)
                VALUES (:table_name, :column_names, :column_descriptors, :column_types, :data_sample)
            """
            ),
            serialized_metadata,
        )
        await db.commit()

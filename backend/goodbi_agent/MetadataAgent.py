import pandas as pd
from langchain import LangChain
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from sqlalchemy.ext.asyncio import AsyncSession
from LLMManager import LLMManager
class MetadataAgent:
    def __init__(self):
        # Initialize LangChain or any other necessary components
        self.langchain = LangChain()
        self.llm_manager = LLMManager()
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", '''You are a data analyst that can help summarize SQL tables and parse user questions about a database. 
Given the question and database schema, identify the relevant tables and columns. 
If the question is not relevant to the database or if there is not enough information to answer the question, set is_relevant to false.

Your response should be in the following JSON format:
{{
    "is_relevant": boolean,
    "relevant_tables": [
        {{
            "table_name": string,
            "columns": [string],
            "noun_columns": [string]
        }}
    ]
}}

The "noun_columns" field should contain only the columns that are relevant to the question and contain nouns or names, for example, the column "Artist name" contains nouns relevant to the question "What are the top selling artists?", but the column "Artist ID" is not relevant because it does not contain a noun. Do not include numeric columns in the "noun_columns" field.
'''),
            ("human", "===Database schema:\n{schema}\n\n===User question:\n{question}\n\nIdentify relevant tables and columns:")
        ])

    def get_dataframe_info(self, df: pd.DataFrame):
        """
        Takes in a pandas dataframe and returns the first three rows and the column names.
        """
        first_three_rows = df.head(3)
        column_names = df.columns.tolist()


        output_parser = JsonOutputParser()
        
        response = self.llm_manager.invoke(prompt, schema=schema, question=question)
        parsed_response = output_parser.parse(response)
        return {"parsed_question": parsed_response}

    def generate_table_metadata(self, table_name: str, df_info):
        """
        Takes in table name, and the output of the first function (column names and three rows)
        and uses langchain to output the table metadata.
        """
        first_three_rows, column_names = df_info

        # Example of how you might use LangChain to generate column descriptors
        column_descriptors = {col: self.langchain.describe_column(col, first_three_rows[col]) for col in column_names}
        column_types = {col: self.langchain.infer_column_type(col, first_three_rows[col]) for col in column_names}
        data_sample = first_three_rows.to_dict(orient='records')

        metadata = {
            "table_name": table_name,
            "column_names": column_names,
            "column_descriptors": column_descriptors,
            "column_types": column_types,
            "data_sample": data_sample
        }

        return metadata
    
    def save_metadata(self, metadata: dict, db: AsyncSession):
        # Create the table if it doesn't exist
        table_name = f"{metadata['schema']}.user_tables_metadata"
        if not db.has_table(table_name):
            db.execute(f"""
                CREATE TABLE IF NOT EXISTS {table_name} (
                    id SERIAL PRIMARY KEY,
                    table_name TEXT,
                    column_names JSONB,
                    column_descriptors JSONB,
                    column_types JSONB,
                    data_sample JSONB
                )
            """)
            db.commit()

        # Insert the metadata into the table
        db.execute(f"""
            INSERT INTO {table_name} (table_name, column_names, column_descriptors, column_types, data_sample)
            VALUES (:table_name, :column_names, :column_descriptors, :column_types, :data_sample)
        """, metadata)
        db.commit()

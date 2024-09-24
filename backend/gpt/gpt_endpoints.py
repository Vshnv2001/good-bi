import openai
import langchain
from langchain_openai import ChatOpenAI
from langchain_community.utilities.sql_database import SQLDatabase
from langchain_experimental.sql import SQLDatabaseChain
from langchain_community.chat_models import ChatOpenAI


class GPT:
    def __init__(self, api_key: str, db_uri: str):
        openai.api_key = api_key
        llm = ChatOpenAI(model="gpt-4o")
        db = SQLDatabase.from_uri(db_uri)

    def completion(self, prompt: str, max_tokens=100):
        return "Hello, World!"

    def query_db(self, query: str, schema_name: str, user_id: str):
        return "Hello, World!"

    def explain_column_name(self, column_name: str, schema_name: str, user_id: str):
        return "Hello, World!"


from openai import OpenAI

client = OpenAI()


instructions = """
You are a PostgreSQL expert. Given an input question, first create a syntactically correct PostgreSQL query to run, then look at the results of the query and return the answer to the input question.
Unless the user specifies in the question a specific number of examples to obtain, query for at most 5 results using the LIMIT clause as per PostgreSQL. You can order the results to return the most informative data in the database.
Never query for all columns from a table. You must query only the columns that are needed to answer the question. Wrap each column name in double quotes (") to denote them as delimited identifiers.
Pay attention to use only the column names you can see in the tables below. Be careful to not query for columns that do not exist. Also, pay attention to which column is in which table.
Pay attention to use CURRENT_DATE function to get the current date, if the question involves "today".
Pay attention to use the WHERE clause to filter the results to only the relevant data.
Pay attention to use the ORDER BY clause to order the results in a meaningful way.
Pay attention to use the LIMIT clause to limit the number of results to the most informative ones.
Pay attention to use the GROUP BY clause to group the results by a column.
Pay attention to use the HAVING clause to filter the results after grouping.

Use the following format:

Question: Question here
SQLQuery: SQL Query to run
SQLResult: Result of the SQLQuery
Answer: Final answer here

Only use the following tables:
{table_info}

Question: {input}
"""

# TODO: Write a parser to load the schema from the database
# TODO: load the schema into the instructions
# TODO: Create the functions for the assistant

assistant = client.beta.assistants.create(
    name="SQL Assistant",
    instructions=instructions,
    tools=[
        {
            "type": "funtion",
            "function": {
                "name": "explain_column_header",
                "description": "Given a column name, explain what the column represents.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "column_name": {
                            "type": "object",
                            "description": "The name of the column to explain.",
                        },
                        "table_name": {
                            "type": "object",
                            "description": "The name of the table the column is in.",
                        },
                    },
                },
            },
            "type": "function",
            "function": {
                "name": "explain_table",
                "description": "Given a table name, explain what the table represents.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "table_name": {
                            "type": "object",
                            "description": "The name of the table to explain.",
                        }
                    },
                },
            },
            "type": "function",
            "function": {
                "name": "run_query",
                "description": "Given a query, run the query and return the results.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "object",
                            "description": "The query to run.",
                        }
                    },
                },
            },
        }
    ],
    model="gpt-4o",
)

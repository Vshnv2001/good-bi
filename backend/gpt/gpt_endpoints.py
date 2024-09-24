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

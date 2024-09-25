from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from .LLMManager import LLMManager


class PruningAgent:
    def __init__(self):
        self.llm_manager = LLMManager()
        self.prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """You are a data analyst that can help summarize SQL tables and parse user questions about a database. 
Given the question and database schema, identify the relevant tables and columns. 
If the question is not relevant to the database or if there is not enough information to answer the question, set is_relevant to false.

The "noun_columns" field should contain only the columns that are relevant to the question and contain nouns or names, for example, 
the column "Artist name" contains nouns relevant to the question "What are the top selling artists?", but the column "Artist ID" is not relevant because it 
does not contain a noun. Do not include columns that contain numbers.
    Sample JSON format:
       {{

"is_relevant": boolean,

"relevant_tables": [

		{{
		"table_name": string,
		"columns": [string],
		"noun_columns": [string]
		}}
		
	]
	
}}""",
                ),
                (
                    "human",
                    "===User Query:\n{query}\n\n===User Column Names:\n{column_names}\n\nIdentify the relevant columns in the format you have been told.",
                ),
            ]
        )

    def get_relevant_columns(self, query: str, column_names: list):
        output_parser = JsonOutputParser()
        response = self.llm_manager.invoke(
            self.prompt, query=query, column_names=column_names
        )
        parsed_response = output_parser.parse(response)
        return parsed_response

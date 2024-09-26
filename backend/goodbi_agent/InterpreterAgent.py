from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from .LLMManager import LLMManager


class InterpreterAgent:
    def __init__(self, llm_manager=None):
        if llm_manager is not None:
            self.llm_manager = llm_manager
        else:
            self.llm_manager = LLMManager()
        self.prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """You are a data analyst that can help summarize SQL tables and parse user questions about a database. 
Given the SQL query, relevant columns, question, and query output, explain the output in a human-readable format.
If the query output is not relevant to the question or if there is not enough information to answer the question, set the error field to a relevant error message.

    Sample JSON format:
       {{
"error": string,
"answer": string,

}}""",
                ),
                (
                    "human",
                    """===User question: {question}

===SQL Query: {sql_query}

===Relevant tables and columns:
{relevant_tables}

===Query output:
{query_output}

Explain the output in a human-readable format.""",
                ),
            ]
        )

    def interpret_output(self, state: dict):
        output_parser = JsonOutputParser()
        response = self.llm_manager.invoke(
            self.prompt,
            question=state["question"],
            sql_query=state["sql_query"],
            relevant_tables=state["parsed_question"]["relevant_tables"],
            query_output=state["results"],
        )
        parsed_response = output_parser.parse(response)
        return parsed_response

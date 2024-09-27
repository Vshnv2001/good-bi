from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from .LLMManager import LLMManager


class GraphTypeDeterminerAgent:
    # Agent that determines the appropriate graph type for a given SQL query and question
    def __init__(self, llm_manager=None):
        if llm_manager is not None:
            self.llm_manager = llm_manager
        else:
            self.llm_manager = LLMManager()
        self.prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """You are a data analyst expert in visualizing data. 
Given the question and SQL query, identify the graph type that best represents the data output. 
Give a short explanation of why the graph type is appropriate.
Allowed output graph types are: ["none", "scatter","bar","horizontal_bar", "line", "pie", "scatter"]
    Sample JSON format: 
       {{

"graph_type": string,
"reason": string
	
}}
Make sure to only give one graph type, even if multiple graph types are possible.
Only output an allowed graph type from the list above.
Do not include any additional information in the response.,
""",
                ),
                (
                    "human",
                    """===User Query:\n{question}\n\n===SQL Query:\n{sql_query}
                    Determine the graph type that best represents the data output.""",
                ),
            ]
        )

    def determine_graph_type(self, state: dict):
        output_parser = JsonOutputParser()
        response = self.llm_manager.invoke(
            self.prompt,
            question=state["question"],
            sql_query=state["sql_query"],
        )
        parsed_response = output_parser.parse(response)
        return parsed_response

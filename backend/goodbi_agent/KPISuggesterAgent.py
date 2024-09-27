from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from .LLMManager import LLMManager


class KPISuggesterAgent:
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
                    """You are an expert data analyst tasked with selecting the top {k} key performance indicators (KPIs) from the following dataset. 
The dataset includes both column descriptors and sample data from 3 rows. 
Please analyze the dataset and determine which KPIs are most critical for measuring overall performance. 
If a query is provided, please consider the query's context when selecting the KPIs.
Provide a detailed explanation of your selection criteria, including:
Why each KPI is significant for the dataset's context.
How each selected KPI contributes to actionable insights or decision-making.
Dataset:
{relevant_tables}

Goal: Select the {k} most important KPIs based on the data and provide reasoning for your choices in the JSON format below. 


    Sample JSON format:
       {{
"kpis": [ {{

    "kpi_name": string,
    "kpi_description": string,
    "kpi_formula": string,
    "kpi_significance": string
    }}
]
	
}}""",
                ),
                (
                    "human",
                    "User query (if any): {query}\nSelect the top {k} KPIs from the dataset and provide a detailed explanation for each KPI.",
                ),
            ]
        )

    def suggest_kpis(self, query: str, relevant_tables: dict, k: int = 5):
        # k currently set to 5, but can be adjusted as needed
        output_parser = JsonOutputParser()
        response = self.llm_manager.invoke(
            self.prompt, query=query, relevant_tables=relevant_tables, k=k
        )
        parsed_response = output_parser.parse(response)
        return parsed_response

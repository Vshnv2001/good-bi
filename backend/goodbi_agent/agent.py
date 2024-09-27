from .DataFormatter import DataFormatter
from .LLMManager import LLMManager
from .SQLAgent import SQLAgent
from .MetadataAgent import MetadataAgent
from .PruningAgent import PruningAgent
from .InterpreterAgent import InterpreterAgent
from .GraphTypeDeterminer import GraphTypeDeterminerAgent
from .KPISuggesterAgent import KPISuggesterAgent
from .State import State


class GoodBIAgent:
    # The GoodBIAgent class is the main class that orchestrates the different agents to perform the core functionality of the GoodBI system.
    def __init__(self, max_results: int = 25, user_id: str = None):
        self.llm_manager = LLMManager()
        self.sql_agent = SQLAgent(self.llm_manager, max_results)
        self.metadata_agent = MetadataAgent(self.llm_manager)
        self.pruning_agent = PruningAgent(self.llm_manager)
        self.interpreter_agent = InterpreterAgent(self.llm_manager)
        self.kpi_suggester_agent = KPISuggesterAgent(self.llm_manager)
        self.data_formatter = DataFormatter()
        self.graph_type_agent = GraphTypeDeterminerAgent()
        self.state = State()
        state = {
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
            "kpi_suggested": {},
        }
        self.state = state
        if user_id is not None:
            self.state["user_id"] = user_id
        else:
            self.state["user_id"] = ""

    def make_query(self):
        question = self.state["question"]
        relevant_tables = self.state["parsed_question"]["relevant_tables"]
        schema_name = self.state["user_id"]
        query = self.sql_agent.make_query(question, relevant_tables, schema_name)
        self.state["sql_query"] = query["query"]
        self.state["sql_valid"] = query["valid"]
        self.state["sql_issues"] = query["issues"]

    def get_table_metadata(self, df):
        return self.metadata_agent.get_table_metadata(df)

    def get_relevant_columns(self, query: str, metadata: list):
        self.state["question"] = query
        self.state["parsed_question"] = self.pruning_agent.get_relevant_columns(
            query, metadata
        )

    def save_metadata(self, metadata: dict, db, user_id: str):
        return self.metadata_agent.save_metadata(metadata, db, user_id)

    def format_data_for_visualization(self):
        results = self.data_formatter.format_data_for_visualization(state=self.state)
        if "error" in results:
            self.state["error"] = results["error"]
        else:
            self.state["formatted_data_for_visualization"] = results

    def interpret_results(self):
        graph_type = self.graph_type_agent.determine_graph_type(self.state)
        self.state["visualization"] = graph_type["graph_type"]
        self.state["visualization_reason"] = graph_type["reason"]
        interpreted_output = self.interpreter_agent.interpret_output(state=self.state)
        self.state["interpreted_answer"] = interpreted_output
        self.state["error"] = interpreted_output["error"]

    def core_sql_pipeline(self, user_id: str, query: str, metadata):
        self.state["question"] = query
        self.state["user_id"] = user_id

        metadata = [r._asdict() for r in metadata]

        self.get_relevant_columns(query, metadata)
        self.make_query()

        print(self.state["sql_issues"])
        print(self.state["sql_query"])

    def core_visualization_pipeline(self):
        self.interpret_results()
        self.format_data_for_visualization()

    def core_interpretation_pipeline(self):
        self.interpret_results()

    def suggest_kpis(self, query, table_data, k=5):
        self.state["kpi_suggested"] = self.kpi_suggester_agent.suggest_kpis(
            query, table_data, k
        )
        return self.state["kpi_suggested"]

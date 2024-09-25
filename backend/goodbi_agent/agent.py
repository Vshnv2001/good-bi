from .DataFormatter import DataFormatter
from .LLMManager import LLMManager
from .SQLAgent import SQLAgent
from .MetadataAgent import MetadataAgent
from .PruningAgent import PruningAgent
from .InterpreterAgent import InterpreterAgent
from .State import State


class GoodBIAgent:
    def __init__(self, user_id: str = None):
        self.llm_manager = LLMManager()
        self.sql_agent = SQLAgent(self.llm_manager)
        self.metadata_agent = MetadataAgent(self.llm_manager)
        self.pruning_agent = PruningAgent(self.llm_manager)
        self.interpreter_agent = InterpreterAgent(self.llm_manager)
        self.data_formatter = DataFormatter()
        self.state = State()
        if user_id is not None:
            self.state["user_id"] = user_id

    def make_query(self):
        question = self.state["question"]
        relevant_tables = self.state["parsed_question"]["relevant_tables"]
        schema_name = self.state["user_id"]
        query = self.sql_agent.make_query(question, relevant_tables, schema_name)
        self.state["sql_query"] = query["corrected_query"]
        self.state["sql_valid"] = query["valid"]
        self.state["sql_issues"] = query["issues"]

    def get_table_metadata(self, df):
        return self.metadata_agent.get_table_metadata(df)

    def get_relevant_columns(self, query: str, column_names: list):
        self.state["question"] = query
        self.state["parsed_question"] = self.pruning_agent.get_relevant_columns(
            query, column_names
        )

    def save_metadata(self, metadata: dict, db, user_id: str):
        return self.metadata_agent.save_metadata(metadata, db, user_id)

    def format_data_for_visualization(self):
        return self.data_formatter.format_data_for_visualization(state=self.state)

    def interpret_results(self):
        interpreted_output = self.interpreter_agent.interpret_output(state=self.state)
        self.state["interpreted_answer"] = interpreted_output
        self.state["error"] = interpreted_output["error"]

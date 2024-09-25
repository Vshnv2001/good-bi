import operator
from typing import Any, Dict, List
from typing_extensions import Annotated, TypedDict


class State(TypedDict):
    question: str
    user_id: str
    parsed_question: Dict[str, Any]
    # unique_nouns: List[str]
    sql_query: str
    sql_valid: bool
    sql_issues: str
    results: List[Any]
    interpreted_answer: Annotated[str, operator.add]
    error: str
    visualization: Annotated[str, operator.add]
    visualization_reason: Annotated[str, operator.add]
    formatted_data_for_visualization: Dict[str, Any]

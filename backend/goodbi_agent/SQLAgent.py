from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from .LLMManager import LLMManager


class SQLAgent:
    def __init__(self, llm_manager=None, max_results: int = 25):
        # if llm_manager is not None:
        #     self.llm_manager = llm_manager

        # else:
        self.llm_manager = LLMManager(model="gpt-4o")
        self.max_results = max_results
        self.generation_prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """You are an AI assistant that generates SQL queries based on user questions, database schema, and unique nouns found in the relevant tables. Generate a valid SQL query to answer the user's question.

If there is not enough information to write a SQL query, respond with "NOT_ENOUGH_INFO".
A schema name will be provided as well, which should be used to identify the relevant tables and columns.
Here are some examples:

1. What is the top selling product?
Answer: SELECT product_name, SUM(quantity) as total_quantity FROM sales WHERE product_name IS NOT NULL AND quantity IS NOT NULL AND product_name != "" AND quantity != "" AND product_name != "N/A" AND quantity != "N/A" GROUP BY product_name ORDER BY total_quantity DESC LIMIT 1

2. What is the total revenue for each product?
Answer: SELECT product_name, SUM(quantity * price) as total_revenue FROM sales WHERE product_name IS NOT NULL AND quantity IS NOT NULL AND price IS NOT NULL AND product_name != "" AND quantity != "" AND price != "" AND product_name != "N/A" AND quantity != "N/A" AND price != "N/A" GROUP BY product_name ORDER BY total_revenue DESC

3. What is the market share of each product?
Answer: SELECT product_name, SUM(quantity) * 100.0 / (SELECT SUM(quantity) FROM sales) as market_share FROM sales WHERE product_name IS NOT NULL AND quantity IS NOT NULL AND product_name != "" AND quantity != "" AND product_name != "N/A" AND quantity != "N/A" GROUP BY product_name ORDER BY market_share DESC

4. Plot the distribution of income over time
Answer: SELECT income, COUNT(*) as count FROM users WHERE income IS NOT NULL AND income != "" AND income != "N/A" GROUP BY income

THE RESULTS SHOULD ONLY BE IN THE FOLLOWING FORMAT, SO MAKE SURE TO ONLY GIVE TWO OR THREE COLUMNS:
[[x, y]]
or 
[[label, x, y]]
             
For questions like "plot a distribution of the fares for men and women", count the frequency of each fare and plot it. The x axis should be the fare and the y axis should be the count of people who paid that fare.
SKIP ALL ROWS WHERE ANY COLUMN IS NULL or "N/A" or "".
Ensure that the conditions in the WHERE clause are valid with respect to the column types.
Just give the query string. Do not format it. Make sure to use the correct spellings of nouns as provided in the unique nouns list.
Limit the number of results to {max_results}.
""",
                ),
                (
                    "human",
                    """===User question: {question}

===Schema name: {schema_name}

===Relevant tables and columns:
{relevant_tables}

Generate an accurate SQL query to answer the user's question.""",
                ),
            ]
        )

        self.validation_prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """You are an AI assistant that validates and fixes SQL queries. Your task is to:
Check if the SQL query is valid.
Single quotes not double quotes around empty strings, double quotes make delimited identifiers, and "" isn't a meaningful identifier.
For numeric types, do not check for empty strings or "N/A".
Ensure all table and column names are correctly spelled and exist in the schema.
Ensure that the conditions in the WHERE clause are valid with respect to the column types.
If there are any issues, fix them and provide the corrected SQL query.
If no issues are found, return the original query.

Respond in JSON format with the following structure. Only respond with the JSON:
{{
    "valid": boolean,
    "issues": string or null,
    "corrected_query": string
}}
'''),
            ("human", '''===Generated SQL query:
{sql_query}

Respond in JSON format with the following structure. Only respond with the JSON:
{{
    "valid": boolean,
    "issues": string or null,
    "corrected_query": string
}}

For example:
1. {{
    "valid": true,
    "issues": null,
    "corrected_query": "None"
}}
             
2. {{
    "valid": false,
    "issues": "Column USERS does not exist",
    "corrected_query": "SELECT * FROM users WHERE age > 25"
}}
""",
                ),
                (
                    "human",
                    """
===User question:

{question}

===Relevant tables and columns:

{relevant_tables}

===SQL query:
{sql_query}

Validate the SQL query and provide the corrected query if necessary.""",
                ),
            ]
        )

    def _generate_sql_query(
        self, question: str, relevant_tables: list, schema_name: str = ""
    ):
        response = self.llm_manager.invoke(
            self.generation_prompt,
            question=question,
            schema_name=schema_name,
            relevant_tables=relevant_tables,
            max_results=self.max_results,
        )
        if response == "NOT_ENOUGH_INFO":
            # Return response as a JSON object
            return {"valid": False, "issues": "Not enough information", "query": ""}
        return {"valid": True, "issues": None, "query": response}

    def _validate_sql_query(self, question: str, relevant_tables: list, sql_query: str):
        output_parser = JsonOutputParser()
        response = self.llm_manager.invoke(
            self.validation_prompt,
            question=question,
            relevant_tables=relevant_tables,
            sql_query=sql_query,
        )
        parsed_response = output_parser.parse(response)
        return parsed_response

    def make_query(self, question: str, relevant_tables: list, schema_name: str = ""):
        query = self._generate_sql_query(question, relevant_tables, schema_name)
        if query["valid"]:
            validated_query = self._validate_sql_query(
                question, relevant_tables, query["query"]
            )
            validated_query["query"] = validated_query["corrected_query"].replace(
                "`", '"'
            )
            return validated_query
        else:
            # Query is not valid
            return query

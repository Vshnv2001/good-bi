import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
import dotenv

dotenv.load_dotenv()


class LLMManager:
    def __init__(self, model="gpt-4o-mini"):
        api_key = os.getenv("OPENAI_API_KEY")
        self.llm = ChatOpenAI(model=model, temperature=0, api_key=api_key)

    def invoke(self, prompt: ChatPromptTemplate, **kwargs) -> str:
        messages = prompt.format_messages(**kwargs)
        response = self.llm.invoke(messages)
        return response.content

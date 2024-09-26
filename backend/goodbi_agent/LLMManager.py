import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
import dotenv
from langchain_anthropic import ChatAnthropic

dotenv.load_dotenv()


class LLMManager:
    def __init__(self, model="gpt-4o"):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        gpt_api_key = os.getenv("OPENAI_API_KEY")
        self.llm = ChatOpenAI(model=model, temperature=0, api_key=gpt_api_key)
        #self.llm = ChatAnthropic( model="claude-3-5-sonnet-20240620", temperature=0,)

    def invoke(self, prompt: ChatPromptTemplate, **kwargs) -> str:
        messages = prompt.format_messages(**kwargs)
        print('Prompt', messages)
        response = self.llm.invoke(messages)
        return response.content

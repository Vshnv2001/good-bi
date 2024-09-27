from goodbi_agent.agent import GoodBIAgent


def get_goodbi_agent(user_id: str):
    return GoodBIAgent(user_id)

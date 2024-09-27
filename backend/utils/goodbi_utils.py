from goodbi_agent.agent import GoodbiAgent


def get_goodbi_agent(user_id: str):
    return GoodbiAgent(user_id)

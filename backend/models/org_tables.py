import uuid
from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID

Base = declarative_base()

class OrgTables(Base):
    __tablename__ = 'org_tables'

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    user_id = Column(String, nullable=False)
    table_name = Column(String, nullable=False)
    table_description = Column(String, nullable=True)

    def __init__(self, user_id, table_name, table_description=None):
        self.user_id = user_id
        self.table_name = table_name
        self.table_description = table_description

import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from contextlib import asynccontextmanager

# Load the POSTGRES_URI from environment variables
POSTGRES_URI = os.getenv('POSTGRES_URI')

# Ensure the URI uses the asyncpg driver
if POSTGRES_URI and POSTGRES_URI.startswith("postgresql://"):
    POSTGRES_URI = POSTGRES_URI.replace("postgresql://", "postgresql+asyncpg://")

# Create the async engine
engine = create_async_engine(POSTGRES_URI, echo=True)

# Create the session factory
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
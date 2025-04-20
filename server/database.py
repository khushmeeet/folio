import os

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

load_dotenv()

# Get the full connection URL
db_url = os.getenv("DATABASE_URL")

# Remove the sslmode parameter from the URL as it's not directly supported by asyncpg
# We'll handle SSL in the connect_args instead
if db_url and "?sslmode=require" in db_url:
    db_url = db_url.replace("?sslmode=require", "")

# Create engine with SSL settings for Neon Postgres
engine = create_async_engine(
    db_url,
    echo=False,
    future=True,
    pool_pre_ping=True,
    connect_args={
        "ssl": True
    }
)

SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

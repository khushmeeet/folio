from database import Base
from sqlalchemy import Boolean, Column, DateTime, Integer, String, func
from sqlalchemy.sql import expression


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    title = Column(String, nullable=True)
    description = Column(String, nullable=True)
    archived = Column(Boolean, server_default=expression.false(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
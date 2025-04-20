from datetime import datetime
from typing import Optional

from pydantic import BaseModel, HttpUrl


class BookmarkBase(BaseModel):
    url: HttpUrl
    title: Optional[str] = None
    description: Optional[str] = None


class BookmarkCreate(BaseModel):
    url: HttpUrl


class BookmarkResponse(BookmarkBase):
    id: int
    archived: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
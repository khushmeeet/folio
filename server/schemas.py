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


class PocketLinkResponse(BaseModel):
    id: int
    title: Optional[str] = None
    url: str
    time_added: int
    tags: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
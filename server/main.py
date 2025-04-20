from typing import List

import models
import schemas
from database import SessionLocal, engine
from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

app = FastAPI(title="Bookmarking Service")


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)


async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        await db.close()


@app.on_event("startup")
async def startup_event():
    await init_db()


@app.post("/bookmarks/", response_model=schemas.BookmarkResponse, status_code=status.HTTP_201_CREATED)
async def create_bookmark(bookmark: schemas.BookmarkCreate, db: AsyncSession = Depends(get_db)):
    """Add a URL for read-it-later"""
    db_bookmark = models.Bookmark(
        url=str(bookmark.url),
        title=bookmark.title,
        description=bookmark.description
    )
    db.add(db_bookmark)
    await db.commit()
    await db.refresh(db_bookmark)
    return db_bookmark


@app.get("/bookmarks/", response_model=List[schemas.BookmarkResponse])
async def list_bookmarks(archived: bool = False, db: AsyncSession = Depends(get_db)):
    """List all URLs for read-it-later"""
    query = select(models.Bookmark).where(models.Bookmark.archived == archived)
    result = await db.execute(query)
    bookmarks = result.scalars().all()
    return bookmarks


@app.patch("/bookmarks/{bookmark_id}/archive", response_model=schemas.BookmarkResponse)
async def archive_bookmark(bookmark_id: int, db: AsyncSession = Depends(get_db)):
    """Archive a URL that has been read"""
    query = select(models.Bookmark).where(models.Bookmark.id == bookmark_id)
    result = await db.execute(query)
    bookmark = result.scalar_one_or_none()

    if not bookmark:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bookmark with ID {bookmark_id} not found"
        )

    bookmark.archived = True
    await db.commit()
    await db.refresh(bookmark)
    return bookmark

from typing import List

import httpx
import models
import schemas
from bs4 import BeautifulSoup
from database import SessionLocal, engine
from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

app = FastAPI(title="Bookmarking Service")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def fetch_url_metadata(url: str):
    """Fetch title and description from a URL"""
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, 'html.parser')

            title = None
            title_tag = soup.find('title')
            if title_tag and title_tag.string:
                title = title_tag.string.strip()

            description = None
            meta_desc = soup.find('meta', attrs={'name': 'description'}) or \
                       soup.find('meta', attrs={'property': 'og:description'})
            if meta_desc and meta_desc.get('content'):
                description = meta_desc['content'].strip()

            return title, description
    except Exception as e:
        print(f"Error fetching metadata for {url}: {str(e)}")
        return None, None


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
    url_str = str(bookmark.url)

    # Check if URL already exists in the database
    query = select(models.Bookmark).where(models.Bookmark.url == url_str)
    result = await db.execute(query)
    existing_bookmark = result.scalar_one_or_none()

    if existing_bookmark:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"URL already exists with bookmark ID {existing_bookmark.id}"
        )

    title, description = await fetch_url_metadata(url_str)

    if description is None:
        description = "No description available"

    db_bookmark = models.Bookmark(
        url=url_str,
        title=title,
        description=description
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


@app.get("/pocket-links/", response_model=List[schemas.PocketLinkResponse])
async def list_pocket_links(
    status_filter: str = Query("unread", description="Filter by status: unread, archive, or all"), 
    db: AsyncSession = Depends(get_db)
):
    """List Pocket links with optional status filter"""
    query = select(models.PocketLink)
    
    if status_filter != "all":
        query = query.where(models.PocketLink.status == status_filter)
    
    # Order by time_added descending (newest first)
    query = query.order_by(models.PocketLink.time_added.desc())
    
    result = await db.execute(query)
    pocket_links = result.scalars().all()
    return pocket_links

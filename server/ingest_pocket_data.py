#!/usr/bin/env python3
"""
Script to ingest Pocket reading list CSV data into the database.
Usage: python ingest_pocket_data.py part_000000.csv
"""

import asyncio
import csv
import sys
from datetime import datetime
from typing import Optional

from database import SessionLocal, engine
from models import Base, PocketLink


async def create_tables():
    """Create all tables if they don't exist"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def ingest_csv_data(csv_file_path: str):
    """Ingest Pocket CSV data into the database"""
    
    async with SessionLocal() as db:
        try:
            records_processed = 0
            records_skipped = 0
            
            with open(csv_file_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                
                for row in reader:
                    # Parse CSV row
                    title = row.get('title', '').strip() or None
                    url = row.get('url', '').strip()
                    time_added_str = row.get('time_added', '').strip()
                    tags = row.get('tags', '').strip() or None
                    status = row.get('status', '').strip()
                    
                    # Skip if URL is missing
                    if not url:
                        records_skipped += 1
                        continue
                    
                    # Parse time_added as integer (Unix timestamp)
                    try:
                        time_added = int(time_added_str)
                    except (ValueError, TypeError):
                        print(f"Warning: Invalid time_added '{time_added_str}' for URL {url}, skipping...")
                        records_skipped += 1
                        continue
                    
                    # Check if URL already exists
                    from sqlalchemy.future import select
                    query = select(PocketLink).where(PocketLink.url == url)
                    result = await db.execute(query)
                    existing_link = result.scalar_one_or_none()
                    
                    if existing_link:
                        print(f"URL already exists: {url}")
                        records_skipped += 1
                        continue
                    
                    # Create new PocketLink record
                    pocket_link = PocketLink(
                        title=title,
                        url=url,
                        time_added=time_added,
                        tags=tags,
                        status=status
                    )
                    
                    db.add(pocket_link)
                    records_processed += 1
                    
                    # Commit in batches of 100
                    if records_processed % 100 == 0:
                        await db.commit()
                        print(f"Processed {records_processed} records...")
            
            # Final commit
            await db.commit()
            
            print(f"\nIngestion complete!")
            print(f"Records processed: {records_processed}")
            print(f"Records skipped: {records_skipped}")
            
        except Exception as e:
            await db.rollback()
            print(f"Error during ingestion: {e}")
            raise


async def main():
    if len(sys.argv) != 2:
        print("Usage: python ingest_pocket_data.py <csv_file_path>")
        sys.exit(1)
    
    csv_file_path = sys.argv[1]
    
    print(f"Starting Pocket data ingestion from: {csv_file_path}")
    
    # Create tables if they don't exist
    await create_tables()
    print("Database tables ready.")
    
    # Ingest data
    await ingest_csv_data(csv_file_path)


if __name__ == "__main__":
    asyncio.run(main())

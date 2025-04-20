// Service for handling bookmark API calls

import type { Bookmark } from '../types';

export async function fetchBookmarks(showArchived: boolean): Promise<Bookmark[]> {
  const response = await fetch(`/bookmarks/?archived=${showArchived}`);
  
  if (!response.ok) {
    throw new Error(`Error fetching bookmarks: ${response.statusText}`);
  }
  
  return await response.json();
}

export async function archiveBookmark(id: number): Promise<void> {
  const response = await fetch(`/bookmarks/${id}/archive`, {
    method: 'PATCH',
  });
  
  if (!response.ok) {
    throw new Error(`Error archiving bookmark: ${response.statusText}`);
  }
}
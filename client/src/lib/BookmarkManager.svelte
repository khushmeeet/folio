<script lang="ts">
  import { onMount } from 'svelte';
  import type { Bookmark } from '../types';
  import { fetchBookmarks, archiveBookmark } from './BookmarkService';
  import BookmarkTable from './BookmarkTable.svelte';
  import BookmarkStatus from './BookmarkStatus.svelte';
  import AddBookmark from './AddBookmark.svelte';

  let bookmarks: Bookmark[] = [];
  let loading = true;
  let error: string | null = null;
  let showArchived = false;

  async function loadBookmarks() {
    loading = true;
    error = null;
    
    try {
      bookmarks = await fetchBookmarks(showArchived);
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
      error = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading = false;
    }
  }

  async function handleArchive(id: number) {
    try {
      await archiveBookmark(id);
      // Refresh the bookmark list
      await loadBookmarks();
    } catch (err) {
      console.error('Failed to archive bookmark:', err);
      error = err instanceof Error ? err.message : 'Unknown error';
    }
  }

  function toggleArchived() {
    showArchived = !showArchived;
    loadBookmarks();
  }

  // Listen for the toggle event from the header
  function setupToggleListener() {
    window.addEventListener('toggle-archived', () => {
      toggleArchived();
    });

    return () => {
      // Cleanup listener on component destruction
      window.removeEventListener('toggle-archived', toggleArchived);
    };
  }

  onMount(() => {
    const cleanup = setupToggleListener();
    loadBookmarks();
    
    return cleanup;
  });

  function handleBookmarkAdded() {
    loadBookmarks();
  }
</script>

<div class="w-full p-4">
  {#if !showArchived}
    <AddBookmark on:bookmarkAdded={handleBookmarkAdded} />
  {/if}

  <BookmarkStatus 
    {loading} 
    {error} 
    isEmpty={!loading && !error && bookmarks.length === 0} 
    {showArchived} 
  />

  {#if !loading && !error && bookmarks.length > 0}
    <BookmarkTable 
      {bookmarks} 
      onArchive={handleArchive} 
      {showArchived} 
    />
  {/if}
</div>
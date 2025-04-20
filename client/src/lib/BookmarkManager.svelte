<script lang="ts">
  import { onMount } from 'svelte';
  import type { Bookmark } from '../types';
  import { fetchBookmarks, archiveBookmark } from './BookmarkService';
  import BookmarkTable from './BookmarkTable.svelte';
  import BookmarkStatus from './BookmarkStatus.svelte';

  export let showArchived = false;
  
  let bookmarks: Bookmark[] = [];
  let loading = true;
  let error: string | null = null;

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

  // Listen for the toggle event from the header
  function setupEventListeners() {
    window.addEventListener('toggle-archived', () => {
      loadBookmarks();
    });
    
    window.addEventListener('bookmark-added', () => {
      loadBookmarks();
    });

    return () => {
      // Cleanup listeners on component destruction
      window.removeEventListener('toggle-archived', loadBookmarks);
      window.removeEventListener('bookmark-added', loadBookmarks);
    };
  }

  onMount(() => {
    const cleanup = setupEventListeners();
    loadBookmarks();
    
    return cleanup;
  });
</script>

<div class="w-full">
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
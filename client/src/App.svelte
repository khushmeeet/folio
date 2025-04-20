<script lang="ts">
  import BookmarkManager from './lib/BookmarkManager.svelte'
  import AddBookmark from './lib/AddBookmark.svelte'
  import { onMount } from 'svelte';
  
  let showArchived = false;
  
  function toggleArchived() {
    showArchived = !showArchived;
    window.dispatchEvent(new CustomEvent('toggle-archived'));
  }
  
  function handleBookmarkAdded() {
    window.dispatchEvent(new CustomEvent('bookmark-added'));
  }
</script>

<main class="min-h-screen bg-neutral-900 text-neutral-200 py-4 px-4 font-mono">
  <div class="max-w-6xl mx-auto">
    <header class="mb-4 pb-3 border-b border-neutral-700 flex justify-between items-center">
      <div class="flex items-center">
        <div class="text-neutral-200 text-lg font-semibold">FOLIO</div>
        <div class="text-neutral-500 text-sm ml-4">bookmark manager</div>
      </div>
      
      <div class="flex items-center space-x-3">
        {#if !showArchived}
          <AddBookmark on:bookmarkAdded={handleBookmarkAdded} headerMode={true} />
        {/if}
        <button 
          class="dev-button"
          on:click={toggleArchived}>
          {showArchived ? 'Active Links' : 'Archived Links'}
        </button>
      </div>
    </header>

    <div class="dev-container mb-4">
      <BookmarkManager {showArchived} />
    </div>
  </div>
</main>
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
  export let headerMode = false; // New prop to handle header positioning
  
  let url = '';
  let isSubmitting = false;
  let error: string | null = null;
  let showForm = false;

  async function handleSubmit() {
    if (!url) {
      error = 'Please enter a URL';
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    isSubmitting = true;
    error = null;

    try {
      const response = await fetch('/bookmarks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`Error adding bookmark: ${response.statusText}`);
      }

      // Reset form
      url = '';
      showForm = false;
      
      // Notify parent component to refresh bookmarks
      dispatch('bookmarkAdded');
    } catch (err) {
      console.error('Failed to add bookmark:', err);
      error = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      isSubmitting = false;
    }
  }

  function toggleForm() {
    showForm = !showForm;
    if (!showForm) {
      url = '';
      error = null;
    }
  }
</script>

<div class="relative">
  <button 
    class="dev-button {!headerMode && !showForm ? 'dev-button-primary' : ''}"
    on:click={toggleForm}
  >
    {showForm ? 'Cancel' : 'Add Bookmark'}
  </button>

  {#if showForm}
    <div class="{headerMode ? 'absolute right-0 top-10 z-10 w-80' : 'mt-3'} p-3 bg-neutral-800 border border-neutral-700 rounded shadow-lg">
      <form on:submit|preventDefault={handleSubmit}>
        <div class="flex items-center gap-2">
          <input
            type="text"
            placeholder="https://example.com"
            bind:value={url}
            disabled={isSubmitting}
            class="dev-input flex-1"
          />
          <button 
            type="submit" 
            disabled={isSubmitting || !url}
            class="dev-button {url ? 'dev-button-primary' : ''} disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </div>
        {#if error}
          <div class="mt-2 text-sm text-red-400">{error}</div>
        {/if}
      </form>
    </div>
  {/if}
</div>
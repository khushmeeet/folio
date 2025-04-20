<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
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

<div class="mb-4">
  <button 
    class="bg-blue-500 text-white py-2 px-4 rounded font-medium text-sm hover:bg-blue-600 transition-colors"
    on:click={toggleForm}
  >
    {showForm ? 'Cancel' : '+ Add Bookmark'}
  </button>

  {#if showForm}
    <div class="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
      <form on:submit|preventDefault={handleSubmit}>
        <div class="flex gap-2">
          <input
            type="text"
            placeholder="Enter URL"
            bind:value={url}
            disabled={isSubmitting}
            class="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <button 
            type="submit" 
            disabled={isSubmitting || !url}
            class="bg-green-500 text-white py-2 px-4 rounded text-sm disabled:opacity-70 disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </div>
        {#if error}
          <div class="text-red-600 text-sm mt-2">{error}</div>
        {/if}
      </form>
    </div>
  {/if}
</div>
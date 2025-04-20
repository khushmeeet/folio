<script lang="ts">
  export let loading: boolean = false;
  export let error: string | null = null;
  export let isEmpty: boolean = false;
  export let showArchived: boolean = false;
</script>

{#if loading}
  <div class="dev-section py-4 text-center">
    <div class="flex items-center justify-center">
      <svg class="animate-spin h-4 w-4 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="text-neutral-400">Loading bookmarks...</span>
    </div>
  </div>
{:else if error}
  <div class="dev-section py-3 bg-neutral-800 border-l-2 border-red-700">
    <div class="text-red-400">
      <div class="font-medium mb-1">Error</div>
      <div class="text-sm bg-neutral-850 p-2 rounded border border-neutral-700">{error}</div>
    </div>
  </div>
{:else if isEmpty}
  <div class="dev-section py-4 text-center">
    <div class="text-neutral-400">
      No {showArchived ? 'archived' : 'active'} bookmarks found.
    </div>
  </div>
{/if}
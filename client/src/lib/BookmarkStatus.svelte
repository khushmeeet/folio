<script lang="ts">
  export let loading: boolean = false;
  export let error: string | null = null;
  export let isEmpty: boolean = false;
  export let showArchived: boolean = false;
</script>

{#if loading}
  <div class="p-6 rounded text-center my-8 mx-auto bg-gray-100 text-gray-500">
    Loading bookmarks...
  </div>
{:else if error}
  <div class="p-6 rounded text-center my-8 mx-auto bg-red-100 text-red-900">
    Error: {error}
  </div>
{:else if isEmpty}
  <div class="p-6 rounded text-center my-8 mx-auto bg-gray-100 text-gray-500">
    No {showArchived ? 'archived' : 'unread'} bookmarks found.
  </div>
{/if}
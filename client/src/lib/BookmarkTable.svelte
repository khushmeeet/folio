<script lang="ts">
  import type { Bookmark } from '../types';

  export let bookmarks: Bookmark[] = [];
  export let onArchive: (id: number) => void;
  export let showArchived: boolean = false;
</script>

<div class="w-full">
  <div class="dev-header">
    <span>{showArchived ? 'Archived' : 'Active'} Bookmarks</span>
    <span class="ml-auto text-neutral-500">{bookmarks.length} items</span>
  </div>

  <div class="overflow-x-auto">
    <table class="dev-table w-full">
      <colgroup>
        <col class="w-[10%]">
        <col class="w-[45%]">
        <col class="w-[45%]">
        {#if !showArchived}
          <col class="w-[10%]">
        {/if}
      </colgroup>
      <thead>
        <tr>
          <th class="text-left">ID</th>
          <th class="text-left">Title</th>
          <th class="text-left">Description</th>
          {#if !showArchived}
            <th class="text-right">Action</th>
          {/if}
        </tr>
      </thead>
      <tbody>
        {#each bookmarks as bookmark, index}
          <tr>
            <td class="text-neutral-500">{index + 1}</td>
            <td>
              <a 
                href={bookmark.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                class="text-blue-400 hover:text-blue-300 hover:underline flex items-center"
              >
                <span class="status-active"></span>
                {bookmark.title || 'Untitled'}
              </a>
              <div class="text-xs text-neutral-500 mt-1 truncate">
                {bookmark.url}
              </div>
            </td>
            <td class="text-neutral-300">
              {#if bookmark.description}
                {bookmark.description}
              {:else}
                <span class="text-neutral-500 italic">No description</span>
              {/if}
            </td>
            {#if !showArchived}
              <td class="text-right">
                <button 
                  class="dev-button text-xs py-1 px-2"
                  on:click={() => onArchive(bookmark.id)}
                >
                  Archive
                </button>
              </td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
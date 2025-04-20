<script lang="ts">
  import type { Bookmark } from '../types';

  export let bookmarks: Bookmark[] = [];
  export let onArchive: (id: number) => void;
  export let showArchived: boolean = false;
</script>

<!-- Shadcn UI styled table with developer-centric customizations -->
<div class="w-full">
  <div class="rounded-md border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 overflow-hidden">
    <div class="font-['IBM_Plex_Mono'] font-medium py-3 px-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
      <!-- Table header with terminal-like prefix -->
      <span class="text-emerald-500 mr-2">$</span>
      <span>bookmarks:/{showArchived ? 'archived' : 'unread'}</span>
    </div>

    <div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead class="font-['IBM_Plex_Sans'] text-xs uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" class="px-4 py-3 text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
              <div class="flex items-center">
                <span class="text-gray-400 mr-2">#</span>Number
              </div>
            </th>
            <th scope="col" class="px-4 py-3 text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
              <div class="flex items-center">
                <span class="text-gray-400 mr-2">@</span>Article
              </div>
            </th>
            <th scope="col" class="px-4 py-3 text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
              <div class="flex items-center">
                <span class="text-gray-400 mr-2">~</span>Description
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="font-['IBM_Plex_Sans']">
          {#each bookmarks as bookmark, index}
            <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300 w-20 font-['IBM_Plex_Mono'] font-medium">
                {index + 1}
              </td>
              <td class="px-4 py-3 w-1/3">
                <a 
                  href={bookmark.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="text-blue-600 dark:text-blue-400 font-medium hover:underline hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                >
                  <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  {bookmark.title || 'Untitled Article'}
                </a>
              </td>
              <td class="px-4 py-3 relative">
                <div class="mr-24 text-gray-600 dark:text-gray-400">
                  {#if bookmark.description}
                    {bookmark.description}
                  {:else}
                    <span class="font-['IBM_Plex_Mono'] text-gray-400 dark:text-gray-500 italic">/* No description */</span>
                  {/if}
                </div>
                {#if !showArchived}
                  <button 
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-md text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    on:click={() => onArchive(bookmark.id)}
                  >
                    <span class="font-['IBM_Plex_Mono']">archive()</span>
                  </button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Terminal-like footer -->
    <div class="font-['IBM_Plex_Mono'] py-2 px-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <span class="text-emerald-500">></span>
      <span>{bookmarks.length} item{bookmarks.length !== 1 ? 's' : ''} found</span>
    </div>
  </div>
</div>
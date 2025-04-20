<script lang="ts">
    import BookmarkManager from "./lib/BookmarkManager.svelte";
</script>

<main class="max-w-7xl mx-auto p-4 font-['IBM_Plex_Sans'] text-gray-800 bg-white">
    <header class="mb-6 pb-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-800">FOLIO</h1>
            <div class="flex items-center">
                <button
                    class="bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded text-sm font-medium cursor-pointer transition-all hover:bg-gray-200 hover:border-gray-400"
                    on:click={() => window.dispatchEvent(new CustomEvent("toggle-archived"))}
                >
                    Archived Links
                </button>
            </div>
        </div>
    </header>

    <div class="bg-white rounded border border-gray-200 shadow-sm">
        <BookmarkManager />
    </div>
</main>

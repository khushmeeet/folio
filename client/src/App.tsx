import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import BookmarkTable, { Bookmark } from "./components/BookmarkTable";
import AddBookmarkModal from "./components/AddBookmarkModal";
import { fetchBookmarks, createBookmark, archiveBookmark } from "./api/bookmarkService";

function App() {
    // State for bookmarks, modal visibility, and archive filter
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filter bookmarks based on archived status
    const filteredBookmarks = bookmarks.filter((bookmark) => bookmark.archived === showArchived);

    // Fetch bookmarks when component mounts or when archived filter changes
    useEffect(() => {
        const loadBookmarks = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchBookmarks(showArchived);
                setBookmarks(data);
            } catch (err) {
                setError("Failed to load bookmarks. Please try again later.");
                console.error("Error loading bookmarks:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadBookmarks();
    }, [showArchived]);

    // Handle adding a new bookmark
    const handleAddBookmark = async (newBookmark: Omit<Bookmark, "id">) => {
        setIsLoading(true);
        setError(null);
        try {
            const createdBookmark = await createBookmark(newBookmark.url);
            // Only add to state if we're viewing the correct list (non-archived)
            if (!showArchived) {
                setBookmarks((prev) => [...prev, createdBookmark]);
            }
        } catch (err) {
            setError("Failed to add bookmark. Please try again.");
            console.error("Error adding bookmark:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle toggling archive status
    const handleArchiveToggle = async (id: string) => {
        setIsLoading(true);
        setError(null);

        // First optimistically update the UI
        const bookmarkToUpdate = bookmarks.find((b) => b.id === id);
        if (!bookmarkToUpdate) return;

        // Only proceed if the bookmark is not already archived
        if (!bookmarkToUpdate.archived) {
            try {
                // Update on the server
                await archiveBookmark(id);

                // Remove from the current view if we're showing non-archived
                if (!showArchived) {
                    setBookmarks((prev) => prev.filter((b) => b.id !== id));
                } else {
                    // If showing archived, update the status in the current view
                    setBookmarks((prev) => prev.map((b) => (b.id === id ? { ...b, archived: true } : b)));
                }
            } catch (err) {
                setError("Failed to archive bookmark. Please try again.");
                console.error("Error archiving bookmark:", err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar onAddBookmark={() => setIsModalOpen(true)} onToggleArchived={() => setShowArchived(!showArchived)} showArchived={showArchived} bookmarkCount={filteredBookmarks.length} />
            <main className="flex-1 container mx-auto p-2 pt-7">
                {/* <h1 className="text-2xl font-bold mb-4 font-mono">
          {showArchived ? 'Archived Bookmarks' : 'Active Bookmarks'}
        </h1> */}

                {/* Error message */}
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-mono">{error}</div>}

                {/* Loading state */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="font-mono text-gray-600">Loading bookmarks...</div>
                    </div>
                ) : (
                    <BookmarkTable bookmarks={filteredBookmarks} onArchive={handleArchiveToggle} />
                )}
            </main>
            <AddBookmarkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddBookmark} />
        </div>
    );
}

export default App;

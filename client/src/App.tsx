import { useState, useEffect } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import BookmarkTable, { Bookmark } from "./components/BookmarkTable";
import PocketTable from "./components/PocketTable";
import AddBookmarkModal from "./components/AddBookmarkModal";
import { fetchBookmarks, createBookmark, archiveBookmark, ApiError } from "./api/bookmarkService";
import { fetchPocketLinks, PocketLink } from "./api/pocketService";

function App() {
    // State for bookmarks, modal visibility, and archive filter
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [isAddingBookmark, setIsAddingBookmark] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Pocket state
    const [showPocket, setShowPocket] = useState(false);
    const [pocketLinks, setPocketLinks] = useState<PocketLink[]>([]);

    // Filter bookmarks based on archived status
    const filteredBookmarks = bookmarks.filter((bookmark) => bookmark.archived === showArchived);

    // Fetch bookmarks when component mounts or when archived filter changes
    useEffect(() => {
        if (!showPocket) {
            const loadBookmarks = async () => {
                setIsTableLoading(true);
                setError(null);
                try {
                    const data = await fetchBookmarks(showArchived);
                    setBookmarks(data);
                } catch (err) {
                    setError("Failed to load bookmarks. Please try again later.");
                    console.error("Error loading bookmarks:", err);
                } finally {
                    setIsTableLoading(false);
                }
            };

            loadBookmarks();
        }
    }, [showArchived, showPocket]);

    // Fetch pocket links when pocket view is active
    useEffect(() => {
        if (showPocket) {
            const loadPocketLinks = async () => {
                setIsTableLoading(true);
                setError(null);
                try {
                    const data = await fetchPocketLinks("all"); // Load all pocket links
                    setPocketLinks(data);
                } catch (err) {
                    setError("Failed to load pocket links. Please try again later.");
                    console.error("Error loading pocket links:", err);
                } finally {
                    setIsTableLoading(false);
                }
            };

            loadPocketLinks();
        }
    }, [showPocket]);

    // Handle adding a new bookmark
    const handleAddBookmark = async (newBookmark: Omit<Bookmark, "id">) => {
        setIsAddingBookmark(true);
        setError(null);
        try {
            const createdBookmark = await createBookmark(newBookmark.url);
            // Only add to state if we're viewing the correct list (non-archived)
            if (!showArchived) {
                setBookmarks((prev) => [...prev, createdBookmark]);
            }
            return Promise.resolve();
        } catch (err) {
            // Don't set the error in main UI if it's a 409 conflict,
            // as it will be handled by the modal
            if (!(err instanceof ApiError) || err.status !== 409) {
                setError("Failed to add bookmark. Please try again.");
            }
            console.error("Error adding bookmark:", err);
            return Promise.reject(err);
        } finally {
            setIsAddingBookmark(false);
        }
    };

    // Handle toggling archive status
    const handleArchiveToggle = async (id: string) => {
        setIsTableLoading(true);
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
                setIsTableLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar
                onAddBookmark={() => setIsModalOpen(true)}
                onToggleArchived={() => setShowArchived(!showArchived)}
                showArchived={showArchived}
                bookmarkCount={filteredBookmarks.length}
                onTogglePocket={() => setShowPocket(!showPocket)}
                showPocket={showPocket}
            />
            <main className="flex-1 container mx-auto p-2 pt-7">
                {/* Error message */}
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 font-mono">{error}</div>}

                {/* Loading state */}
                {isTableLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="font-mono text-gray-600">
                            {showPocket ? 'Loading pocket links...' : 'Loading bookmarks...'}
                        </div>
                    </div>
                ) : (
                    <>
                        {showPocket ? (
                            <PocketTable pocketLinks={pocketLinks} />
                        ) : (
                            <BookmarkTable bookmarks={filteredBookmarks} onArchive={handleArchiveToggle} />
                        )}
                    </>
                )}
            </main>
            <AddBookmarkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddBookmark} isSubmitting={isAddingBookmark} />
        </div>
    );
}

export default App;

import React, { useState } from "react";
import { Bookmark } from "./BookmarkTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription } from "../components/ui/alert";
import { ApiError } from "../api/bookmarkService";

type AddBookmarkModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (bookmark: Omit<Bookmark, "id">) => Promise<void>;
    isSubmitting?: boolean;
};

const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({ isOpen, onClose, onAdd, isSubmitting = false }) => {
    const [url, setUrl] = useState("");
    const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Use either the prop or local state for submission status
    const submitting = isSubmitting || localIsSubmitting;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (url) {
            setLocalIsSubmitting(true);
            setError(null);
            
            try {
                await onAdd({
                    url,
                    title: "",
                    description: "",
                    archived: false,
                });
                
                // Reset form and close modal only on success
                setUrl("");
                onClose();
            } catch (err) {
                // Handle specific error types
                if (err instanceof ApiError && err.status === 409) {
                    setError("This URL is already bookmarked.");
                } else {
                    setError("Failed to add bookmark. Please try again.");
                }
                console.error("Error adding bookmark:", err);
            } finally {
                setLocalIsSubmitting(false);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Bookmark</DialogTitle>
                    <DialogDescription>
                        Enter the URL below. The title and description will be automatically fetched from the webpage.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label
                                htmlFor="url"
                                className="text-sm font-medium leading-none whitespace-nowrap peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                URL
                            </label>
                            <Input
                                id="url"
                                type="url"
                                value={url}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="flex-grow"
                                required
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={submitting} className="h-9 px-4">
                            Cancel
                        </Button>
                        <Button type="submit" variant="default" size="sm" disabled={submitting} className="h-9 px-4">
                            {submitting ? "Adding..." : "Add"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddBookmarkModal;

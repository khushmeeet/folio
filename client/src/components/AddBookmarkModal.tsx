import React, { useState } from "react";
import { Bookmark } from "./BookmarkTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AddBookmarkModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (bookmark: Omit<Bookmark, "id">) => void;
};

const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [url, setUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url) {
            setIsSubmitting(true);
            onAdd({
                url,
                title: "", // Server will fetch the title
                description: "", // Server will fetch the description
                archived: false,
            });
            // Reset form
            setUrl("");
            setIsSubmitting(false);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Bookmark</DialogTitle>
                    <DialogDescription>
                        Enter the URL below. The title and description will be automatically fetched from the webpage.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="url" className="text-right text-sm font-medium">
                                URL
                            </label>
                            <div className="col-span-3">
                                <Input
                                    id="url"
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="font-sans flex items-center gap-1 h-7 text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="secondary"
                            size="sm"
                            disabled={isSubmitting}
                            className="font-sans flex items-center gap-1 h-7 text-xs"
                        >
                            {isSubmitting ? "Adding..." : "Add"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddBookmarkModal;

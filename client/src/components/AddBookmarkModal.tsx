import React, { useState } from "react";
import { Bookmark } from "./BookmarkTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

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
        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Bookmark</DialogTitle>
                    <DialogDescription>
                        Enter the URL below. The title and description will be automatically fetched from the webpage.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label htmlFor="url" className="text-sm font-medium leading-none whitespace-nowrap peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="h-9 px-4"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="default" 
                            size="sm" 
                            disabled={isSubmitting} 
                            className="h-9 px-4"
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

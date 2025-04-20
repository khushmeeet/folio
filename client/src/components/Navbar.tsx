import React from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { PlusCircle, Archive, ArchiveRestore } from "lucide-react";

type NavbarProps = {
    bookmarkCount: number;
    onAddBookmark: () => void;
    onToggleArchived: () => void;
    showArchived: boolean;
    bookmarkCount: number;
};

const Navbar: React.FC<NavbarProps> = ({ onAddBookmark, onToggleArchived, showArchived, bookmarkCount }) => {
    return (
        <div className="fixed top-0 inset-x-0 px-2 z-50 flex justify-center bg-background/80 backdrop-blur-sm border-b">
            <nav className="w-full max-w-6xl font-sans flex items-center justify-between py-2 px-2">
                <div className="flex items-center">
                    <h1 className="text-lg font-semibold font-sans tracking-tight">Folio</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs font-sans mr-1 px-3">Bookmarks: {bookmarkCount}</span>
                    <Button variant="secondary" size="sm" onClick={onAddBookmark} className="font-sans flex items-center gap-1 h-7 text-xs">
                        <PlusCircle className="h-3 w-3" />
                        Add Bookmark
                    </Button>

                    <Separator orientation="vertical" className="h-5" />
                    <Button variant="outline" size="sm" onClick={onToggleArchived} className="font-sans flex items-center gap-1 h-7 text-xs">
                        {showArchived ? (
                            <>
                                <ArchiveRestore className="h-3 w-3" />
                                Show Active
                            </>
                        ) : (
                            <>
                                <Archive className="h-3 w-3" />
                                Show Archived
                            </>
                        )}
                    </Button>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;

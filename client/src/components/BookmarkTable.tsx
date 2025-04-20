import React from 'react';
import { Archive, ArchiveRestore } from 'lucide-react';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { cn } from '../lib/utils';

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string;
  archived: boolean;
}

type BookmarkTableProps = {
  bookmarks: Bookmark[];
  onArchive: (id: string) => void;
};

const BookmarkTable: React.FC<BookmarkTableProps> = ({ bookmarks, onArchive }) => {
  return (
    <div className="w-full">
      <Table className="font-sans">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className={cn("w-10 font-medium py-1.5 px-2 text-xs text-left")}>#</TableHead>
            <TableHead className={cn("font-medium py-1.5 px-2 text-xs text-left")}>Article</TableHead>
            <TableHead className={cn("font-medium py-1.5 px-2 text-xs text-left")}>Description</TableHead>
            <TableHead className={cn("w-28 font-medium py-1.5 px-2 text-xs text-left")}>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookmarks.map((bookmark, index) => (
            <TableRow key={bookmark.id} className="h-8">
              <TableCell className={cn("font-medium py-1 px-2 text-xs text-left")}>{index + 1}</TableCell>
              <TableCell className={cn("py-1 px-2 text-left")}>
                <a 
                  href={bookmark.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline text-xs font-medium"
                >
                  {bookmark.title}
                </a>
                <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                  {bookmark.url}
                </div>
              </TableCell>
              <TableCell className={cn("text-muted-foreground py-1 px-2 text-xs text-left")}>{bookmark.description}</TableCell>
              <TableCell className={cn("py-1 px-2 text-left")}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onArchive(bookmark.id)}
                  className="font-sans flex items-center gap-1 h-6 text-xs px-2"
                >
                  {bookmark.archived ? (
                    <>
                      <ArchiveRestore className="h-3 w-3" />
                      Restore
                    </>
                  ) : (
                    <>
                      <Archive className="h-3 w-3" />
                      Archive
                    </>
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {bookmarks.length === 0 && (
        <div className="text-center py-6 text-muted-foreground font-sans text-xs">
          No bookmarks found.
        </div>
      )}
    </div>
  );
};

export default BookmarkTable;
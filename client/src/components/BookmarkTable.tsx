import React from 'react';

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
    <div className="w-full overflow-auto">
      <table className="w-full mt-4 border-collapse font-mono">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3 border-b border-gray-300">#</th>
            <th className="p-3 border-b border-gray-300">Article</th>
            <th className="p-3 border-b border-gray-300">Description</th>
            <th className="p-3 border-b border-gray-300">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookmarks.map((bookmark, index) => (
            <tr key={bookmark.id} className="hover:bg-gray-100">
              <td className="p-3 border-b border-gray-300">{index + 1}</td>
              <td className="p-3 border-b border-gray-300">
                <a 
                  href={bookmark.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline"
                >
                  {bookmark.title}
                </a>
              </td>
              <td className="p-3 border-b border-gray-300">{bookmark.description}</td>
              <td className="p-3 border-b border-gray-300">
                <button
                  onClick={() => onArchive(bookmark.id)}
                  className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                >
                  {bookmark.archived ? 'Restore' : 'Archive'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {bookmarks.length === 0 && (
        <div className="text-center py-8 text-gray-500 font-mono">
          No bookmarks found.
        </div>
      )}
    </div>
  );
};

export default BookmarkTable;
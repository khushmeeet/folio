import React from 'react';

type NavbarProps = {
  onAddBookmark: () => void;
  onToggleArchived: () => void;
  showArchived: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ onAddBookmark, onToggleArchived, showArchived }) => {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="font-mono text-xl font-bold">Folio</div>
      <div className="flex space-x-4">
        <button 
          onClick={onAddBookmark}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded font-mono text-sm"
        >
          + Add Bookmark
        </button>
        <button 
          onClick={onToggleArchived}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded font-mono text-sm"
        >
          {showArchived ? 'Show Active' : 'Show Archived'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useState } from 'react';
import { Bookmark } from './BookmarkTable';

type AddBookmarkModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (bookmark: Omit<Bookmark, 'id'>) => void;
};

const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      setIsSubmitting(true);
      onAdd({
        url,
        title: '', // Server will fetch the title
        description: '', // Server will fetch the description
        archived: false
      });
      // Reset form
      setUrl('');
      setIsSubmitting(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-md w-full max-w-md font-mono">
        <h2 className="text-xl mb-4 font-bold">Add Bookmark</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter the URL below. The title and description will be automatically fetched from the webpage.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="url">URL</label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded font-mono"
              placeholder="https://example.com"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookmarkModal;
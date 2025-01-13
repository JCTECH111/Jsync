import { useState } from 'react';
import { BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon as OutlineBookmarkIcon } from '@heroicons/react/24/outline';

const Bookmarked = () => {
  const [bookmarks, setBookmarks] = useState([
    {
      id: 1,
      type: 'image',
      name: 'Beautiful Sunset',
      description: 'A serene sunset over the mountains.',
      src: 'https://th.bing.com/th/id/OIP.0ZM7e1Z_zmebcBILunvbHQHaEn?pid=ImgDetMain',
      date: '2025-01-08',
    },
    {
      id: 2,
      type: 'video',
      name: 'Nature Walk',
      description: 'An amazing video of a walk through the forest.',
      src: 'https://th.bing.com/th/id/OIP.9NFweGdindhwlY_-MVCEUAHaHv?pid=ImgDet&w=213&h=221&c=7',
      date: '2025-01-07',
    },
    {
      id: 3,
      type: 'music',
      name: 'Relaxing Melody',
      description: 'A soothing piece to calm your mind.',
      src: 'https://th.bing.com/th/id/OIP.QEVUd4qe4rorXILE7aBklgHaE8?pid=ImgDetMain',
      date: '2025-01-06',
    },
    {
      id: 4,
      type: 'document',
      name: 'Important Notes',
      description: 'Key points from the recent meeting.',
      src: 'https://th.bing.com/th/id/OIP.ex0wgRF7j83k4eY_1_fpxQAAAA?pid=ImgDetMain',
      date: '2025-01-05',
    },
  ]);

  // Function to remove a bookmark
  const removeBookmark = (id) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
  };

  return (
    <div className="container p-6 mx-auto">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Your Bookmarks</h2>
      <div className="space-y-6">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex items-start p-4 bg-white border border-gray-200 rounded-lg shadow-md"
          >
            {/* Image */}
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={bookmark.src}
                alt={bookmark.name}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>

            {/* Details */}
            <div className="flex-1 ml-4">
              <h3 className="text-lg font-semibold text-gray-800">{bookmark.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{bookmark.description}</p>
              <p className="mt-2 text-xs text-gray-500">Bookmarked on: {bookmark.date}</p>
            </div>

            {/* Remove Bookmark */}
            <button
              onClick={() => removeBookmark(bookmark.id)}
              className="ml-4 text-gray-500 hover:text-red-600"
            >
              <SolidBookmarkIcon className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookmarked;

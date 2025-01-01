import { useState } from 'react';
import { VideoCameraIcon, MusicalNoteIcon, DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/solid';

const Bookmarked = () => {
  const [bookmarks, setBookmarks] = useState([
    { id: 1, type: 'image', name: 'Image 1', src: 'https://th.bing.com/th/id/OIP.0ZM7e1Z_zmebcBILunvbHQHaEn?pid=ImgDetMain' },
    { id: 2, type: 'video', name: 'Video 1', src: 'https://th.bing.com/th/id/OIP.9NFweGdindhwlY_-MVCEUAHaHv?pid=ImgDet&w=213&h=221&c=7' },
    { id: 3, type: 'music', name: 'Song 1', src: 'https://th.bing.com/th/id/OIP.QEVUd4qe4rorXILE7aBklgHaE8?pid=ImgDetMain' },
    { id: 4, type: 'document', name: 'Document 1', src: 'https://th.bing.com/th/id/OIP.ex0wgRF7j83k4eY_1_fpxQAAAA?pid=ImgDetMain' },
  ]);

  return (
    <div className="container p-6 mx-auto">
      <h2 className="mb-6 text-2xl font-semibold">Your Bookmarks</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex flex-col items-center p-6 transition-transform transform bg-white rounded-lg shadow-xl hover:scale-105"
          >
            {/* Conditional Rendering Based on Bookmark Type */}
            {bookmark.type === 'image' && (
              <>
                <img
                  src={bookmark.src}
                  alt={bookmark.name}
                  className="object-cover w-48 h-48 mb-4 rounded-lg"
                />
                <PhotoIcon className="w-6 h-6 mb-2 text-gray-600" />
                <p className="text-xl font-semibold text-gray-700">{bookmark.name}</p>
              </>
            )}
            {bookmark.type === 'video' && (
              <>
                <img
                  src={bookmark.src}
                  alt={bookmark.name}
                  className="object-cover w-48 h-48 mb-4 rounded-lg"
                />
                <VideoCameraIcon className="w-8 h-8 mb-2 text-gray-600" />
                <p className="text-xl font-semibold text-gray-700">{bookmark.name}</p>
              </>
            )}
            {bookmark.type === 'music' && (
              <>
                <img
                  src={bookmark.src}
                  alt={bookmark.name}
                  className="object-cover w-48 h-48 mb-4 rounded-lg"
                />
                <MusicalNoteIcon className="w-8 h-8 mb-2 text-gray-600" />
                <p className="text-xl font-semibold text-gray-700">{bookmark.name}</p>
              </>
            )}
            {bookmark.type === 'document' && (
              <>
                <img
                  src={bookmark.src}
                  alt={bookmark.name}
                  className="object-cover w-48 h-48 mb-4 rounded-lg"
                />
                <DocumentTextIcon className="w-8 h-8 mb-2 text-gray-600" />
                <p className="text-xl font-semibold text-gray-700">{bookmark.name}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookmarked;

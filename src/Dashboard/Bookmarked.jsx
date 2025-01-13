import { useState, useEffect, useContext, useMemo } from 'react';
import { Databases, Query } from 'appwrite';
import { client } from '../lib/appwrite';
import { BookmarkIcon as SolidBookmarkIcon } from '@heroicons/react/24/solid';
import { AuthContext } from '../context/AuthContext';

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const bookmarksCollectionID = import.meta.env.VITE_APPWRITE_BOOKMARK_ID;

const Bookmarked = () => {
  const { userId } = useContext(AuthContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Appwrite Databases client
  const databases = useMemo(() => new Databases(client), []);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await databases.listDocuments(
          databaseId,
          bookmarksCollectionID,
          [Query.equal('userId', userId)]
        );
        setBookmarks(response.documents);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [databases, userId]);

  // Remove Bookmark Functionality
  const removeBookmark = async (id) => {
    try {
      await databases.deleteDocument(databaseId, bookmarksCollectionID, id);
      setBookmarks((prev) => prev.filter((bookmark) => bookmark.$id !== id));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  return (
    <div className="container p-6 mx-auto">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Your Bookmarks</h2>
      {isLoading ? (
        <p>Loading bookmarks...</p>
      ) : bookmarks.length === 0 ? (
        <p>No bookmarks available.</p>
      ) : (
        <div className="space-y-6">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.$id}
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
                <p className="mt-1 text-sm text-gray-600">{bookmark.notes}</p>
                <p className="mt-2 text-xs text-gray-500">
                  Bookmarked on: {new Date(bookmark.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Remove Bookmark */}
              <button
                onClick={() => removeBookmark(bookmark.$id)}
                className="ml-4 text-gray-500 hover:text-red-600"
              >
                <SolidBookmarkIcon className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarked;

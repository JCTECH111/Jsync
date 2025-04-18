import { useState, useEffect, useContext, useMemo } from 'react';
import { Databases, Query } from 'appwrite';
import { client } from '../lib/appwrite';
import { BookmarkIcon as SolidBookmarkIcon, EyeIcon, ShareIcon } from '@heroicons/react/24/solid';
import { AuthContext } from '../context/AuthContext';
import { removeBookmarked } from '../lib/removeBookmarked';
import { ToastContainer, toast } from 'react-toastify';
import ShareModal from "../components/ShareModal";
import { viewUrl } from "../lib/viewFile";
import SoundWaveLoader from "../components/SoundWaveLoader";

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const bookmarksCollectionID = import.meta.env.VITE_APPWRITE_BOOKMARK_ID;
const filesCollectionID = import.meta.env.VITE_APPWRITE_FILES_ID;
const fileBucketID = import.meta.env.VITE_APPWRITE_BUCKET_USERS_UPLOAD_DOCUMENT;

const Bookmarked = () => {
  const { userId } = useContext(AuthContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentFileLink, setCurrentFileLink] = useState("");
  const [error, setError] = useState(null);

  const databases = useMemo(() => new Databases(client), []);

  useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    const fetchBookmarks = async () => {
      try {
        const response = await databases.listDocuments(
          databaseId,
          bookmarksCollectionID,
          [Query.equal('userId', userId)]
        );

        const files = response.documents;

        if (!isMounted) return; // Don't update state if component unmounted

        if (files.length === 0) {
          setBookmarks([]);
          return;
        }

        const filesWithMetadata = await Promise.all(
          files.map(async (file) => {
            try {
              const metadataResponse = await databases.listDocuments(
                databaseId,
                filesCollectionID,
                [Query.equal('fileId', file.fileId)]
              );
              return { ...file, metadata: metadataResponse.documents[0] || {} };
            } catch (error) {
              console.error(`Error fetching metadata for file ${file.$id}:`, error);
              return { ...file, metadata: {} };
            }
          })
        );

        if (isMounted) {
          setBookmarks(filesWithMetadata);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        if (isMounted) {
          setError('Failed to load bookmarks. Please try again.');
          setBookmarks([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBookmarks();

    return () => {
      isMounted = false; // Cleanup function to prevent state updates after unmount
    };
  }, [databases, userId]);

  const removeBookmark = async (id) => {
    try {
      // Optimistically update UI
      setBookmarks(prev => prev.filter(bookmark => bookmark.fileId !== id));
      
      await removeBookmarked(id);
      toast.success("Bookmark removed successfully!");
    } catch (error) {
      console.error("Error removing bookmark:", error);
      // Revert optimistic update on error
      setBookmarks(prev => [...prev]);
      toast.error("Failed to remove bookmark. Please try again.");
    }
  };

  const handleView = async (bucketId, fileId) => {
    try {
      const url = await viewUrl(bucketId, fileId);
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Failed to view the file. Please try again.");
      console.error("View error:", error);
    }
  };

  const handleShare = (fileId) => {
    if (!fileId) {
      toast.error("Invalid file selection");
      return;
    }
    setCurrentFileLink(`https://jsync.vercel.app/view/${fileId}`);
    setIsShareModalOpen(true);
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return 'https://th.bing.com/th/id/OIP.KqOFXPxOJaFJd9LSugFlvwHaHa?pid=ImgDetMain';

    const fileExtension = fileName.split('.').pop().toLowerCase();
    const fileIcons = {
      image: 'https://th.bing.com/th/id/OIP.X7MywM3zRnzbj7jlp8CZfAHaHa?pid=ImgDetMain',
      video: 'https://th.bing.com/th/id/OIP.2BpSe9FyBJBS8TCHtPSqkwAAAA?pcl=1b1a19&pid=ImgDetMain',
      music: 'https://th.bing.com/th/id/OIP.-aU5kOdBDjL-5wBOJQUsCwHaKT?pid=ImgDetMain',
      pdf: 'https://th.bing.com/th/id/OIP.hHxtreh34L48Lf-vtvmXkwHaHa?pid=ImgDetMain',
      word: 'https://th.bing.com/th/id/R.aeb635f0078d89d0dc58f60eb2dde5a3?rik=JsRKRr7SHeIHlQ&pid=ImgRaw&r=0',
      default: 'https://th.bing.com/th/id/OIP.KqOFXPxOJaFJd9LSugFlvwHaHa?pid=ImgDetMain',
    };

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(fileExtension)) {
      return fileIcons.image;
    }
    if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(fileExtension)) {
      return fileIcons.video;
    }
    if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(fileExtension)) {
      return fileIcons.music;
    }
    if (fileExtension === 'pdf') return fileIcons.pdf;
    if (['doc', 'docx'].includes(fileExtension)) return fileIcons.word;

    return fileIcons.default;
  };

  return (
    <div className="container p-6 mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Your Bookmarks</h2>
      
      {error ? (
        <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">
          {error}
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center w-full">
          <SoundWaveLoader />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          <p className="text-lg font-semibold text-gray-700">No bookmarks available</p>
          <p className="mt-2 text-sm text-gray-500">
            Save your favorite items from public documents to see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div
              key={`${bookmark.$id}-${bookmark.fileId}`} // More unique key
              className="flex flex-col sm:flex-row items-start p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-full sm:w-24 h-24 flex-shrink-0 mb-4 sm:mb-0">
                <img
                  src={getFileIcon(bookmark.metadata.fileName)}
                  alt={bookmark.metadata.fileName || 'File'}
                  className="object-cover w-full h-full rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://th.bing.com/th/id/OIP.KqOFXPxOJaFJd9LSugFlvwHaHa?pid=ImgDetMain';
                  }}
                />
              </div>

              <div className="flex-1 sm:ml-4 w-full">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {bookmark.metadata.fileName || 'Untitled File'}
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {bookmark.metadata.notes || 'No description available'}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Bookmarked on: {new Date(bookmark.$createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex sm:flex-col gap-3 mt-4 sm:mt-0 ml-auto">
                <button
                  onClick={() => removeBookmark(bookmark.fileId)}
                  className="text-blue-600 hover:text-red-600 transition-colors"
                  aria-label="Remove bookmark"
                >
                  <SolidBookmarkIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleView(fileBucketID, bookmark.fileId)}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label="View file"
                >
                  <EyeIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare(bookmark.fileId)}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                  aria-label="Share file"
                >
                  <ShareIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        fileLink={currentFileLink}
      />
    </div>
  );
};

export default Bookmarked;
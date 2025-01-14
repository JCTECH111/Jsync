import { useState, useEffect, useContext, useMemo } from 'react';
import { Databases, Query } from 'appwrite';
import { client } from '../lib/appwrite';
import { BookmarkIcon as SolidBookmarkIcon, EyeIcon, ShareIcon } from '@heroicons/react/24/solid';
import { AuthContext } from '../context/AuthContext';
import { removeBookmarked } from '../lib/removeBookmarked'
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
  const [currentFileLink, setCurrentFileLink] = useState("")

  const databases = useMemo(() => new Databases(client), []);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await databases.listDocuments(
          databaseId,
          bookmarksCollectionID,
          [Query.equal('userId', userId)]
        );

        const files = response.documents;


        if (files.length === 0) {
          console.warn("No files found for the user.");
          setBookmarks([]);
          return;
        }

        const filesWithMetadata = await Promise.all(
          files.map(async (file) => {
            try {
              const metadataResponse = await databases.listDocuments(
                databaseId,
                filesCollectionID,
                [Query.equal('fileId', file.fileId)] // Corrected to query the document ID
              );
              const metadata = metadataResponse.documents[0] || {};
              return { ...file, metadata };
            } catch (error) {
              console.error(`Error fetching metadata for file ${file.$id}:`, error);
              return { ...file, metadata: {} }; // Return empty metadata on error
            }
          })
        );

        setBookmarks(filesWithMetadata);
        console.log(filesWithMetadata)
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        setBookmarks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [databases, userId]);

  const removeBookmark = async (id) => {
    try {
      // Optimistically update UI by removing the bookmark locally
      setBookmarks((prev) => prev.filter((bookmark) => bookmark.fileId !== id));

      // Call the function to handle server-side removal
      await removeBookmarked(id);

      // Show success toast
      toast.success("Bookmark removed successfully!");
    } catch (error) {
      console.error("Error removing bookmark:", error);

      // Revert the optimistic update on failure
      setBookmarks((prev) => [...prev, id]);

      // Show error toast
      toast.error("An error occurred while removing the bookmark. Please try again.");
    }
  };

  const handleView = async (bucketId, fileId) => {
    try {
      const url = await viewUrl(bucketId, fileId);
      console.log("View URL:", url);

      // Open the URL in a new tab
      window.open(url, "_blank");
    } catch (error) {
      alert("Failed to view the file. Please try again.", error);
    }
  };
  const handleShare = (fileId) => {
    if (!fileId) {
      toast.error("Please select at least one file to delete.");
      return;
    }

    const fileLink = `https://jsync.vercel.app/view/${fileId}`; // Generate your file link
    setCurrentFileLink(fileLink);
    setIsShareModalOpen(true);
  }

  const getFileIcon = (fileName) => {
    if (!fileName) {
      return '/placeholder-image.png'; // Default placeholder
    }

    const fileExtension = fileName.split('.').pop().toLowerCase(); // Extract file extension

    // Match file types to custom images
    const fileIcons = {
      image: 'https://th.bing.com/th/id/OIP.X7MywM3zRnzbj7jlp8CZfAHaHa?pid=ImgDetMain', // Path to custom image icon
      video: 'https://th.bing.com/th/id/OIP.2BpSe9FyBJBS8TCHtPSqkwAAAA?pcl=1b1a19&pid=ImgDetMain', // Path to custom video icon
      music: 'https://th.bing.com/th/id/OIP.-aU5kOdBDjL-5wBOJQUsCwHaKT?pid=ImgDetMain', // Path to custom music icon
      pdf: 'https://th.bing.com/th/id/OIP.hHxtreh34L48Lf-vtvmXkwHaHa?pid=ImgDetMain',     // Path to custom PDF icon
      word: 'https://th.bing.com/th/id/R.aeb635f0078d89d0dc58f60eb2dde5a3?rik=JsRKRr7SHeIHlQ&pid=ImgRaw&r=0',   // Path to custom MS Word icon
      default: 'https://th.bing.com/th/id/OIP.KqOFXPxOJaFJd9LSugFlvwHaHa?pid=ImgDetMain', // Default icon
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
    if (['pdf'].includes(fileExtension)) {
      return fileIcons.pdf;
    }
    if (['doc', 'docx'].includes(fileExtension)) {
      return fileIcons.word;
    }

    return fileIcons.default; // Return default icon if no match
  };


  return (
    <div className="container p-6 mx-auto">
      <ToastContainer />
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Your Bookmarks</h2>
      {isLoading ? (
        <div className='w-full items-center justify-center'>
        <SoundWaveLoader />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className='w-full items-center justify-center text-gray-600 font-bold'>
        <p>No bookmarks available.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.$id}
              className="flex items-start p-4 bg-white border border-gray-200 rounded-lg shadow-md"
            >
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={getFileIcon(bookmark.metadata.fileName)}
                  alt={bookmark.notes || 'File'}
                  className="object-cover w-full h-full rounded-lg"
                />

              </div>

              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {bookmark.metadata.fileName || 'Unknown Name'}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {bookmark.metadata.notes || 'No notes available'}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Bookmarked on: {new Date(bookmark.timestamp).toLocaleDateString()}
                </p>
              </div>

              <div className='flex flex-col gap-4'>
                <button
                  onClick={() => removeBookmark(bookmark.fileId)}
                  className="ml-4 text-blue-600 hover:text-red-600"
                  id={bookmark.fileId}
                >
                  <SolidBookmarkIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleView(fileBucketID, bookmark.fileId)}
                  className="ml-4 text-gray-600 hover:text-blue-600"
                  id={bookmark.fileId}
                >
                  <EyeIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleShare(bookmark.fileId)}
                  className="ml-4 text-blue-600 hover:text-blue-700"
                  id={bookmark.fileId}
                >
                  <ShareIcon className="w-6 h-6" />
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

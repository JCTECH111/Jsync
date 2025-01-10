import { useEffect, useState, useContext } from "react";
import { FolderIcon, DocumentIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { getUserFilesWithMetadata } from "../lib/fetchAndMergeFileData"; // Import the backend function
import { AuthContext } from '../context/AuthContext';
import SoundWaveLoader from './SoundWaveLoader'
import { downloadUrl } from "../lib/download";
import { deleteFileWithMetadata } from "../lib/deleteFile";
const fileBucketID = import.meta.env.VITE_APPWRITE_BUCKET_USERS_UPLOAD_DOCUMENT;
  const fileColectionId = import.meta.env.VITE_APPWRITE_FILES_ID;
  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID
  import { updateUserActivity } from "../lib/updateUserActivities";
  import { ToastContainer, toast } from 'react-toastify';
  import ShareModal from "./ShareModal";

const RecentFiles = () => {
  
  const [files, setFiles] = useState([]);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const { userId } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentFileLink, setCurrentFileLink] = useState("");

  const showErrorMessage = (message) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  const showSuccessMessage = (message) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const userFiles = await getUserFilesWithMetadata(userId);
        setFiles(userFiles);
      } catch (error) {
        console.error("Error fetching user files:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [userId]);



  const tagStyles = {
    music: "bg-yellow-100 text-yellow-700",
    image: "bg-purple-100 text-purple-700",
    video: "bg-blue-100 text-blue-700",
    document: "bg-green-100 text-green-700",
    other: "bg-pink-100 text-pink-700",
  };

  const handleDropdown = (index) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };
  const handleDownload = async (fileId) => {
    console.log(fileId)
    try {
        const url = await downloadUrl(fileBucketID, fileId, userId);
        // Create a download link for each file
        const link = document.createElement("a");
        // console.log(url)
        link.href = url;
        link.target = "_blank";
        link.download = ""; // Set a filename if needed
        link.click();


      const now = new Date();
      const month = now.toLocaleString("default", { month: "short" });
      const year = now.getFullYear();

      await updateUserActivity(userId, month, year, "downloads", 1);
    } catch (error) {
      alert("Failed to download one or more files. Please try again.", error);
    } finally {
      setDropdownIndex(null)
    }
  }
  const handleDelete = async (fileId) => {
    try {
        await deleteFileWithMetadata(fileBucketID, fileId, databaseId, fileColectionId, userId); // Call the delete function


      showSuccessMessage("Selected files deleted successfully.")
      // Clear selected files after deletion
      // / Refresh the files after deletion
      setFiles((prevFiles) => prevFiles.filter(() => !setFiles.includes(fileId)));
    } catch (error) {
      showErrorMessage("Failed to delete files. Please try again.");
      console.error("Delete Error:", error);
    }finally{
      setDropdownIndex(null)
    }
  }
  const handleShare = (fileId) => {
    console.log(fileId)
    const fileLink = `https://jsync.vercel.app/view/${fileId}`; // Generate your file link
    setCurrentFileLink(fileLink);
    setIsShareModalOpen(true);
      setDropdownIndex(null)
  }

  return (
    <div className="p-2 mt-5 bg-gray-50">
    <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Recent Files</h2>
        <a href="#view-all" className="text-blue-500 hover:underline">
          View All
        </a>
      </div>
      <div className="bg-white border rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-3 text-sm font-medium text-gray-500">Name</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">Size</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">Modified</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">Label</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">sharedWith</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-4 text-center">
                    <SoundWaveLoader /> {/* Add your spinner or skeleton loader */}
                  </td>
                </tr>
              ) : (
                files.map((file) => (
                  <tr key={file.$id} className="transition-colors border-b hover:bg-gray-50">
                    <td className="flex items-center px-6 py-4 space-x-3">
                      {file.metadata.type === "folder" ? (
                        <FolderIcon className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <DocumentIcon className="w-5 h-5 text-gray-400" />
                      )}
                      <span>{file.FileName}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {file.fileSize || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {file.updatedAt || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${tagStyles[file.metadata.tags] || "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {file.metadata.tags || "No Tag"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {(Array.isArray(file.metadata.sharedWith) ? file.metadata.sharedWith : []).slice(0, 3).map((member, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 border-2 border-white rounded-full"
                          >
                            {member}
                          </div>
                        ))}

                        {Array.isArray(file.metadata.sharedWith) && file.metadata.sharedWith.length > 3 && (
                          <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-gray-400 border-2 border-white rounded-full">
                            +{file.metadata.sharedWith.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="relative px-6 py-4 text-right">
                      <EllipsisVerticalIcon
                        className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
                        onClick={() => handleDropdown(file.$id)}
                      />
                      {dropdownIndex === file.$id && (
                        <div className="absolute right-0 z-10 w-48 mt-2 bg-white border rounded-lg shadow-lg">
                          {/* Add Dropdown Actions */}
                          <button
                            className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:text-white hover:bg-blue-600 rounded-xl"
                            onClick={() => handleDownload(file.$id)}
                          >
                            Download
                          </button>
                          <button
                            className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:text-white hover:bg-blue-600 rounded-xl"
                            onClick={() => handleShare(file.$id)}
                          >
                            Share
                          </button>
                          <button
                            className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:text-white hover:bg-blue-600 rounded-xl"
                            onClick={() => handleDelete(file.$id)}
                          >
                            Delete
                          </button>

                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        fileLink={currentFileLink}
      />
    </div>
  );
};

export default RecentFiles;

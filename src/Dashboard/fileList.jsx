import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { useFetchFiles } from "../lib/fetchFiles";
import { deleteFileWithMetadata } from "../lib/deleteFile";
import { downloadUrl } from "../lib/download";
import { ToastContainer, toast } from 'react-toastify';
import SoundWaveLoader from "../components/SoundWaveLoader";

const fileColectionId = import.meta.env.VITE_APPWRITE_FILES_ID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID
const fileBucketID = import.meta.env.VITE_APPWRITE_BUCKET_USERS_UPLOAD_DOCUMENT;
const FileList = () => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const allFiles = useFetchFiles();
  const { fileType } = useParams(); // Get fileType from URL
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingError, setIsLoadingError] = useState(false);
  

  useEffect(() => {
    // Filter files based on fileType
    const fetchFilteredFiles = async () => {
      try {
        if (allFiles && fileType) {
          const filteredFiles = allFiles.filter((file) => file.fileType === fileType.toLowerCase());
          setFiles(filteredFiles);
        }
      } catch (error) {
        showErrorMessage(error)
        setIsLoadingError(true)
      }finally{
        setIsLoading(false)
      }
    };

    fetchFilteredFiles();
  }, [allFiles, fileType]);

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
  const handleSelect = (fileId) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const handleDownload = async () => {
    if (selectedFiles.length === 0) {
      alert("No files selected for download.");
      return;
    }
    try {
      for (const fileId of selectedFiles) {
        const url = await downloadUrl(fileBucketID, fileId);
        // Create a download link for each file
        const link = document.createElement("a");
        // console.log(url)
        link.href = url;
        link.target = "_blank";
        link.download = ""; // Set a filename if needed
        link.click();
      }

      const now = new Date();
      const month = now.toLocaleString("default", { month: "short" });
      const year = now.getFullYear();

      await updateUserActivity(userId, month, year, "downloads", 1);
    } catch (error) {
      alert("Failed to download one or more files. Please try again.", error);
    }
  };

  const handleDelete = async () => {
    if (selectedFiles.length === 0) {
      alert("No files selected for download.");
      return;
    }
    ////to indicates that theirs no file
    try {
      // Loop through all selected files and delete them
      for (const fileId of selectedFiles) {
        await deleteFileWithMetadata(fileBucketID, fileId, databaseId, fileColectionId); // Call the delete function
      }

      showSuccessMessage("Selected files deleted successfully.")
      // / Refresh the files after deletion
      setFiles((prevFiles) => prevFiles.filter(file => !selectedFiles.includes(file.$id)));
      // Clear selected files after deletion
      setSelectedFiles([]);
    } catch (error) {
      showErrorMessage("Failed to delete files. Please try again.");
      console.error("Delete Error:", error);
    }


    // Remove deleted files from the list
    setFiles(files.filter((file) => !selectedFiles.includes(file.$id)));
    setSelectedFiles([]);
  };

  return (
    <div className="p-4 overflow-x-scroll">
      <h2 className="mb-4 text-2xl font-bold">{fileType} Files</h2>
      {selectedFiles.length > 0 && (
        <div className="mt-4 mb-4 space-x-2">
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={handleDownload}
          >
            Download
          </button>
          <button
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
      <div className="bg-white border rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="">
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-3 text-sm font-medium text-gray-500">Select</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">Select</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">File Name</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">Size</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">Date Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center">
                    <SoundWaveLoader /> {/* Add your spinner or skeleton loader */}
                  </td>
                </tr>
              ) : (
                isLoadingError ? (
                  <tr>
                  <td colSpan="5" className="py-4 text-center">
                  <span className="text-gray-600 text-xl font-bold">Network Error</span>
                  </td>
                </tr>
                ) : (
                  files.length <= 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center">
                    <span className="text-gray-600 text-xl font-bold">No file yet Uploaded</span>
                  </td>
                </tr>
              ) : (
                
                  files.map((file) => (
                    <tr key={file.$id} className="transition-colors border-b hover:bg-gray-50">
                      <td className="flex items-center px-6 py-4 space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.$id)}
                          onChange={() => handleSelect(file.$id)}
                        />
                      </td>
                      <td className="px-4 py-2 border">{file.fileName}</td>
                      <td className="px-4 py-2 border">{file.fileSize} MB</td>
                      <td className="px-4 py-2 border">
                        {new Date(file.createdAt).toLocaleDateString()}{" "}
                        {new Date(file.createdAt).toLocaleTimeString()}
                      </td>

                    </tr>
                  ))
                
              )
                )
                
              ) }
              
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
      
    </div>
  );
};

export default FileList;

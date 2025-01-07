import React, { useState, useEffect, useContext } from "react";
import { useFetchFolders } from "../lib/fetchFolders";
import { useFetchFiles } from "../lib/fetchFiles";
import { downloadUrl } from "../lib/download";
import { viewUrl } from "../lib/viewFile";
import { deleteFileWithMetadata } from "../lib/deleteFile";
import { ToastContainer, toast } from 'react-toastify';
import { updateUserActivity } from "../lib/updateUserActivities";
import { AuthContext } from '../context/AuthContext';
const FileManagement = () => {
  const { userId } = useContext(AuthContext);
  const [openFolders, setOpenFolders] = useState({}); // Tracks open/closed state of folders
  const [selectedFolder, setSelectedFolder] = useState(null); // Tracks the currently selected folder
  const [selectedFiles, setSelectedFiles] = useState([]); // Tracks selected file IDs
  const [files, setFiles] = useState([]);
  const fetchedFolders = useFetchFolders(); // Use the custom hook
  const fetchedFiles = useFetchFiles(); // Use the custom hook
  const fileBucketID = import.meta.env.VITE_APPWRITE_BUCKET_USERS_UPLOAD_DOCUMENT;
  const fileColectionId = import.meta.env.VITE_APPWRITE_FILES_ID;
  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID
  // Folder structure and files
  const folderStructure = fetchedFolders
  // const fileStructure = fetchedFiles
  // console.log(fileStructure)

  // const files = fileStructure
  useEffect(() => {
    setFiles(fetchedFiles); // Update the state with the new files list
  }, [fetchedFiles]);
  // const fetchFiles = async () => {
  //   try {
  //     // Re-fetch the files from the server (or use your existing `useFetchFiles` hook to get updated files)
  //     const files = await fetchedFiles;
  //     // Update the file list after the operation
  //     setFiles(files);
  //   } catch (error) {
  //     console.error("Error fetching files:", error);
  //   }
  // };

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
  // Toggle folder open/close state
  const toggleFolder = (id) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Fetch child folders dynamically based on parentId
  const getChildren = (parentId) => {
    return folderStructure.filter((folder) => folder.parentFolderId === parentId);
  };

  // Handle folder click to display its files
  const handleFolderClick = (folderId) => {
    setSelectedFolder(folderId);
  };

  // Render folder structure recursively
  const renderFolder = (folder) => {
    const isOpen = openFolders[folder.$id];
    const children = getChildren(folder.$id);

    return (
      <li key={folder.$id}>
        <button
          className="flex items-center w-full p-2 text-left rounded hover:bg-gray-100"
          onClick={() => {
            toggleFolder(folder.$id);
            handleFolderClick(folder.$id);
          }}
        >
          {isOpen ? (
            <svg
              className="w-6 h-6 text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2H4z" />
            </svg>
          )}
          <span className="ml-2 font-medium text-gray-700">{folder.folderName}</span>
        </button>
        {isOpen && children.length > 0 && (
          <ul className="pl-4 mt-2 ml-6 space-y-1 border-l">
            {children.map((child) => renderFolder(child))}
          </ul>
        )}
      </li>
    );
  };

  // Handle checkbox selection
  const handleCheckboxChange = (fileId) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(fileId)
        ? prevSelected.filter((id) => id !== fileId) // Remove file if already selected
        : [...prevSelected, fileId] // Add file if not selected
    );
  };

  // Check if any files are selected
  const hasSelectedFiles = selectedFiles.length > 0;

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
  const handleView = async (bucketId, fileId) => {
    try {
      const url = await viewUrl(bucketId, fileId);
      console.log("View URL:", url);

      // Open the URL in a new tab
      window.open(url, "_blank");
    } catch (error) {
      alert("Failed to view the file. Please try again.");
    }
  };
  const handleDelete = async () => {
    if (selectedFiles.length === 0) {
      showErrorMessage("Please select at least one file to delete.");
      return;
    }

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
  };

  const handleButtonClick = () => {
    if (selectedFiles.length === 1) {
      handleView(fileBucketID, selectedFiles[0]); // Pass the single file ID
    } else if (selectedFiles.length === 0) {
      showErrorMessage("Please select a document to view.")
    } else {
      showErrorMessage("Please select only one document to view.")
    }
  }





  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100 lg:flex-row">
      {/* Sidebar */}
      <aside className="p-4 bg-white shadow-md lg:w-1/4">
        <h2 className="mb-4 text-xl font-bold text-gray-700">My Folders</h2>
        <ul className="space-y-2">
          {folderStructure
            .filter((folder) => folder.parentFolderId === null)
            .map((folder) => renderFolder(folder))}
        </ul>
      </aside>
      <ToastContainer />
      {/* Main Section */}
      <main className="flex-1 p-4 overflow-x-auto">
        <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
          <h2 className="text-xl font-bold text-gray-700">Folder Contents</h2>

          {/* Actions displayed when files are selected */}
          {hasSelectedFiles && (
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                onClick={handleDelete}>
                Delete
              </button>
              <button
                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                onClick={handleDownload}
              >
                Download
              </button>
              <button
                className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                onClick={handleButtonClick} // Pass appropriate IDs
              >
                View
              </button>


            </div>
          )}
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="text-left bg-gray-200">
                <th className="px-4 py-2 font-medium text-gray-500">
                  {/* Header checkbox for "select all" */}
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSelectedFiles(
                        isChecked
                          ? files
                            .filter((file) => file.folderId === selectedFolder)
                            .map((file) => file.$id)
                          : []
                      );
                    }}
                  />
                </th>
                <th className="px-4 py-2 font-medium text-gray-500">Name</th>
                <th className="px-4 py-2 font-medium text-gray-500">Size</th>
                <th className="px-4 py-2 font-medium text-gray-500">Modified</th>
                <th className="px-4 py-2 font-medium text-gray-500">Label</th>
                <th className="px-4 py-2 font-medium text-gray-500">Members</th>
              </tr>
            </thead>
            <tbody>
              {files
                .filter((file) => file.folderId === selectedFolder)
                .map((file) => (
                  <tr key={file.$id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 text-gray-600">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.$id)}
                        onChange={() => handleCheckboxChange(file.$id)}
                      />
                    </td>
                    <td className="px-4 py-2 text-gray-600">{file.fileName}</td>
                    <td className="px-4 py-2 text-gray-600">{file.fileSize}</td>
                    <td className="px-4 py-2 text-gray-600"><td className="px-4 py-2 border">
                      {new Date(file.createdAt).toLocaleDateString()}{" "}
                      {new Date(file.createdAt).toLocaleTimeString()}
                    </td>
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {file.Label ? (
                        <span className="px-2 py-1 text-sm text-white bg-blue-500 rounded">
                          {file.Label}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {file.members} members
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default FileManagement;

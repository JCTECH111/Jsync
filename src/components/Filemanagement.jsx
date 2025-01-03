import React, { useState } from "react";
import { useFetchFolders } from "../lib/fetchFolders";
import { useFetchFiles } from "../lib/fetchFiles";
const FileManagement = () => {
  const [openFolders, setOpenFolders] = useState({}); // Tracks open/closed state of folders
  const [selectedFolder, setSelectedFolder] = useState(null); // Tracks the currently selected folder
  const [selectedFiles, setSelectedFiles] = useState([]); // Tracks selected file IDs
  const fetchedFolders = useFetchFolders(); // Use the custom hook
  const fetchedFiles = useFetchFiles(); // Use the custom hook
  // Folder structure and files
  const folderStructure = fetchedFolders
  const fileStructure = fetchedFiles
  console.log(fileStructure)

  const files = fileStructure

  // Toggle folder open/close state
  const toggleFolder = (id) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Fetch child folders dynamically based on parentId
  const getChildren = (parentId) => {
    return folderStructure.filter((folder) => folder.parentId === parentId);
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 lg:flex-row">
      {/* Sidebar */}
      <aside className="p-4 bg-white shadow-md lg:w-1/4">
        <h2 className="mb-4 text-xl font-bold text-gray-700">My Folders</h2>
        <ul className="space-y-2">
          {folderStructure
            .filter((folder) => folder.parentFolderId === null)
            .map((folder) => renderFolder(folder))}
        </ul>
      </aside>

      {/* Main Section */}
      <main className="flex-1 p-4">
        <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
          <h2 className="text-xl font-bold text-gray-700">Folder Contents</h2>

          {/* Actions displayed when files are selected */}
          {hasSelectedFiles && (
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                Rename
              </button>
              <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
                Delete
              </button>
              <button className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
                Download
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
                    .map((file) => file.id)
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
        <tr key={file.id} className="border-b hover:bg-gray-100">
          <td className="px-4 py-2 text-gray-600">
            <input
              type="checkbox"
              checked={selectedFiles.includes(file.id)}
              onChange={() => handleCheckboxChange(file.id)}
            />
          </td>
          <td className="px-4 py-2 text-gray-600">{file.fileName}</td>
          <td className="px-4 py-2 text-gray-600">{file.fileSize}</td>
          <td className="px-4 py-2 text-gray-600">{file.updatedAt}</td>
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

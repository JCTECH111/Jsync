import React, { useState } from "react";
import { FolderIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const FileCards = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const folders = [
    { title: "Facebook Videos", count: 1754 },
    { title: "YouTube Videos", count: 3512 },
    { title: "Instagram Videos", count: 1908 },
    { title: "My Downloads", count: 218 },
  ];

  // Example action functions
  const viewDetails = (folder) => {
    alert(`Viewing details for: ${folder.title}`);
  };

  const share = (folder) => {
    alert(`Sharing folder: ${folder.title}`);
  };

  const download = (folder) => {
    alert(`Downloading folder: ${folder.title}`);
  };

  const rename = (folder) => {
    const newName = prompt(`Rename "${folder.title}" to:`, folder.title);
    if (newName) {
      alert(`Folder renamed to: ${newName}`);
    }
  };

  const deleteFolder = (folder) => {
    if (window.confirm(`Are you sure you want to delete "${folder.title}"?`)) {
      alert(`Deleted folder: ${folder.title}`);
    }
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <div className="p-6">
      {/* Folders Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Folders</h2>
          <a href="#view-all-folders" className="text-blue-500 hover:underline">
            View All
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {folders.map((folder, index) => (
            <div
              key={index}
              className="relative p-4 transition-shadow bg-white border rounded-lg shadow hover:shadow-lg"
            >
              {/* Folder Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FolderIcon className="w-6 h-6 text-yellow-500" />
                  <span className="text-lg font-bold">{folder.title}</span>
                </div>
                <div
                  className={`relative cursor-pointer ${
                    activeDropdown === index ? "border-2 border-blue-500 rounded-full" : ""
                  }`}
                >
                  <EllipsisVerticalIcon
                    className={`w-5 h-5 text-gray-400 hover:text-gray-600 ${
                      activeDropdown === index ? "text-blue-500" : ""
                    }`}
                    onClick={() => toggleDropdown(index)}
                  />
                </div>
              </div>
              {/* File Count */}
              <p className="mt-2 text-sm text-gray-500">
                {folder.count.toLocaleString()} Files
              </p>

              {/* Dropdown Menu */}
              {activeDropdown === index && (
                <div className="absolute z-10 w-40 bg-white border rounded-lg shadow-lg right-4 top-14">
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 rounded-lg hover:bg-blue-500 hover:text-white"
                    onClick={() => viewDetails(folder)}
                  >
                    View Details
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 rounded-lg hover:bg-blue-500 hover:text-white"
                    onClick={() => share(folder)}
                  >
                    Share
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 rounded-lg hover:bg-blue-500 hover:text-white"
                    onClick={() => download(folder)}
                  >
                    Download
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 rounded-lg hover:bg-blue-500 hover:text-white"
                    onClick={() => rename(folder)}
                  >
                    Rename
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 rounded-lg hover:bg-blue-500 hover:text-white"
                    onClick={() => deleteFolder(folder)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileCards;

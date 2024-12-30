import React, { useState } from "react";
import {
  FolderIcon,
  DocumentIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

const RecentFiles = () => {
  const [dropdownIndex, setDropdownIndex] = useState(null);

  // Example file data
  const files = [
    {
      name: "User Research",
      size: "2MB",
      modified: "3/9/19, 2:40PM",
      label: "Project",
      labelColor: "bg-yellow-100 text-yellow-700",
      members: ["A", "B"],
      type: "folder",
    },
    {
      name: "Design Thinking Project",
      size: "10MB",
      modified: "3/9/19, 2:40PM",
      label: "Software",
      labelColor: "bg-purple-100 text-purple-700",
      members: ["C", "D"],
      type: "folder",
    },
    {
      name: "Meeting-notes.doc",
      size: "139KB",
      modified: "3/9/19, 2:40PM",
      label: "Public",
      labelColor: "bg-blue-100 text-blue-700",
      members: ["E", "F", "G", "H", "I"],
      type: "document",
    },
    {
      name: "Sitemap.png",
      size: "810KB",
      modified: "3/9/19, 2:40PM",
      label: "Social Media",
      labelColor: "bg-green-100 text-green-700",
      members: ["J", "K"],
      type: "image",
    },
    {
      name: "Analytics.pdf",
      size: "10KB",
      modified: "3/9/19, 2:40PM",
      label: "Design",
      labelColor: "bg-pink-100 text-pink-700",
      members: ["L"],
      type: "document",
    },
  ];

  const handleDropdown = (index) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  return (
    <div className="p-2 bg-gray-50">
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
                <th className="px-6 py-3 text-sm font-medium text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">
                  Size
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">
                  Modified
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">
                  Label
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500">
                  Members
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr
                  key={index}
                  className="transition-colors border-b hover:bg-gray-50"
                >
                  <td className="flex items-center px-6 py-4 space-x-3">
                    {file.type === "folder" ? (
                      <FolderIcon className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <DocumentIcon className="w-5 h-5 text-gray-400" />
                    )}
                    <span>{file.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {file.size}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {file.modified}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${file.labelColor}`}
                    >
                      {file.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {file.members.slice(0, 3).map((member, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 border-2 border-white rounded-full"
                        >
                          {member}
                        </div>
                      ))}
                      {file.members.length > 3 && (
                        <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-gray-400 border-2 border-white rounded-full">
                          +{file.members.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="relative px-6 py-4 text-right">
                    <EllipsisVerticalIcon
                      className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
                      onClick={() => handleDropdown(index)}
                    />
                    {dropdownIndex === index && (
                      <div className="absolute right-0 z-10 w-48 mt-2 bg-white border rounded-lg shadow-lg">
                        <button
                          className="w-full px-4 py-2 text-sm text-left text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => alert(`View Details for ${file.name}`)}
                        >
                          View Details
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => alert(`Share ${file.name}`)}
                        >
                          Share
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => alert(`Download ${file.name}`)}
                        >
                          Download
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => alert(`Rename ${file.name}`)}
                        >
                          Rename
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                          onClick={() => alert(`Delete ${file.name}`)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentFiles;

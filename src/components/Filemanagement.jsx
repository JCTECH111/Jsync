import React, { useState } from "react";

const FileManagement = () => {
  const [activeFolder, setActiveFolder] = useState("Documents");
  const [dropdownVisible, setDropdownVisible] = useState(null); // To track which file dropdown is open

  const folders = [
    { name: "Backups", descendants: [] },
    { name: "Documents", descendants: ["Design Files", "Important Documents"] },
    { name: "Music", descendants: [] },
    { name: "Pictures", descendants: [] },
    { name: "Downloads", descendants: [] },
  ];

  const files = [
    { id: 1, name: "Design Thinking Project", size: "550 KB", modified: "3/9/19, 2:40 PM", label: "Design", members: 3 },
    { id: 2, name: "Important Documents", size: "590 KB", modified: "3/9/19, 2:40 PM", label: null, members: 4 },
    { id: 3, name: "Meeting-notes.doc", size: "139 KB", modified: "3/9/19, 2:40 PM", label: "Public", members: 5 },
    { id: 4, name: "User Research", size: "250 KB", modified: "3/9/19, 2:40 PM", label: null, members: 2 },
  ];

  // Toggle dropdown for each file
  const toggleDropdown = (id) => {
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 lg:flex-row">
      {/* Sidebar */}
      <aside className="p-4 bg-white shadow-md lg:w-1/4">
        <h2 className="mb-4 text-xl font-bold text-gray-700">My Folders</h2>
        <ul className="space-y-2">
          {folders.map((folder, index) => (
            <li key={index}>
              <button
                className={`flex items-center w-full text-left ${
                  activeFolder === folder.name ? "text-blue-500" : "text-gray-700"
                }`}
                onClick={() => setActiveFolder(folder.name)}
              >
                <svg
                  className={`h-5 w-5 ${
                    activeFolder === folder.name ? "text-blue-500" : "text-gray-500"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z"
                  />
                </svg>
                <span className="ml-2 font-medium">{folder.name}</span>
              </button>
              {folder.descendants.length > 0 && activeFolder === folder.name && (
                <ul className="pl-6 mt-2 space-y-1">
                  {folder.descendants.map((descendant, i) => (
                    <li key={i}>
                      <button className="flex items-center w-full text-left">
                        <svg
                          className="w-5 h-5 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 8v12a2 2 0 002 2h12a2 2 0 002-2V8M16 3h-4M12 3v5"
                          />
                        </svg>
                        <span className="ml-2 text-gray-700">{descendant}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* File Management Section */}
      <main className="flex-1 p-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-700">Documents</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-white bg-blue-500 rounded shadow">Add</button>
            <button className="px-4 py-2 bg-gray-200 rounded shadow">Tags</button>
            <button className="px-4 py-2 bg-gray-200 rounded shadow">Sort</button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="text-left bg-gray-200">
                <th className="px-4 py-2 font-medium text-gray-500">Name</th>
                <th className="px-4 py-2 font-medium text-gray-500">Size</th>
                <th className="px-4 py-2 font-medium text-gray-500">Modified</th>
                <th className="px-4 py-2 font-medium text-gray-500">Label</th>
                <th className="px-4 py-2 font-medium text-gray-500">Members</th>
                <th className="px-4 py-2 font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr
                  key={file.id}
                  className="border-b hover:bg-gray-100 last:border-none"
                >
                  <td className="px-4 py-2 text-gray-600">{file.name}</td>
                  <td className="px-4 py-2 text-gray-600">{file.size}</td>
                  <td className="px-4 py-2 text-gray-600">{file.modified}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {file.label ? (
                      <span className="px-2 py-1 text-sm text-white bg-blue-500 rounded">
                        {file.label}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{file.members} members</td>
                  <td className="relative px-4 py-2">
                    <button
                      onClick={() => toggleDropdown(file.id)}
                      className="p-2 rounded-full hover:bg-gray-200"
                    >
                      <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 12h.01M12 12h.01M18 12h.01"
                        />
                      </svg>
                    </button>
                    {dropdownVisible === file.id && (
                      <div className="absolute right-0 z-10 w-40 mt-2 bg-white border rounded shadow-lg">
                        <button className="block w-full px-4 py-2 text-left text-gray-700 rounded-lg hover:text-white hover:bg-blue-600">
                          View
                        </button>
                        <button className="block w-full px-4 py-2 text-left text-gray-700 rounded-lg hover:text-white hover:bg-blue-600">
                          Edit
                        </button>
                        <button className="block w-full px-4 py-2 text-left text-gray-700 rounded-lg hover:text-white hover:bg-blue-600">
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
      </main>
    </div>
  );
};

export default FileManagement;

// https://chatgpt.com/c/676eaff6-ca4c-800f-8e4a-706bae19dcdd           for creating folder backend
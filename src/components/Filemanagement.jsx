import React, { useState } from "react";

const FileManagement = () => {
  const [openFolders, setOpenFolders] = useState({}); // Tracks open/closed state of folders
  const [dropdownVisible, setDropdownVisible] = useState(null); // To track which file dropdown is open

  const folderStructure = [
    {
      id: 1,
      name: "Backups",
      parent: null,
      children: [],
    },
    {
      id: 2,
      name: "Documents",
      parent: null,
      children: [
        {
          id: 3,
          name: "Design Files",
          parent: 2,
          children: [
            { id: 7, name: "UI Mockups", parent: 3, children: [] },
            { id: 8, name: "Wireframes", parent: 3, children: [] },
          ],
        },
        {
          id: 4,
          name: "Important Documents",
          parent: 2,
          children: [],
        },
      ],
    },
    {
      id: 5,
      name: "Music",
      parent: null,
      children: [],
    },
    {
      id: 6,
      name: "Pictures",
      parent: null,
      children: [],
    },
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

  const toggleFolder = (id) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderFolder = (folder) => {
    const isOpen = openFolders[folder.id];
    return (
      <li key={folder.id}>
        <button
          className="flex items-center w-full p-2 text-left rounded hover:bg-gray-100"
          onClick={() => toggleFolder(folder.id)}
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
          <span className="ml-2 font-medium text-gray-700">{folder.name}</span>
        </button>
        {isOpen && folder.children.length > 0 && (
          <ul className="pl-4 mt-2 ml-6 space-y-1 border-l">
            {folder.children.map((child) => renderFolder(child))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 lg:flex-row">
      {/* Sidebar */}
      <aside className="p-4 bg-white shadow-md lg:w-1/4">
        <h2 className="mb-4 text-xl font-bold text-gray-700">My Folders</h2>
        <ul className="space-y-2">
          {folderStructure
            .filter((folder) => folder.parent === null)
            .map((folder) => renderFolder(folder))}
        </ul>
      </aside>

      {/* Main Section */}
      <main className="flex-1 p-4">
        <h2 className="text-xl font-bold text-gray-700">Folder Contents</h2>
        <div className="p-4 mt-4 bg-white rounded-lg shadow">
          <p>Select a folder to view its contents.</p>
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
{/* <main className="flex-1 p-2">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-bold text-gray-700">Documents</h2>
    <div className="flex gap-2">
      <button className="px-4 py-2 text-white bg-blue-500 rounded shadow">Add</button>
      <button className="px-4 py-2 bg-gray-200 rounded shadow">Tags</button>
      <button className="px-4 py-2 bg-gray-200 rounded shadow">Sort</button>
    </div>
  </div>

  
</main> */}
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useFetchFolders } from "../lib/fetchFolders";
import { FolderIcon, FolderOpenIcon, PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteDocumentFromDatabase } from "../lib/deleteDocument";

const FolderComponent = () => {
    const fetchedFolders = useFetchFolders(); // Use the custom hook
    const [folders, setFolders] = useState([ ]);
    const [activeParentFolderId, setActiveParentFolderId] = useState(null); // Tracks the clicked parent folder
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(""); // "create" or "rename"
    const [selectedFolder, setSelectedFolder] = useState(null); // Folder being renamed
    const folderCollectionId = import.meta.env.VITE_APPWRITE_FOLDERS_ID;
  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID
    

    useEffect(() => {
        if (fetchedFolders) {
            setFolders(fetchedFolders);
        } else {
            // showErrorMessage("no folder found")
        }
    }, [fetchedFolders]);

    const handleCreateFolder = (folderName, parentFolderId = null) => {
        const newFolder = {
            $id: Date.now(),
            folderName: folderName,
            parentFolderId: parentFolderId,
        };
        setFolders([...folders, newFolder]);
        setIsModalOpen(false);
    };

    const handleRenameFolder = (folderId, newName) => {
        const updatedFolders = folders.map((folder) =>
            folder.$id === folderId ? { ...folder, folderName: newName } : folder
        );
        setFolders(updatedFolders);
        setIsModalOpen(false);
    };

    const handleDeleteFolder = async (folderId) => {
        const folder = folders.find((folder) => folder.$id === folderId);
        const folderName = folder?.folderName || "this folder";
    
        // Display the confirmation dialog
        Swal.fire({
            title: `Delete "${folderName}"?`,
            text: "Deleting this folder will also delete all its subfolders and contents. This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Call the delete function and await its completion
                    await deleteDocumentFromDatabase(databaseId, folderCollectionId, folderId);
    
                    // Optionally, update the folders state to reflect deletion
                    setFolders((prev) =>
                        prev.filter((currentFolder) => currentFolder.$id !== folderId)
                    );
    
                    // Notify the user of successful deletion
                    Swal.fire(
                        "Deleted!",
                        `The folder "${folderName}" and all its subfolders have been deleted.`,
                        "success"
                    );
                } catch (error) {
                    // Notify the user if an error occurs
                    Swal.fire(
                        "Error",
                        `An error occurred while deleting "${folderName}". Please try again.`,
                        "error"
                    );
                    console.error("Error deleting folder:", error);
                }
            }
        });
    };
    


    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Folders</h3>
            <div className="flex flex-wrap gap-3 items-center mb-4">
                <button
                    onClick={() => {
                        setModalAction("create");
                        setIsModalOpen(true);
                        setSelectedFolder(null);
                    }}
                    className="flex items-center px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create Folder
                </button>
                <button
                    onClick={() => {
                        setModalAction("rename");
                        setIsModalOpen(true);
                    }}
                    disabled={!selectedFolder}
                    className="flex items-center px-3 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600 disabled:opacity-50"
                >
                    <PencilIcon className="w-5 h-5 mr-2" />
                    Rename Folder
                </button>
                <button
                    onClick={() => handleDeleteFolder(selectedFolder?.$id)}
                    disabled={!selectedFolder}
                    className="flex items-center px-3 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:opacity-50"
                >
                    <TrashIcon className="w-5 h-5 mr-2" />
                    Delete Folder
                </button>
            </div>

            <div className="mt-4 space-y-2">
                {folders
                    .filter((folder) => folder.parentFolderId === null)
                    .map((folder) => (
                        <div key={folder.$id} className="border-b pb-2">
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={() => {
                                    setActiveParentFolderId(activeParentFolderId === folder.$id ? null : folder.$id);
                                    setSelectedFolder(folder);
                                }}
                            >

                                {activeParentFolderId === folder.$id ? (
                                    <FolderOpenIcon className="w-6 h-6 text-blue-500 mr-2" />
                                ) : (
                                    <FolderIcon className="w-6 h-6 text-gray-500 mr-2" />
                                )}
                                <span className="text-gray-700">{folder.folderName}</span>
                            </div>

                            {activeParentFolderId === folder.$id && (
                                <div className="ml-8 mt-2 space-y-1">
                                    {folders
                                        .filter((child) => child.parentFolderId === folder.$id)
                                        .map((child) => (
                                            <div
                                                key={child.$id}
                                                onClick={() => setSelectedFolder(child)}
                                                className="flex items-center cursor-pointer hover:bg-gray-200 rounded px-2 py-1"
                                            >
                                                <FolderIcon className="w-5 h-5 text-gray-400 mr-2" />
                                                <span className="text-gray-600">{child.folderName}</span>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md w-80">
                        <h3 className="text-lg font-semibold mb-4">
                            {modalAction === "create" ? "Create Folder" : "Rename Folder"}
                        </h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const folderName = formData.get("folderName");
                                if (modalAction === "create") {
                                    handleCreateFolder(folderName, activeParentFolderId);
                                } else if (modalAction === "rename") {
                                    handleRenameFolder(selectedFolder.$id, folderName);
                                }
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="font-medium text-gray-600">Folder Name</label>
                                <input
                                    type="text"
                                    name="folderName"
                                    className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    defaultValue={selectedFolder?.folderName || ""}
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                >
                                    {modalAction === "create" ? "Create" : "Rename"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="ml-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FolderComponent;

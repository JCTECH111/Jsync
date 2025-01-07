import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Databases, Query } from "appwrite";
import { client } from "./appwrite";

export const useFetchFileCounts = (folders) => {
    const DatabaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const filesCollectionId = import.meta.env.VITE_APPWRITE_FILES_ID;
    const [folderFileCounts, setFolderFileCounts] = useState([]);

    useEffect(() => {
        const fetchFileCounts = async () => {
            if (!DatabaseId || !filesCollectionId) {
                toast.error("Database or files collection ID is missing in environment variables.");
                return;
            }
            if (!folders || folders.length === 0) {
                setFolderFileCounts([]); // No folders, no counts
                return;
            }

            const databases = new Databases(client);
            try {
                const counts = await Promise.all(
                    folders.map(async (folder) => {
                        const response = await databases.listDocuments(
                            DatabaseId,
                            filesCollectionId,
                            [Query.equal("folderId", folder.$id)] // Assuming 'folderId' is the key in the files collection
                        );
                        return {
                            folderName: folder.folderName, // Assuming 'name' is the folder's title
                            count: response.total // 'total' gives the count of matching documents
                        };
                    })
                );
                setFolderFileCounts(counts);
            } catch (error) {
                toast.error("Failed to fetch file counts.");
                console.error("Error fetching file counts:", error);
                setFolderFileCounts([]);
            }
        };

        fetchFileCounts();
    }, [folders, DatabaseId, filesCollectionId]);

    return folderFileCounts;
};

import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { Databases, Storage, Query } from "appwrite";
import { client } from "./appwrite";
import { AuthContext } from '../context/AuthContext';

export const useFetchFiles = () => {
    const DatabaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const filesCollectionId = import.meta.env.VITE_APPWRITE_FILES_ID;
    const fileBucketID = import.meta.env.VITE_APPWRITE_BUCKET_USERS_UPLOAD_DOCUMENT;
    const [files, setFiles] = useState([]);
    const { userId } = useContext(AuthContext);
    const storedUser = userId;

    useEffect(() => {
        const fetchFiles = async () => {
            if (!storedUser) {
                toast.error("User ID is missing.");
                return;
            }
            if (!DatabaseId || !filesCollectionId) {
                toast.error("Database or bucket ID is missing in environment variables.");
                return;
            }

            const databases = new Databases(client);
            const storage = new Storage(client);

            try {
                // Step 1: Fetch file metadata from the database using userId
                const response = await databases.listDocuments(
                    DatabaseId, // Your database ID
                    filesCollectionId, // The collection that holds file metadata
                    [Query.equal("ownerId", storedUser)] // Filter by userId
                );

                if (response.documents.length === 0) {
                    console.warn("No file metadata found for the user.");
                    setFiles([]); // Return an empty array if no metadata is found
                } else {
                    // Step 2: Get file metadata IDs
                    const fileIds = response.documents.map(doc => doc.fileId);
                    console.log("Fetched file IDs:", fileIds);

                    // Step 3: Fetch the actual files from the storage using the fileIds
                    const fileResponses = await Promise.all(
                        fileIds.map(async (fileId) => {
                            const fileMetadata = response.documents.find(doc => doc.fileId === fileId); // Find the metadata for the current file
                            if (!fileMetadata) return null; // If metadata is not found for the fileId, skip

                            // Fetch the actual file from storage
                            const file = await storage.getFile(fileBucketID, fileId);

                            // Merge the metadata with the file data
                            return {
                                ...fileMetadata,
                                file, // Adding the actual file data
                            };
                        })
                    );

                    // Step 4: Filter out null responses (invalid file metadata or file fetch failures) and set the files
                    const validFiles = fileResponses.filter(file => file !== null);
                    setFiles(validFiles);
                    console.log("Files with metadata:", validFiles);
                }
            } catch (error) {
                toast.error("Network error: Failed to load files.");
                console.error("Error fetching files:", error);
                setFiles([]); // Ensure an empty array is set on error
            }
        };

        fetchFiles();
    }, [storedUser, fileBucketID, DatabaseId, filesCollectionId]);

    return files;
};

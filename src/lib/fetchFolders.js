import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { Databases, Query } from "appwrite";
import { client,  } from "./appwrite";
import { AuthContext } from '../context/AuthContext';

export const useFetchFolders = () => {
    const DatabaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID
    const folderCollectionId = import.meta.env.VITE_APPWRITE_FOLDERS_ID
    const [folders, setFolders] = useState([]);
    const { userId} = useContext(AuthContext);
    const storedUser = userId  ;

    useEffect(() => {
        const fetchFolders = async () => {
            if (!storedUser) {
                toast.error("User ID is missing in local storage.");
                return;
            }
            if (!DatabaseId || !folderCollectionId) {
                toast.error("Database or collection ID is missing in environment variables.");
                return;
            }
            const databases = new Databases(client);

            try {
                // Fetch folders where 'ownerId' matches the stored user's ID
                const response = await databases.listDocuments(
                    DatabaseId,  // Replace with your database ID
                    folderCollectionId, // Replace with your collection ID
                    [Query.equal("ownerId", storedUser)]
                );
                
                if (response.documents.length === 0) {
                    toast.error("No folders found for the user.");
                    setFolders([]); // Return an empty array if no folders are found
                } else {
                    setFolders(response.documents);
                }
                console.log("Querying with ownerId:", storedUser);
            } catch (error) {
                toast.error("Network error: Failed to load folders.");
                console.error("Error fetching folders:", error);
                setFolders([]);
            }
        };

        fetchFolders();
    }, [DatabaseId, folderCollectionId, storedUser]);

    return folders;
};

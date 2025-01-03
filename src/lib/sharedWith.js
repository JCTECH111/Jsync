import { Databases } from 'appwrite';
import { client } from './appwrite';

const databases = new Databases(client);
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const fileMetadataCollectionID = import.meta.env.VITE_APPWRITE_FILE_METADATA_ID;

export const addSharedUser = async (fileMetadataId, newUserId) => {
    try {
        // Fetch the existing document
        const document = await databases.getDocument(databaseId, fileMetadataCollectionID, fileMetadataId);

        // Get the current sharedWith array and add the new user ID
        const updatedSharedWith = [...document.sharedWith, newUserId];

        // Update the document with the new sharedWith array
        const response = await databases.updateDocument(
            databaseId,
            fileMetadataCollectionID,
            fileMetadataId,
            { sharedWith: updatedSharedWith } // Update only the sharedWith field
        );

        console.log('User added to sharedWith:', response);
        return response;
    } catch (error) {
        console.error('Error adding user to sharedWith:', error.message);
        throw error;
    }
};

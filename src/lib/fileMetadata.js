import { Databases, Permission, Role } from 'appwrite';
import { client } from './appwrite';

const databases = new Databases(client);
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const fileMetadataCollectionID = import.meta.env.VITE_APPWRITE_FILE_METADATA_ID;

export const createFileMetadata = async (fileMetadataId, isShared, sharedWith, tags) => {
    try {
        
        // Validate required parameters
        if (!fileMetadataId || !description) {
            throw new Error('fileMetadataId and description are required.');
        }

        // Prepare the document data
        const data = {
            fileMetadataId,
            isShared: isShared || false, // Default to false if not provided
            sharedWith: sharedWith || [], // Default to empty array if not provided
            tags: tags || [], // Default to empty array if not provided
        };

        // Create the document in Appwrite
        const response = await databases.createDocument(
            databaseId,
            fileMetadataCollectionID,
            fileMetadataId, // Unique document ID
            data,
            [
                Permission.read(Role.any()), // Public read access
                Permission.update(Role.users()), // Authenticated users can update
                Permission.delete(Role.users()), // Authenticated users can delete
            ]
        );

        console.log('File metadata document created:', response);
        return response;
    } catch (error) {
        console.error('Error creating file metadata document:', error.message, error.stack);
        throw error;
    }
};

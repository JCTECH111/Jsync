import { Databases, Permission, Role } from 'appwrite';
import { client } from './appwrite';

const databases = new Databases(client);
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const userFileCollectionID = import.meta.env.VITE_APPWRITE_FILES_ID;

/**
 * Function to create a metadata document for a file in Appwrite database.
 *
 * @param {string} fileId - Unique ID of the file.
 * @param {string} fileName - Name of the file.
 * @param {string} fileType - MIME type of the file.
 * @param {string} fileSize - Size of the file in bytes.
 * @param {string} createdAt - Timestamp when the file was created.
 * @param {string} updatedAt - Timestamp when the file was last updated.
 * @param {string} ownerId - ID of the user who owns the file.
 * @param {string} folderId - ID of the folder where the file is stored.
 * @param {boolean} isPublic - Whether the file is publicly accessible.
 * @returns {Promise<Object>} - The response from Appwrite's createDocument method.
 */
export const createFileContent = async (
    fileId,
    fileName,
    fileType,
    createdAt,
    updatedAt,
    ownerId,
    folderId,
    isPublic,
    Label,
    fileSize,
) => {
    try {
        // Validate inputs
        if (!fileId || !fileName || !fileType || !fileSize || !createdAt || !updatedAt || !ownerId) {
            throw new Error('Missing required parameters for creating file metadata.');
        }

        // Prepare the data object
        const data = {
            fileId,
            fileName,
            fileType,
            createdAt,
            updatedAt,
            ownerId,
            folderId,
            isPublic,
            Label,
            fileSize,
        };

        // Define permissions
        const permissions = isPublic
            ? [
                  Permission.read(Role.any()), // Public read access
                  Permission.update(Role.users()), // Authenticated users can update
                  Permission.delete(Role.users()), // Authenticated users can delete
              ]
            : [
                  Permission.read(Role.users()), // Only authenticated users can read
                  Permission.update(Role.users()), // Authenticated users can update
                  Permission.delete(Role.users()), // Authenticated users can delete
              ];

        // Create the document in the database
        const response = await databases.createDocument(
            databaseId,
            userFileCollectionID,
            fileId, // Use fileId as the unique document ID
            data,
            permissions
        );

        console.log('File metadata created successfully:', response);
        return response;
    } catch (error) {
        console.error('Error creating file metadata:', error.message);
        throw error; // Re-throw the error for further handling
    }
};

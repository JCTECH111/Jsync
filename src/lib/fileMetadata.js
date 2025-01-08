import { Databases, Permission, Role } from 'appwrite';
import { client } from './appwrite';

const databases = new Databases(client);
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const fileMetadataCollectionID = import.meta.env.VITE_APPWRITE_FILE_METADATA_ID;

/**
 * Create a new file metadata document.
 */
export const createFileMetadata = async (fileMetadataId, tags = []) => {
  try {
    if (!fileMetadataId) {
      throw new Error('fileMetadataId is required.');
    }

    // Document data
    const data = {
      fileMetadataId,
      isShared: false, // Default to false
      sharedWith: [], // Empty array on creation
      tags, // Tags can be provided or default to empty
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
    console.error('Error creating file metadata document:', error.message);
    throw error;
  }
};

/**
 * Update the file metadata when sharing.
 */
export const updateFileMetadataForSharing = async (fileMetadataId, sharedWithProfiles, isExternal = false) => {
  try {
    if (!fileMetadataId) {
      throw new Error('fileMetadataId is required.');
    }

    // Fetch the current document
    const document = await databases.getDocument(databaseId, fileMetadataCollectionID, fileMetadataId);

    // Prepare the updated data
    const updatedData = {
      ...document,
      isShared: true,
      sharedWith: isExternal
        ? [...document.sharedWith, 'externalUserIcon'] // Add generic icon for external users
        : [...document.sharedWith, ...sharedWithProfiles], // Add profile pictures for internal users
    };

    // Update the document
    const response = await databases.updateDocument(
      databaseId,
      fileMetadataCollectionID,
      fileMetadataId,
      updatedData
    );

    console.log('File metadata updated for sharing:', response);
    return response;
  } catch (error) {
    console.error('Error updating file metadata for sharing:', error.message);
    throw error;
  }
};

import { client, ID } from "./appwrite";
import { Databases } from "appwrite";

const databases = new Databases(client);

/**
 * Creates a new folder in the Appwrite database.
 * 
 * @param {string} databaseId - The ID of the Appwrite database.
 * @param {string} collectionId - The ID of the Appwrite collection where folders are stored.
 * @param {string} ownerId - The ID of the owner of the folder.
 * @param {string} folderName - The name of the folder to be created.
 * @param {string|null} parentFolderId - The ID of the parent folder (null for root folders).
 * 
 * @returns {Promise<object>} - The created folder document.
 */
export const createFolderInDatabase = async (databaseId, collectionId, ownerId, folderName, createdAt, updatedAt, parentFolderId = null) => {
  try {
    
    const folderData = {
      ownerId,
      folderName,
      createdAt,
      updatedAt,
      parentFolderId, // Set to null for root folders
    };

    const response = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(), // Automatically generate a unique ID
      folderData
    );

    console.log("Folder created successfully:", response);
    return response;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error; // Rethrow error to handle in the calling function
  }
};

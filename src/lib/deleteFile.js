import { client } from "./appwrite";
import { Storage, Databases } from "appwrite";

const storage = new Storage(client);
const databases = new Databases(client);

export const deleteFileWithMetadata = async (bucketId, fileId, databaseId, collectionId) => {
  try {
    // Delete the file from Appwrite Storage
    await storage.deleteFile(bucketId, fileId);

    // Delete the file metadata from Appwrite Database
    await databases.deleteDocument(databaseId, collectionId, fileId);

    console.log(`File ${fileId} deleted successfully from storage and database.`);
  } catch (error) {
    console.error("Failed to delete file or metadata:", error);
    throw error; // Re-throw error to handle in `handleDelete`
  }
};

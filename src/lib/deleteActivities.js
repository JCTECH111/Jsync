import { client } from "./appwrite";
import {  Databases } from "appwrite";
const databases = new Databases(client);

export const deleteDocumentFromDatabase = async (  databaseId, collectionId, fileId) => {
  try {

    // Delete the file metadata from Appwrite Database
    await databases.deleteDocument(databaseId, collectionId, fileId);

    console.log(`File ${fileId} deleted successfully from  database.`);
  } catch (error) {
    console.error("Failed to delete file or metadata:", error);
    throw error; // Re-throw error to handle in `handleDelete`
  }
};

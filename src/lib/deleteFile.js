import { client } from "./appwrite";
import { Storage, Databases } from "appwrite";
import getCurrentDate from "../components/currentDate";
const time = getCurrentDate()
import { saveActivity } from "./saveActivity";

const storage = new Storage(client);
const databases = new Databases(client);

export const deleteFileWithMetadata = async (bucketId, fileId, databaseId, collectionId, userId) => {
  try {
    // Delete the file from Appwrite Storage
    await storage.deleteFile(bucketId, fileId);

    // Delete the file metadata from Appwrite Database
    await databases.deleteDocument(databaseId, collectionId, fileId);
    const activity = {
      ownerId:userId ,
      type: "delete",
      message: "You deleted a file",
      timeStamp: time
    };
    
    saveActivity(activity);

    console.log(`File ${fileId} deleted successfully from storage and database.`);
  } catch (error) {
    console.error("Failed to delete file or metadata:", error);
    throw error; // Re-throw error to handle in `handleDelete`
  }
};

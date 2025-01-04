import { client } from "./appwrite";
import { Storage } from "appwrite";

const storage = new Storage(client);

export const deleteFile = async (bucketId, fileId) => {
  try {
    await storage.deleteFile(bucketId, fileId); // Call Appwrite's delete API
  } catch (error) {
    console.error("Failed to delete file:", error);
    throw error; // Re-throw error to handle in `handleDelete`
  }
};

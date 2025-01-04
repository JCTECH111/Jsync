import { client } from "./appwrite";
import { Storage } from "appwrite";

const storage = new Storage(client);

export const viewUrl = async (bucketId, fileId) => {
  try {
    // Get the file view URL directly
    const url = await storage.getFileView(bucketId, fileId);
    return url; // `url` is a string containing the view URL
  } catch (error) {
    console.error("Failed to fetch the view URL:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

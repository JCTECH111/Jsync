import { client } from "./appwrite";
import { Storage } from "appwrite";

const storage = new Storage(client);

export const downloadUrl = async (bucketId, fileId) => {
  try {
    // Await the API call and return the resulting URL
    const result = await storage.getFileDownload(bucketId, fileId);
    return result.href; // `result.href` contains the download URL
  } catch (error) {
    console.error("Failed to fetch the download URL:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

import { ID, Databases } from "appwrite";
import { client } from "../lib/appwrite";

const databases = new Databases(client);
const generateShareLink = async (fileId, metadata) => {
  try {
    const uniqueID = ID.unique(); // Generate a unique ID
    const response = await databases.createDocument(
      "databaseId", // Replace with your Appwrite database ID
      "collectionId", // Replace with your Appwrite collection ID
      uniqueID,
      {
        fileId,
        metadata,
        shared: true, // Optional flag for public files
      }
    );

    return `https://your-domain.com/view/${uniqueID}`;
  } catch (error) {
    console.error("Error generating share link:", error);
    return null;
  }
};

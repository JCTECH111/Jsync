import { Databases, Query } from "appwrite";
import { client } from "./appwrite"; // Your Appwrite client configuration

const databases = new Databases(client);
const databaseId =import.meta.env.VITE_APPWRITE_DATABASE_ID; // Replace with your database ID
const collectionId = import.meta.env.VITE_APPWRITE_CHART_OVERVIEW_DOCUMENT_ID; // cOLLECTION ID

/**
 * Updates the uploads or downloads for a specific user and month.
 *
 * @param {string} ownerId - The user ID.
 * @param {string} month - The month of activity (e.g., "Jan").
 * @param {string} type - Either "uploads" or "downloads".
 * @param {number} count - The number to increment.
 * @param {number} year - The year of activity (e.g., 2025).
 */
export const updateUserActivity = async (ownerId, month, year, type, count = 1) => {
  try {
    // Search for existing document
    const existingDocument = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("ownerId", ownerId),
      Query.equal("month", month),
      Query.equal("year", year),
    ]);

    if (existingDocument.documents.length > 0) {
      // If document exists, update it
      const documentId = existingDocument.documents[0].$id;
      const updatedData = {
        updatedAt: new Date().toISOString(),
      };

      if (type === "uploads") {
        updatedData.totalUploads = existingDocument.documents[0].totalUploads + count;
      } else if (type === "downloads") {
        updatedData.totalDownloads = existingDocument.documents[0].totalDownloads + count;
      }

      const response = await databases.updateDocument(databaseId, collectionId, documentId, updatedData);
      console.log("Activity updated:", response);
    } else {
      // If document does not exist, create a new one
      const newActivity = {
        ownerId,
        month,
        totalUploads: type === "uploads" ? count : 0,
        totalDownloads: type === "downloads" ? count : 0,
        updatedAt: new Date().toISOString(),
        year,
      };

      const response = await databases.createDocument(databaseId, collectionId, "unique()", newActivity);
      console.log("New activity created:", response);
    }
  } catch (error) {
    console.error("Error updating user activity:", error);
    throw error;
  }
};

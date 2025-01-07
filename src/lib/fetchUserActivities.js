import { client } from "./appwrite";
import { Databases, Query } from "appwrite";

const databases = new Databases(client);

/**
 * Fetches user activity data for a specific year.
 * @param {string} databaseId - The Appwrite database ID.
 * @param {string} collectionId - The Appwrite collection ID for user activities.
 * @param {string} userId - The user ID.
 * @param {number} year - The year for which to fetch activity data.
 * @returns {Promise<object[]>} - An array of user activity objects.
 */
export const fetchUserActivities = async (databaseId, collectionId, userId, year) => {
  try {
    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("ownerId", userId),
      Query.equal("year", year),
    ]);
    return response.documents; // The list of documents
  } catch (error) {
    console.error("Error fetching user activities:", error);
    throw error;
  }
};

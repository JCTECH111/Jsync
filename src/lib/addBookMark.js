import { Databases, ID } from "appwrite";
import { client } from "./appwrite";
import getCurrentDate from "../components/currentDate";

const databases = new Databases(client);
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const bookmarksCollectionID = import.meta.env.VITE_APPWRITE_BOOKMARK_ID;

/**
 * Function to add a bookmark
 * @param {string} fileId - The ID of the file being bookmarked.
 * @param {string} userId - The ID of the user adding the bookmark.
 * @param {string} notes - Notes associated with the bookmark.
 * @returns {Promise<void>} - Resolves when the bookmark is added successfully.
 * @throws {Error} - Throws an error if the bookmark cannot be added.
 */
export const addBookmark = async (fileId, userId, notes, bookMarkId) => {
 

  try {
    // Generate a unique bookmark ID
    const timestamp = getCurrentDate();

    // Add the bookmark to the database
    await databases.createDocument(
      databaseId,
      bookmarksCollectionID,
      bookMarkId, // Unique bookmark ID
      {
          timestamp,
          notes,
          userId,
          fileId,
      }
    );

    console.log("Bookmark added successfully!");
  } catch (error) {
    console.error("Error adding bookmark:", error);
    throw new Error("Failed to add bookmark.");
  }
};

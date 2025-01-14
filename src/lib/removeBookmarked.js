import { Databases, Query } from "appwrite";
import { client } from "./appwrite";

const databases = new Databases(client);
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const bookmarksCollectionID = import.meta.env.VITE_APPWRITE_BOOKMARK_ID;

export const removeBookmarked = async (bookmarkId) => {
  try {
    // Step 1: Find the document with the given `fileId`
    const response = await databases.listDocuments(databaseId, bookmarksCollectionID, [
      Query.equal("fileId", bookmarkId),
    ]);

    if (response.documents.length === 0) {
      console.warn(`No bookmark found with fileId ${bookmarkId}.`);
      alert("No bookmark found to remove.");
      return;
    }

    // Step 2: Get the document ID and delete it
    const documentId = response.documents[0].$id;

    await databases.deleteDocument(databaseId, bookmarksCollectionID, documentId);
    console.log(`Bookmark with ID ${bookmarkId} removed successfully.`);
  } catch (error) {
    console.error(`Failed to remove bookmark with ID ${bookmarkId}:`, error);
  }
};

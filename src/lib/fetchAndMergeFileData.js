import { Databases, Query } from "appwrite";
import { client } from "./appwrite";

const databases = new Databases(client);
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const filesCollectionID = import.meta.env.VITE_APPWRITE_FILES_ID;
const fileMetadataCollectionID = import.meta.env.VITE_APPWRITE_FILE_METADATA_ID;

export const getUserFilesWithMetadata = async (userId) => {
  try {
    // Step 1: Fetch files for the user
    const filesResponse = await databases.listDocuments(
      databaseId,
      filesCollectionID,
      [Query.equal("ownerId", userId)] // Filter files by ownerId
    );
    const files = filesResponse.documents;

    if (files.length === 0) {
      console.warn("No files found for the user.");
      return []; // Return early if no files found
    }

    // Step 2: Fetch metadata for each file
    const filesWithMetadata = await Promise.all(
      files.map(async (file) => {
        try {
          // Fetch metadata for the current file
          const metadataResponse = await databases.listDocuments(
            databaseId,
            fileMetadataCollectionID,
            [Query.equal("fileMetadataId", file.$id)] // Match metadata to file by fileId
          );

          const metadata = metadataResponse.documents[0] || {}; // Use the first metadata document or fallback to empty

          // Combine file data with its metadata
          return {
            ...file,
            metadata,
          };
        } catch (error) {
          console.error(`Error fetching metadata for file ${file.$id}:`, error);

          // Return the file with empty metadata on error
          return {
            ...file,
            metadata: {},
          };
        }
      })
    );

    return filesWithMetadata; // Return the combined file and metadata array
  } catch (error) {
    console.error("Error fetching files and metadata:", error);
    throw error;
  }
};

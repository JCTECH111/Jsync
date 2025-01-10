import { Databases, Query } from "appwrite";
import { client } from "./appwrite";

const databases = new Databases(client);
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const filesCollectionID = import.meta.env.VITE_APPWRITE_FILES_ID;
const fileMetadataCollectionID = import.meta.env.VITE_APPWRITE_FILE_METADATA_ID;
const userMetadataCollectionID = import.meta.env.VITE_APPWRITE_USER_METADATA_ID;

export const getFilesWithSearch = async (searchInput) => {
  try {
    // Step 1: Fetch all files
    const filesResponse = await databases.listDocuments(
      databaseId,
      filesCollectionID,
      [Query.equal("isPublic", true)]
    );
    const files = filesResponse.documents;

    if (files.length === 0) {
      console.warn("No files found.");
      return []; // Return early if no files found
    }

    // Step 2: Filter files based on the search input
    const filteredFiles = files.filter(
      (file) =>
        file.Label?.toLowerCase().includes(searchInput.toLowerCase()) ||
        file.fileName?.toLowerCase().includes(searchInput.toLowerCase()) ||
        file.fileType?.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (filteredFiles.length === 0) {
      console.warn("No matching files found for the search input.");
      return []; // Return early if no matches found
    }

    // Step 3: Fetch metadata and user data for each filtered file
    const filesWithMetadataAndUser = await Promise.all(
      filteredFiles.map(async (file) => {
        try {
          // Fetch metadata for the current file
          const metadataResponse = await databases.listDocuments(
            databaseId,
            fileMetadataCollectionID,
            [Query.equal("fileMetadataId", file.$id)] // Match metadata to file by fileId
          );

          const metadata = metadataResponse.documents[0] || {}; // Use the first metadata document or fallback to empty

          // Fetch user details based on ownerId
          let user = {};
          if (file.ownerId) {
            try {
              const userResponse = await databases.listDocuments(
                databaseId,
                userMetadataCollectionID,
                [Query.equal("userId", file.ownerId)] // Match userId in user metadata
              );
              const userDocument = userResponse.documents[0]; // Get the first user document
              if (userDocument) {
                user = {
                  username: userDocument.userName, // Use the correct field name for username
                };
              } else {
                user = { username: "Unknown User" }; // Fallback if no user document found
              }
            } catch (userError) {
              console.warn(`Unable to fetch user for ownerId ${file.ownerId}:`, userError);
              user = { username: "Unknown User" }; // Fallback if user fetch fails
            }
          }

          // Combine file data with its metadata and user
          return {
            ...file,
            metadata,
            user, // Add user data
          };
        } catch (error) {
          console.error(`Error processing file ${file.$id}:`, error);

          // Return the file with empty metadata and user on error
          return {
            ...file,
            metadata: {},
            user: { username: "Unknown User" },
          };
        }
      })
    );

    return filesWithMetadataAndUser; // Return the final array
  } catch (error) {
    console.error("Error fetching files, metadata, and user data:", error);
    throw error;
  }
};

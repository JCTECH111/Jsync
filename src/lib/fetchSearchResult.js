import { Databases, Query, Storage } from "appwrite";
import { client } from "./appwrite";

const databases = new Databases(client);
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const filesCollectionID = import.meta.env.VITE_APPWRITE_FILES_ID;
const fileMetadataCollectionID = import.meta.env.VITE_APPWRITE_FILE_METADATA_ID;
const userMetadataCollectionID = import.meta.env.VITE_APPWRITE_USER_METADATA_ID;
const bookmarksCollectionID = import.meta.env.VITE_APPWRITE_BOOKMARK_ID;
const userProfileImageId = import.meta.env.VITE_APPWRITE_BUCKET_USERS_AVATAR;

const storage = new Storage(client);

export const getFilesWithSearch = async (searchInput) => {
  console.log("Search Input:", searchInput);

  try {
    console.log("Step 1: Fetching public files...");
    const filesResponse = await databases.listDocuments(
      databaseId,
      filesCollectionID,
      [Query.equal("isPublic", true), Query.limit(50)] // Limit to 50 files per batch
    );

    const files = filesResponse.documents;
    console.log(`Public files fetched: ${files.length}`);

    if (files.length === 0) {
      console.warn("No public files found.");
      return [];
    }
    console.log("Fetched Files:", files);

    // Step 2: Filter files based on search input
    console.log("Step 2: Filtering files...");
    const filteredFiles = files.filter(
      (file) =>
        file.Label?.toLowerCase().includes(searchInput.toLowerCase()) ||
        file.fileName?.toLowerCase().includes(searchInput.toLowerCase()) ||
        file.fileType?.toLowerCase().includes(searchInput.toLowerCase())
    );

    console.log(`Filtered files count: ${filteredFiles.length}`);
    if (filteredFiles.length === 0) {
      console.warn("No matching files found for the search input.");
      return [];
    }

    // Step 3: Fetch metadata, user data, and bookmark status for each file
    console.log("Step 3: Fetching metadata, user data, and bookmark status...");
    const filesWithMetadataAndUser = await Promise.all(
      filteredFiles.map(async (file, index) => {
        console.log(`Processing file ${index + 1}/${filteredFiles.length}: ${file.$id}`);
        try {
          // Fetch file metadata
          const metadataResponse = await databases.listDocuments(
            databaseId,
            fileMetadataCollectionID,
            [Query.equal("fileMetadataId", file.$id)]
          );
          const metadata = metadataResponse.documents[0] || {};

          // Fetch user data
          let user = { username: "Unknown User", profile: null };
          if (file.ownerId) {
            try {
              const userResponse = await databases.listDocuments(
                databaseId,
                userMetadataCollectionID,
                [Query.equal("userId", file.ownerId)]
              );
              const userDocument = userResponse.documents[0];

              let profileResponse = null;
              if (userDocument?.avatarId) {
                profileResponse = await storage.getFilePreview(
                  userProfileImageId,
                  userDocument.avatarId
                );
              }

              user = {
                username: userDocument?.userName || "Unknown User",
                profile: profileResponse?.href || "default-profile-image-url.jpg",
              };
            } catch (userError) {
              console.warn(`Unable to fetch user for ownerId ${file.ownerId}:`, userError);
            }
          }

          // Check if the file is bookmarked
          let isBookmarked = false;
          try {
            const bookmarkResponse = await databases.listDocuments(
              databaseId,
              bookmarksCollectionID,
              [Query.equal("userId", file.ownerId), Query.equal("fileId", file.$id)]
            );
            isBookmarked = bookmarkResponse.documents.length > 0;
          } catch (bookmarkError) {
            console.warn(`Unable to fetch bookmarks for file ${file.$id}:`, bookmarkError);
          }

          // Combine file data with its metadata, user, and bookmark status
          return {
            ...file,
            metadata,
            user,
            isBookmarked,
          };
        } catch (error) {
          console.error(`Error processing file ${file.$id}:`, error);

          // Return file with default metadata, user, and bookmark status
          return {
            ...file,
            metadata: {},
            user: { username: "Unknown User", profile: null },
            isBookmarked: false,
          };
        }
      })
    );

    console.log("Processing completed.");
    return filesWithMetadataAndUser;
  } catch (error) {
    console.error("Error fetching files, metadata, and user data:", error);
    throw error;
  }
};

import { client } from "./appwrite";
import { Databases } from "appwrite";

const databases = new Databases(client);

export const renameFolderInDatabase = async (databaseId, collectionId, folderId, newFolderName, updateTime) => {
  try {
    // Update the folder name in the Appwrite Database
    const updatedFolder = await databases.updateDocument(databaseId, collectionId, folderId, {
      folderName: newFolderName,
      updatedAt: updateTime,
    });

    console.log(`Folder ${folderId} renamed successfully to "${newFolderName}".`, updatedFolder);
    return updatedFolder;
  } catch (error) {
    console.error("Failed to rename folder:", error);
    throw error; // Re-throw error to handle in UI or calling function
  }
};

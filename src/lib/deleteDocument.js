import { client } from "./appwrite";
import {  Databases } from "appwrite";
import {saveActivity }from "./saveActivity"
import getCurrentDate from "../components/currentDate";
const time = getCurrentDate()
const databases = new Databases(client);

export const deleteDocumentFromDatabase = async (  databaseId, collectionId, fileId, userId) => {
  try {

    // Delete the file metadata from Appwrite Database
    await databases.deleteDocument(databaseId, collectionId, fileId);
    const activity = {
      ownerId:userId ,
      type: "delete",
      message: "You deleted a document ",
      timeStamp: time
    };
    
    saveActivity(activity);
    console.log(`File ${fileId} deleted successfully from  database.`);
  } catch (error) {
    console.error("Failed to delete file or metadata:", error);
    throw error; // Re-throw error to handle in `handleDelete`
  }
};

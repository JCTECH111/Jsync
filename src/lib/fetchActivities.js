
import {  Databases, Query } from "appwrite";
import { client } from "./appwrite";
const databases = new Databases(client);
const DatabaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const activitiesId = import.meta.env.VITE_APPWRITE_ACTIVITIES_COLLECTION_ID
export const fetchActivities = async (userId) => {
    try {
      const response = await databases.listDocuments(
        DatabaseId,
        activitiesId,
        [Query.equal("ownerId", userId)]
      );
      console.log("Fetched activities:", response.documents);
      return response.documents;
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };
  
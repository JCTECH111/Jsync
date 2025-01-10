import {  Databases, ID } from "appwrite";
import { client } from "./appwrite";
const DatabaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const activitiesId = import.meta.env.VITE_APPWRITE_ACTIVITIES_COLLECTION_ID;
export const saveActivity = async (activity) => {
    const uniqueID = ID.unique();
    const databases = new Databases(client);
    try {
        const response = await databases.createDocument(
            DatabaseId,   // Replace with your Database ID
            activitiesId, // Replace with your Collection ID
            uniqueID,        // Auto-generate unique ID
            activity           // Activity data
        );
        console.log("Activity saved:", response);
    } catch (error) {
        console.error("Error saving activity:", error);
    }
};

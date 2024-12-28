import { Databases, ID ,Permission, Role} from 'appwrite';
import { client } from './appwrite';

const databases = new Databases(client);
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const userMetadataCollectionId = import.meta.env.VITE_APPWRITE_USER_METADATA_ID;

export const createUserMetadata = async ( userName, storageUsed, plan, createdAt, otp,avatarId, userId) => {
    try {
        // Create the data object to be stored
        const data = {
            userName,
            storageUsed: parseInt(storageUsed, 10), // Convert to integer if not already
            plan,
            createdAt,
            otp: parseInt(otp, 10),
            avatarId,
            userId
        };
        // Call createDocument with the correct parameters
        const response = await databases.createDocument(
            databaseId,
            userMetadataCollectionId,
            ID.unique(), // Use the unique document ID
            data, // Pass the data object here
            [
                Permission.read(Role.any()),    // Allow everyone to read
                Permission.update(Role.any()),  // Only authenticated users can update
                Permission.delete(Role.any())   // Only authenticated users can delete
            ]
        );

        console.log('User metadata created:', response);
        return response;
    } catch (error) {
        console.error('Error creating user metadata:', error);
        throw error; // Re-throw the error for further handling
    }
};

import { Storage,Permission, Role } from 'appwrite';
import { client} from './appwrite';
const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_USERS_UPLOAD_DOCUMENT;

const storage = new Storage(client);

export const uploadFile = async (file, documentId) => {
    try {
        const response = await storage.createFile(
            bucketId, // Bucket ID
            documentId, // File ID (or use 'unique()' to auto-generate)
            file, // File object (from file input)
            [
                Permission.read(Role.users()),    // Allow everyone to read
                Permission.update(Role.users()),  // Only authenticated users can update
                Permission.delete(Role.users())   // Only authenticated users can delete
            ]
        );
        console.log('File uploaded:', response);
    } catch (error) {
        console.error('Error uploading file:', error.message);
    }
};
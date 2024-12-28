import { signUpUser } from './signUpUser';
import { createUserMetadata } from './userMetadata';
// import { Databases, ID ,Permission, Role } from './appwrite';

export const registerUserWithMetadata = async (email, password, name, storageUsed,plan,createdAt, otp,avatarId ) => {
    try {
        // Step 1: Register user
        const user = await signUpUser(email, password, name);
        console.log('Newly registered user:', user);

        const ownerId = user.$id

        
        // // Step 3: Create user metadata
        const metadataResponse = await createUserMetadata(name, storageUsed, plan, createdAt, otp, avatarId, ownerId)

        console.log('User registered and metadata created:', metadataResponse);
    } catch (error) {
        console.error('Error registering user with metadata:', error);
        throw error; // Re-throw error for handling at a higher level
    }
};

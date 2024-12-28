import { account } from './appwrite';

export const signUpUser = async (email, password, name) => {
    try {
        const response = await account.create('unique()', email, password, name);
        console.log('User registered:', response);
        return response;
    } catch (error) {
        console.error('Error during signup:', error);
    }
};

import React, { createContext, useState, useEffect } from 'react';
import { account } from '../lib/appwrite'; // Use your Appwrite instance here

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User object (e.g., name, email, ID)
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // User ID
  const [customData, setCustomData] = useState(null); // Any additional data

  // Check if the user is logged in
  const checkUser = async () => {
    try {
      const response = await account.get(); // Get the logged-in user
      setUser(response);
      setUserId(response.$id); // Extract user ID
      await fetchCustomData(response.$id); // Fetch custom data if needed
    } catch (error) {
      setUser(null);
      setUserId(null);
      setCustomData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch additional user-related data from your "user_metadata" collection
  const fetchCustomData = async (id) => {
    try {
      // Use Appwrite's database API to fetch metadata based on the user ID
      const response = await client.database.getDocument(
        'user_metadata_collection_id', // Replace with your collection ID
        id
      );
      setCustomData(response);
    } catch (error) {
      console.error('Failed to fetch user metadata:', error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const logout = async () => {
    try {
      await account.deleteSession('current'); // Log out the user
      setUser(null);
      setUserId(null);
      setCustomData(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userId, customData, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

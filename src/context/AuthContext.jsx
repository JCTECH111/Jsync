import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInformation, setUserInformation] = useState(null); // Store main user information
  const [userId, setUserId] = useState(null); // Store user ID
  const [userMetaInformation, setUserMetaInformation] = useState(null); // Store metadata
  const [userMetaId, setUserMetaId] = useState(null); // Store metadata ID
  const [loading, setLoading] = useState(true); // Loading state for authentication

  // Simulate checking if the user is logged in
  const checkUser = async () => {
    try {
      // Logic to retrieve user session information (e.g., from localStorage or an API)
      const storedUser = JSON.parse(localStorage.getItem('user')); // Example storage
      if (storedUser) {
        setUserInformation(storedUser);
        setUserId(storedUser.id);
        setUserMetaInformation(storedUser.metadata || null);
        setUserMetaId(storedUser.metadataId || null); // Add metadata ID if available
      } else {
        throw new Error('No user session found');
      }
    } catch (error) {
      console.error('User check failed:', error);
      setUserInformation(null);
      setUserId(null);
      setUserMetaInformation(null);
      setUserMetaId(null);
    } finally {
      setLoading(false);
    }
  };

  // Simulate logging out the user
  const logout = async () => {
    try {
      // Logic to handle user logout (e.g., clearing session data)
      localStorage.removeItem('user'); // Example storage
      setUserInformation(null);
      setUserId(null);
      setUserMetaInformation(null);
      setUserMetaId(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Automatically check user session when the component mounts
  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userInformation,
        userId,
        userMetaInformation,
        userMetaId,
        loading,
        setUserInformation, // Allow other components to set user information
        setUserId, // Allow other components to set user ID
        setUserMetaInformation, // Allow setting user metadata
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

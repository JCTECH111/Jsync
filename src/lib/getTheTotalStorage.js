import React from 'react';
import { Databases, Query } from 'appwrite';
import { client } from './appwrite';

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const filesCollectionID = import.meta.env.VITE_APPWRITE_FILES_ID;
const databases = new Databases(client);

// Helper function to convert size strings to bytes
const parseSizeToBytes = (size) => {
  const units = { kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3 };
  const match = size.toLowerCase().match(/([\d.]+)\s*(kb|mb|gb)/);
  if (!match) return 0;
  const [_, value, unit] = match;
  return parseFloat(value) * (units[unit] || 1);
};

export const getTheTotalStorage = async (userId) => {
  try {
    const response = await databases.listDocuments(
      databaseId,
      filesCollectionID,
      [Query.equal('ownerId', userId)]
    );

    const documents = response.documents;

    // Initialize an object to group file sizes and counts by type
    const storageByType = {};

    documents.forEach((doc) => {
      const fileSizeInBytes = parseSizeToBytes(doc.fileSize);
      const fileType = doc.fileType || 'other';

      if (!storageByType[fileType]) {
        storageByType[fileType] = { totalSize: 0, count: 0 };
      }

      storageByType[fileType].totalSize += fileSizeInBytes;
      storageByType[fileType].count += 1; // Increment file count
    });

    // Convert results back to readable units (e.g., MB) and include file count
    const readableStorageByType = Object.entries(storageByType).map(
      ([type, { totalSize, count }]) => ({
        type,
        totalSize: (totalSize / (1024 ** 2)).toFixed(2) + ' MB', // Convert bytes to MB
        count, // Number of files
      })
    );

    return readableStorageByType;
  } catch (error) {
    console.error('Error fetching storage:', error);
    return [];
  }
};

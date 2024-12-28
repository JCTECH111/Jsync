import React from 'react';

export const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString();  // This will return the date in the correct format
};

export default getCurrentDate;

// HoverInfo.js
import React from 'react';

const HoverInfo = () => {
  return (
    <div className="relative group">
      {/* Main Card */}
      <div className="p-4 border rounded-lg bg-white shadow">
        <h3 className="font-bold text-lg">Facebook Videos</h3>
        <p className="text-gray-500">1,754 Files</p>
      </div>

      {/* Hover Display */}
      <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 p-4 bg-gray-800 text-white rounded shadow-lg">
        <p>Additional Info:</p>
        <ul className="list-disc list-inside mt-2">
          <li>Shared by 5 users</li>
          <li>Last updated: Dec 25, 2024</li>
          <li>Size: 120 GB</li>
        </ul>
      </div>
    </div>
  );
};

export default HoverInfo;

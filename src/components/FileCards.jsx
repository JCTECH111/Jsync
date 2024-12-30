// components/FileCards.js
import React from 'react';

const FileCards = () => {
  const files = [
    { title: 'Facebook Videos', count: 1754, users: 5 },
    { title: 'YouTube Videos', count: 3512, users: 5 },
    { title: 'Instagram Videos', count: 1908, users: 5 },
    { title: 'My Downloads', count: 218, users: 1 },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 mt-5 lg:grid-cols-4">
      {files.map((file, index) => (
        <div key={index} className="p-4 bg-white border rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">{file.title}</div>
            <div className="flex">
              {/* User avatars */}
              {[...Array(file.users)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 -ml-2 bg-gray-400 border-2 border-white rounded-full"
                ></div>
              ))}
              {file.users > 1 && (
                <div className="flex items-center justify-center w-6 h-6 -ml-2 text-sm text-white bg-blue-500 border-2 border-white rounded-full">
                  +{file.users}
                </div>
              )}
            </div>
          </div>
          <p className="mt-2 text-gray-500">{file.count.toLocaleString()} Files</p>
        </div>
      ))}
    </div>
  );
};

export default FileCards;

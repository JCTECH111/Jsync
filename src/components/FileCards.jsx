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
    <div className="grid grid-cols-4 gap-4">
      {files.map((file, index) => (
        <div key={index} className="p-4 border rounded-lg bg-white shadow">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold">{file.title}</div>
            <div className="flex">
              {/* User avatars */}
              {[...Array(file.users)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 bg-gray-400 rounded-full -ml-2 border-2 border-white"
                ></div>
              ))}
              {file.users > 1 && (
                <div className="w-6 h-6 bg-blue-500 rounded-full text-white text-sm flex items-center justify-center -ml-2 border-2 border-white">
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

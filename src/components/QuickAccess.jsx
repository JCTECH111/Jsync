// components/QuickAccess.js
import React from 'react';

const QuickAccess = () => {
  const quickAccessItems = [
    { label: 'Images', color: 'blue-500', icon: '🖼️' },
    { label: 'Videos', color: 'purple-500', icon: '🎥' },
    { label: 'Music', color: 'green-500', icon: '🎵' },
    { label: 'Documents', color: 'yellow-500', icon: '📄' },
    { label: 'Downloads', color: 'blue-300', icon: '⬇️' },
    { label: 'Add', color: 'gray-400', icon: '➕' },
  ];

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Quick Access</h2>
        <a href="#" className="text-blue-500">View All</a>
      </div>
      <div className="flex gap-4 mt-4">
        {quickAccessItems.map((item, index) => (
          <div
            key={index}
            className={`w-20 h-20 flex flex-col items-center justify-center rounded-lg bg-${item.color} text-white`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-sm mt-2">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;

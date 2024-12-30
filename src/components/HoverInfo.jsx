// HoverInfo.js


const HoverInfo = () => {
  return (
    <div className="relative group">
      {/* Main Card */}
      <div className="p-4 bg-white border rounded-lg shadow">
        <h3 className="text-lg font-bold">Facebook Videos</h3>
        <p className="text-gray-500">1,754 Files</p>
      </div>

      {/* Hover Display */}
      <div className="absolute left-0 hidden w-64 p-4 mt-2 text-white bg-gray-800 rounded shadow-lg top-full group-hover:block">
        <p>Additional Info:</p>
        <ul className="mt-2 list-disc list-inside">
          <li>Shared by 5 users</li>
          <li>Last updated: Dec 25, 2024</li>
          <li>Size: 120 GB</li>
        </ul>
      </div>
    </div>
  );
};

export default HoverInfo;

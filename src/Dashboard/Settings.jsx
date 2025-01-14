import React, { useState } from "react";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    password: "",
  });
  const [isPremium, setIsPremium] = useState(false);

  // Handle profile updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleProfileSave = () => {
    alert("Profile updated successfully!");
  };

  const handleUpgrade = () => {
    setIsPremium(true);
    alert("Congratulations! You are now a Premium member.");
  };

  return (
    <div className="relative">
      {/* Content */}
      <div className="container p-6 mx-auto blur-sm pointer-events-none">
        <h1 className="mb-6 text-3xl font-bold">Settings</h1>

        {/* Profile Editing Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Edit Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={profile.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <button
            onClick={handleProfileSave}
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>

        {/* Upgrade to Premium Section */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Upgrade to Premium</h2>
          {isPremium ? (
            <div className="p-4 border border-green-500 rounded bg-green-50">
              <p className="font-medium text-green-700">You are a Premium Member!</p>
            </div>
          ) : (
            <div>
              <p className="mb-4">
                Unlock exclusive features and benefits by upgrading to Premium.
              </p>
              <button
                onClick={handleUpgrade}
                className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
              >
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Coming Soon Modal */}
      <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full rounded-xl bg-gray-900 bg-opacity-80">
        <div className="relative flex flex-col items-center justify-center p-6 text-center bg-white rounded-lg animate-pulse shadow-md">
          <h2 className="text-4xl font-bold text-gray-800">Coming Soon</h2>
          <p className="mt-4 text-gray-600">Exciting features are on the way!</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;

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
    // Save profile to backend (API call to Appwrite or other service)
    alert("Profile updated successfully!");
  };

  const handleUpgrade = () => {
    // Upgrade to premium (API call to Appwrite or payment gateway)
    setIsPremium(true);
    alert("Congratulations! You are now a Premium member.");
  };

  return (
    <div className="container p-6 mx-auto">
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
  );
};

export default Settings;

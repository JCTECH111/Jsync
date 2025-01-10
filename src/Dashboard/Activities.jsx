import React, { useEffect, useState, useContext } from "react";
import Footer from "../components/Footer";
import { fetchActivities } from "../lib/fetchActivities"; // Use the function defined earlier
import SoundWaveLoader from "../components/SoundWaveLoader";
import { AuthContext } from "../context/AuthContext";
import { TrashIcon, ArrowUpIcon, BookmarkIcon, ShareIcon, InboxIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { deleteDocumentFromDatabase } from "../lib/deleteDocument";
const activitiesId = import.meta.env.VITE_APPWRITE_ACTIVITIES_COLLECTION_ID;
  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID
const ActivitiesPage = () => {
  const { userId } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    try {
      const loadActivities = async () => {
        const data = await fetchActivities(userId);
        setActivities(data);
      };
      loadActivities();
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const handleDeleteActivity = async (activityId) => {
    try {
      await deleteDocumentFromDatabase(databaseId,activitiesId,activityId, userId )
    } catch (error) {
      return error
    }
    setActivities((prevActivities) =>
      prevActivities.filter((activity) => activity.$id !== activityId)
    );
    console.log(`Activity with ID ${activityId} deleted.`); // Add actual deletion logic here
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold text-gray-700">Your Activities</h2>
      <div className="space-y-4">
        {isLoading ? (
          <SoundWaveLoader />
        ) : (
          activities.map((activity) => (
            <div
              key={activity.$id} // Appwrite uses `$id` for document IDs
              className="relative flex items-start p-4 bg-white rounded-lg shadow-md hover:bg-gray-100"
            >
              {/* Icon */}
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white bg-blue-500 rounded-full">
                {activity.type === "upload" && <ArrowUpIcon className="w-6 h-6" />}
                {activity.type === "bookmark" && (
                  <BookmarkIcon className="w-6 h-6" />
                )}
                {activity.type === "share" && <ShareIcon className="w-6 h-6" />}
                {activity.type === "received" && (
                  <InboxIcon className="w-6 h-6" />
                )}
                {activity.type === "delete" && <TrashIcon className="w-6 h-6" />}
                {activity.type === "rename" && <PencilIcon className="w-6 h-6" />}
              </div>

              {/* Content */}
              <div className="ml-4">
                <p className="text-gray-700">
                  {activity.message}{" "}
                  {activity.documentName && (
                    <span className="font-bold">{activity.documentName}</span>
                  )}
                  {activity.sharedBy && (
                    <span className="text-gray-500"> by {activity.sharedBy}</span>
                  )}
                  {activity.oldName && activity.newName && (
                    <>
                      <span className="text-gray-500 line-through">
                        {activity.oldName}
                      </span>{" "}
                      <span className="font-bold">{activity.newName}</span>
                    </>
                  )}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(activity.timeStamp).toLocaleDateString()}{" "}
                  {new Date(activity.timeStamp).toLocaleTimeString()}
                </p>
              </div>

              {/* Delete Icon */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                onClick={() => handleDeleteActivity(activity.$id)}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ActivitiesPage;

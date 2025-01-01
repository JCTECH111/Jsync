import React from "react";

const activities = [
  {
    id: 1,
    type: "upload",
    message: "You uploaded a new image",
    timestamp: "2 mins ago",
    image: "https://th.bing.com/th/id/OIP.0ZM7e1Z_zmebcBILunvbHQHaEn?pid=ImgDetMain", // Replace with actual image
  },
  {
    id: 2,
    type: "bookmark",
    message: "You bookmarked a document",
    timestamp: "10 mins ago",
    documentName: "ProjectPlan.pdf",
  },
  {
    id: 3,
    type: "share",
    message: "You shared a document",
    timestamp: "30 mins ago",
    documentName: "TeamNotes.docx",
  },
  {
    id: 4,
    type: "received",
    message: "Someone shared a document with you",
    timestamp: "1 hour ago",
    documentName: "Budget2024.xlsx",
    sharedBy: "John Doe",
  },
  {
    id: 5,
    type: "delete",
    message: "You deleted a file",
    timestamp: "2 hours ago",
    fileName: "OldReport.pdf",
  },
  {
    id: 6,
    type: "rename",
    message: "You renamed a file",
    timestamp: "Yesterday",
    oldName: "Draft.txt",
    newName: "FinalDraft.txt",
  },
];

const ActivitiesPage = () => {
  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold text-gray-700">Your Activities</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start p-4 bg-white rounded-lg shadow-md hover:bg-gray-100"
          >
            {/* Icon */}
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white bg-blue-500 rounded-full">
              {activity.type === "upload" && (
                <i className="fas fa-upload"></i>
              )}
              {activity.type === "bookmark" && (
                <i className="fas fa-bookmark"></i>
              )}
              {activity.type === "share" && (
                <i className="fas fa-share-alt"></i>
              )}
              {activity.type === "received" && (
                <i className="fas fa-inbox"></i>
              )}
              {activity.type === "delete" && (
                <i className="fas fa-trash-alt"></i>
              )}
              {activity.type === "rename" && (
                <i className="fas fa-edit"></i>
              )}
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
              {activity.image && (
                <img
                  src={activity.image}
                  alt="Uploaded"
                  className="object-cover w-20 h-20 mt-2 rounded-lg"
                />
              )}
              <p className="mt-1 text-sm text-gray-500">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesPage;

import React, { useEffect, useState } from "react"
import {
    PhotoIcon,
    VideoCameraIcon,
    DocumentTextIcon,
    PaperClipIcon,
    DocumentPlusIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

function StorageOverview() {
    const [storageUsed, setStorageUsed] = useState(0); // Used storage (percentage)
    const [totalStorage, setTotalStorage] = useState(100); // Total storage capacity (GB)

    useEffect(() => {
        // Simulating a server fetch for storage data
        const fetchStorageData = async () => {
            try {
                //   const response = await fetch("/api/storage"); // Replace with your server endpoint
                const data = {
                    "used": 34,  // Used storage in GB
                    "total": 100 // Total storage capacity in GB
                }
                    ;
                const usedPercentage = (data.used / data.total) * 100; // Calculate percentage
                setStorageUsed(usedPercentage);
                setTotalStorage(data.total);
            } catch (error) {
                console.error("Failed to fetch storage data:", error);
            }
        };

        fetchStorageData();
    }, []);
    const storageData = [
        {
            icon: PhotoIcon,
            label: "Images",
            size: "15.7 GB",
            files: 259,
        },
        {
            icon: VideoCameraIcon,
            label: "Videos",
            size: "20 GB",
            files: 8,
        },
        {
            icon: DocumentTextIcon,
            label: "Documents",
            size: "10.5 GB",
            files: 46,
        },
        {
            icon: PaperClipIcon,
            label: "Other Files",
            size: "2.8 GB",
            files: 50,
        },
    ];

    return (
        <div className="w-full p-1 ">
            {/* Half-circle chart */}
            <div className="w-full p-1">
                {/* Half-circle chart */}
                <div className="flex  items-center justify-center h-[20rem] relative">
                    <div className="relative w-48 h-[22rem]">
                        <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full">
                            {/* Gray background circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="transparent"
                                stroke="currentColor"
                                className="text-gray-200"
                                strokeWidth="8"
                            />
                            {/* Blue progress circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="transparent"
                                stroke="currentColor"
                                className="text-blue-500"
                                strokeWidth="8"
                                strokeDasharray={`${(storageUsed / 100) * 282.6} 282.6`} // Adjust progress dynamically
                                strokeLinecap="round"
                                transform="rotate(-90 50 50)"
                            />
                        </svg>
                    </div>

                    <div className="absolute flex flex-col items-center justify-center top-[11rem]">
                        <span className="mt-4 text-2xl font-semibold text-gray-800">
                            {Math.round(storageUsed)}%
                        </span>
                        <p className="text-sm text-gray-500">
                            {Math.round((storageUsed / 100) * totalStorage)}GB of {totalStorage}GB
                            used
                        </p>
                    </div>
                </div>
            </div>

            {/* Storage Details */}
            <div className="space-y-3">
                {storageData.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:shadow-sm"
                    >
                        <div className="flex items-center">
                            <item.icon className="w-8 h-8 text-blue-500" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700">{item.label}</p>
                                <p className="text-xs text-gray-500">{item.files} Files</p>
                            </div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                            {item.size}
                        </span>
                    </div>
                ))}
            </div>

            {/* Upload Button */}
            <Link to="/dashboard/upload">
                <button className="flex items-center justify-center w-full px-4 py-2 mt-6 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                    <DocumentPlusIcon className="w-5 h-5 mr-2" />
                    Upload
                </button>
            </Link>
        </div>
    );
}

export default StorageOverview;

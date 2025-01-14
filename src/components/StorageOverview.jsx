import React, { useEffect, useState, useContext } from "react";
import { getTheTotalStorage } from "../lib/getTheTotalStorage";
import {
    PhotoIcon,
    VideoCameraIcon,
    DocumentTextIcon,
    PaperClipIcon,
    DocumentPlusIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import SoundWaveLoader from "./SoundWaveLoader";

function StorageOverview() {
    const [storageUsed, setStorageUsed] = useState(0); // Used storage (percentage)
    const [totalStorage, setTotalStorage] = useState(100); // Total storage capacity (GB)
    const [storageData, setStorageData] = useState([]); // Storage details by type
    const { userId } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        const fetchStorageData = async () => {
            try {
                // Fetch storage details grouped by file type from the server
                const storageDetails = await getTheTotalStorage(userId);

                // Initialize total used and storage details
                let totalUsedBytes = 0;

                // Helper function to convert size strings to bytes
                const parseSizeToBytes = (size) => {
                    const units = { kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3 };
                    const match = size.toLowerCase().match(/([\d.]+)\s*(kb|mb|gb)/);
                    if (!match) return 0;
                    const [_, value, unit] = match;
                    return parseFloat(value) * (units[unit] || 1);
                };

                // Map the storage details to match the format for rendering
                const mappedStorageData = storageDetails.map((detail) => {
                    let icon;
                    switch (detail.type.toLowerCase()) {
                        case "image":
                            icon = PhotoIcon;
                            break;
                        case "video":
                            icon = VideoCameraIcon;
                            break;
                        case "document":
                            icon = DocumentTextIcon;
                            break;
                        case "other":
                        default:
                            icon = PaperClipIcon;
                    }

                    // Convert totalSize to bytes and accumulate for totalUsedBytes
                    const sizeInBytes = parseSizeToBytes(detail.totalSize);
                    totalUsedBytes += sizeInBytes;

                    return {
                        icon,
                        label: detail.type.charAt(0).toUpperCase() + detail.type.slice(1), // Capitalize type
                        size: detail.totalSize, // Keep original string format for display
                        files: detail.count,
                    };
                });

                // Convert total used bytes to GB for percentage calculation
                const totalUsedGB = totalUsedBytes / (1024 ** 3); // Convert bytes to GB
                console.log("used gb", totalUsedGB)
                const totalCapacityGB = 5; // Example total capacity in GB, adjust as needed

                // Update state
                setStorageUsed((totalUsedGB / totalCapacityGB) * 100); // Percentage
                console.log("used gb", storageUsed)
                setTotalStorage(totalCapacityGB); // Total storage capacity
                setStorageData(mappedStorageData); // Storage details for rendering
            } catch (error) {
                console.error("Failed to fetch storage data:", error);
            } finally {
                setIsLoading(false)
            }
        };



        fetchStorageData();
    }, [userId]);

    return (
        <div className="w-full p-1">
            {/* Circular Progress Chart */}
            <div className="w-full p-1">
                <div className="flex items-center justify-center h-[20rem] relative">
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
                                strokeDasharray="282.6" // Full circle perimeter
                                strokeDashoffset={282.6 - (storageUsed / 100) * 282.6} // Adjust progress dynamically
                                strokeLinecap="round"
                                transform="rotate(-90 50 50)"
                            />
                        </svg>
                    </div>

                    <div className="absolute flex flex-col items-center justify-center top-[11rem]">
                        <span className="mt-4 text-2xl font-semibold text-gray-800">
                            {storageUsed.toFixed(2)}%
                        </span>
                        <p className="text-sm text-gray-500">
                            {storageUsed.toFixed(2)}GB of {totalStorage}GB used
                        </p>
                    </div>

                </div>
            </div>

            {/* Storage Details */}
            <div className="space-y-3">
                {isLoading ? (
                    <SoundWaveLoader />
                ) : (
                    storageData.length <= 0 ? (
                        <div className="flex flex-col items-center justify-center text-gray-600 p-6 bg-gray-50 border border-gray-200 rounded-md shadow-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-12 h-12 mb-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12h6m2 0a2 2 0 100-4H7a2 2 0 100 4m0 0a2 2 0 01-4 0m18 0a2 2 0 01-4 0"
                                />
                            </svg>
                            <p className="text-lg font-semibold">No storage data available</p>
                            <p className="text-sm text-gray-500">Upload document to view storage data</p>
                        </div>
                    ) : (
                        storageData.map((item, index) => (
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
                        ))
                    )
                )}
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

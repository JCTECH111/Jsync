import { useState, useEffect, useContext } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { registerUploadedFile } from "../lib/mainDocumentUploading";
import { ID } from '../lib/appwrite';
import getCurrentDate from "../components/currentDate";
import { useFetchFolders } from "../lib/fetchFolders";
import SoundWaveLoader from '../components/SoundWaveLoader';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';
import FolderComponent from "./folderComponents";
import { updateUserActivity } from "../lib/updateUserActivities";
const FileManagementPage = () => {
    const { userId } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("upload"); // To toggle forms
    const [isPublic, setIsPublic] = useState(false); // Toggle for file visibility
    const [selectedFile, setSelectedFile] = useState(null); // To preview the uploaded file
    const [fileSize, setFileSize] = useState('');
    const [label, setLabel] = useState(""); // File label
    const [folderId, setFolderId] = useState(""); // Selected folder
    const [fileName, setFileName] = useState(""); // Selected folder
    const [fileType, setFileType] = useState(""); // File type
    const [folders, setFolders] = useState([]); // Initialize folders state
    const fetchedFolders = useFetchFolders(); // Use the custom hook
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Update state whenever fetchedFolders changes
    useEffect(() => {
        if (fetchedFolders) {
            setFolders(fetchedFolders);
        } else {
            showErrorMessage("no folder found")
        }
    }, [fetchedFolders]);
    // const userString = localStorage.getItem('user');
    const ownerId = userId;
    const navigate = useNavigate();
    const showErrorMessage = (message) => {
        toast.error(message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
        });
    };

    const showSuccessMessage = (message) => {
        toast.success(message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
        });
    };
    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toISOString();
    };
    //getting the current date
    const currentDate = getCurrentDate();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileName(file.name)
        setSelectedFile(file);
        if (file) {
            // Convert file size to KB or MB
            const sizeInKB = (file.size / 1024).toFixed(2); // Size in KB
            const sizeInMB = (file.size / (1024 * 1024)).toFixed(2); // Size in MB
            // Check if file size exceeds 30MB
            if (sizeInMB > 30) {
                toast.error('File size exceeds 30MB. Please upload a smaller file.');
                setSelectedFile();
                return;
            }
            // Set the file size in KB or MB
            setFileSize(sizeInKB > 1024 ? `${sizeInMB} MB` : `${sizeInKB} KB`);
        }
    };

    const documentId = ID.unique()




    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!label || !folderId || !selectedFile || !fileType) {
            toast.error("Please fill in all fields and upload a file.");
            return;
        }

        try {
            setIsSubmitting(true);

            await registerUploadedFile(
                selectedFile,
                documentId,
                fileName,
                fileType,
                currentDate,
                currentDate,
                isPublic,
                label,
                fileSize,
                folderId,
                ownerId,
            )
            const now = new Date(); // Get current date and time
            const month = now.toLocaleString("default", { month: "short" }); // Get month as 'Jan', 'Feb', etc.
            const year = now.getFullYear(); // Get the year (e.g., 2025)
            await updateUserActivity(ownerId, month, year, "uploads", 1); // Increment by 1
            // Show success notification
            Swal.fire({
                icon: 'success',
                title: 'document uploaded Successful',
                text: 'Saved!',
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                navigate('/dashboard/files');
            })
        } catch (error) {
            showErrorMessage("Error uploadng document", error);
        } finally {
            setIsSubmitting(false);
        }

        showSuccessMessage("File uploaded successfully!");
    };

    return (
        <div className="p-1">
            {/* Page Header */}
            <div className="flex justify-center mb-6 border-b">
                <button
                    className={`px-4 py-2 font-medium ${activeTab === "upload"
                        ? "text-blue-500 border-b-2 border-blue-500"
                        : "text-gray-500"
                        }`}
                    onClick={() => setActiveTab("upload")}
                >
                    Uploading Document
                </button>
                <button
                    className={`px-4 py-2 font-medium ${activeTab === "folder"
                        ? "text-blue-500 border-b-2 border-blue-500"
                        : "text-gray-500"
                        }`}
                    onClick={() => setActiveTab("folder")}
                >
                    Create Folder
                </button>
            </div>

            {/* Uploading Document Form */}
            {activeTab === "upload" && (
                <div className={`p-1 bg-white rounded-lg shadow-md ${isSubmitting ? 'cursor-disabled' : 'cursor-pointer'
                    }`}>
                    <h3 className="mb-4 text-lg font-semibold text-gray-700">Upload File</h3>
                    <form className="space-y-4 " onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-600">Label</label>
                            <input
                                type="text"
                                className="p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter file label"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-600">Folder</label>
                            <select
                                className="p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                                value={folderId}
                                onChange={(e) => setFolderId(e.target.value)}
                            >
                                <option value="">Select Folder</option>
                                {folders.map((folder) => (
                                    <option key={folder.$id} value={folder.$id} className="flex items-center w-full gap-3">
                                        📁 {"   "}
                                        {folder.folderName}
                                    </option>
                                ))}
                            </select>

                        </div>
                        <div className="flex flex-col">
                            {/* <label className="font-medium text-gray-600">Modified</label> */}
                            <input
                                type="text"
                                value={getCurrentDateTime()}
                                hidden
                                className="p-2 mt-1 bg-gray-100 border border-gray-300 rounded-md"
                                readOnly
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-600">File Type</label>
                            <select
                                className="p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                                value={fileType}
                                onChange={(e) => setFileType(e.target.value)}
                            >
                                <option value="">Select File Type</option>
                                <option value="music">Music</option>
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                                <option value="document">Document</option>
                                <option value="other">Other Files</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-600">Upload Document</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    name="file"
                                    className="hidden"
                                    id="fileInput"
                                    onChange={handleFileChange}
                                    required
                                />
                                <button
                                    className="flex items-center justify-center w-full px-4 py-2 mt-6 text-sm font-medium text-white bg-blue-500 rounded-lg lg:w-[40%] hover:bg-blue-600"
                                    onClick={() => document.getElementById('fileInput').click()}
                                >
                                    <DocumentPlusIcon className="w-5 h-5 mr-2" />
                                    Upload
                                </button>
                            </div>

                            {selectedFile && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600">Selected File: {selectedFile.name}</p>
                                    {selectedFile.type.startsWith("image/") && (
                                        <img
                                            src={URL.createObjectURL(selectedFile)}
                                            alt="Preview"
                                            className="object-cover w-32 h-32 mt-2 rounded-md"
                                        />
                                    )}

                                    {selectedFile.type.startsWith("video/") && (
                                        <video
                                            controls
                                            src={URL.createObjectURL(selectedFile)}
                                            className="w-32 h-32 mt-2 rounded-md"
                                        ></video>
                                    )}

                                    {selectedFile.type.startsWith("audio/") && (
                                        <div className="flex items-center justify-center w-32 h-32 mt-2 bg-gray-200 rounded-md">
                                            <img
                                                src="/path/to/audio-placeholder.png"
                                                alt="Audio Placeholder"
                                                className="w-12 h-12"
                                            />
                                            <p className="mt-2 text-xs text-center text-gray-500">Audio File</p>
                                        </div>
                                    )}

                                    {/* Document File Preview */}
                                    {selectedFile.type.startsWith("application/") && (
                                        <div className="flex flex-col items-center w-32 h-32 p-2 mt-2 bg-gray-200 rounded-md">
                                            <img
                                                src={
                                                    selectedFile.type === "application/pdf"
                                                        ? "https://th.bing.com/th/id/R.e2128f95054df5ef0efcb94e85a6a2aa?rik=ofjTqTITkHDXxw&pid=ImgRaw&r=0"
                                                        : ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"].includes(selectedFile.type)
                                                            ? "https://th.bing.com/th/id/OIP.SR8quKEZ4wIqaXyidcIwKwHaEK?pcl=1b1a19&pid=ImgDetMain"
                                                            : ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(selectedFile.type)
                                                                ? "https://th.bing.com/th/id/OIP.ykK5rw63b4q35gNZMsCwngHaHa?pid=ImgDetMain"
                                                                : "https://th.bing.com/th/id/OIP.MJ_yOu0kUEbfoBeQU865jgHaHa?pid=ImgDetMain"
                                                }
                                                alt="Document Placeholder"
                                                className="object-cover w-24 h-24"
                                            />
                                            <p className="mt-2 text-xs text-center text-gray-500">
                                                {selectedFile.type === "application/pdf"
                                                    ? "PDF File"
                                                    : ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"].includes(selectedFile.type)
                                                        ? "Word File"
                                                        : ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(selectedFile.type)
                                                            ? "Excel File"
                                                            : "Document File"}
                                            </p>
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-semibold text-gray-700">File Size</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Auto-calculated"
                                    value={fileSize} // Display the calculated file size
                                    readOnly
                                />
                                <span className="absolute text-xs text-gray-500 -translate-y-1/2 top-1/2 right-3">
                                    KB/MB
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">File size is automatically calculated after upload.</p>
                        </div>

                        <div className="flex flex-col gap-2 space-x-3 lg:flex-row">
                            <label className="font-medium text-gray-600">Is Public</label>
                            <button
                                type="button"
                                onClick={() => setIsPublic(!isPublic)}
                                className={`w-10 h-5 flex items-center rounded-full p-1 transition duration-300 ${isPublic ? "bg-blue-500" : "bg-gray-300"
                                    }`}
                            >
                                <div
                                    className={`w-4 h-4 bg-white rounded-full transform ${isPublic ? "translate-x-5" : "translate-x-0"
                                        } transition`}
                                ></div>
                            </button>
                            <p className="text-xs text-gray-500">If File is set Public it would be visible to the Public.</p>
                        </div>
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-800"
                        >
                            {isSubmitting ? <SoundWaveLoader /> : 'Upload File'}
                        </button>
                    </form>
                </div>
            )}

            {/* Create Folder Form */}
            {activeTab === "folder" && (
                <FolderComponent />
            )}
            <ToastContainer />
        </div>
    );
};

export default FileManagementPage;


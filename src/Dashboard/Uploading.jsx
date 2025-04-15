import { useState, useEffect, useContext, useCallback } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DocumentPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
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
    const [activeTab, setActiveTab] = useState("upload");
    const [isPublic, setIsPublic] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileSize, setFileSize] = useState('');
    const [label, setLabel] = useState("");
    const [folderId, setFolderId] = useState("");
    const [fileName, setFileName] = useState("");
    const [fileType, setFileType] = useState("");
    const [folders, setFolders] = useState([]);
    const fetchedFolders = useFetchFolders();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);

    useEffect(() => {
        if (fetchedFolders) {
            setFolders(fetchedFolders);
        } else {
            showErrorMessage("No folder found");
        }
    }, [fetchedFolders]);

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

    const currentDate = getCurrentDate();

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        const sizeInKB = (file.size / 1024).toFixed(2);
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        
        if (sizeInMB > 30) {
            showErrorMessage('File size exceeds 30MB. Please upload a smaller file.');
            return;
        }
        
        setSelectedFile(file);
        setFileName(file.name);
        setFileSize(sizeInKB > 1024 ? `${sizeInMB} MB` : `${sizeInKB} KB`);
        setShowAdditionalFields(true);
    };

    const removeFile = () => {
        setSelectedFile(null);
        setFileName("");
        setFileSize("");
        setShowAdditionalFields(false);
    };

    const documentId = ID.unique();

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
            );
            
            const now = new Date();
            const month = now.toLocaleString("default", { month: "short" });
            const year = now.getFullYear();
            await updateUserActivity(ownerId, month, year, "uploads", 1);
            
            Swal.fire({
                icon: 'success',
                title: 'Document uploaded successfully',
                text: 'Saved!',
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                navigate('/dashboard/files');
            });
        } catch (error) {
            showErrorMessage("Error uploading document");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-1">
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

            {activeTab === "upload" && (
                <div className={`p-1 bg-white rounded-lg shadow-md ${isSubmitting ? 'cursor-disabled' : 'cursor-pointer'}`}>
                    <h3 className="mb-4 text-lg font-semibold text-gray-700">Upload File</h3>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Drag and Drop Area */}
                        <div 
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <DocumentPlusIcon className="w-12 h-12 text-gray-400" />
                                <p className="text-gray-600">
                                    Drag and drop your file here, or click to browse
                                </p>
                                <input
                                    type="file"
                                    id="fileInput"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                    onClick={() => document.getElementById('fileInput').click()}
                                >
                                    Select File
                                </button>
                            </div>
                        </div>

                        {/* Selected File Preview */}
                        {selectedFile && (
                            <div className="p-4 mt-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        {selectedFile.type.startsWith("image/") && (
                                            <img
                                                src={URL.createObjectURL(selectedFile)}
                                                alt="Preview"
                                                className="object-cover w-12 h-12 rounded"
                                            />
                                        )}
                                        {selectedFile.type.startsWith("video/") && (
                                            <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded">
                                                <span className="text-xs text-gray-500">Video</span>
                                            </div>
                                        )}
                                        {selectedFile.type.startsWith("audio/") && (
                                            <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded">
                                                <span className="text-xs text-gray-500">Audio</span>
                                            </div>
                                        )}
                                        {selectedFile.type.startsWith("application/") && (
                                            <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded">
                                                <span className="text-xs text-gray-500">Document</span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
                                            <p className="text-xs text-gray-500">{fileSize}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="p-1 text-gray-400 hover:text-gray-600"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Additional Fields (shown after file selection) */}
                        {showAdditionalFields && (
                            <div className="space-y-4 animate-fadeIn">
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
                                <div className="flex flex-col gap-2 space-x-3 lg:flex-row">
                                    <label className="font-medium text-gray-600">Is Public</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsPublic(!isPublic)}
                                        className={`w-10 h-5 flex items-center rounded-full p-1 transition duration-300 ${isPublic ? "bg-blue-500" : "bg-gray-300"}`}
                                    >
                                        <div
                                            className={`w-4 h-4 bg-white rounded-full transform ${isPublic ? "translate-x-5" : "translate-x-0"} transition`}
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
                            </div>
                        )}
                    </form>
                </div>
            )}

            {activeTab === "folder" && (
                <FolderComponent />
            )}
            <ToastContainer />
        </div>
    );
};

export default FileManagementPage;
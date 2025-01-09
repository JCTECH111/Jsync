import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Databases, Storage } from "appwrite";
import { client } from "../lib/appwrite";
import SoundWaveLoader from "../components/SoundWaveLoader";

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const filesCollectionID = import.meta.env.VITE_APPWRITE_FILES_ID;
const fileBucketID = import.meta.env.VITE_APPWRITE_BUCKET_USERS_UPLOAD_DOCUMENT;

const databases = new Databases(client);
const storage = new Storage(client);

const PublicView = () => {
  const { id } = useParams();
  const [fileData, setFileData] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        // Fetch the document containing file metadata
        const document = await databases.getDocument(databaseId, filesCollectionID, id);
        setFileData(document);

        // Fetch file details from the Appwrite Storage API
        const file = await storage.getFilePreview(fileBucketID, document.fileId);
        setFileUrl(file.href); // Preview URL for the file
        setFileType(file.mimeType); // MIME type of the file
      } catch (error) {
        console.error("Error fetching file data:", error);
      }
    };

    fetchFileData();
  }, [id]);

  if (!fileData) {
    return (
      <div className="w-full flex h-screen items-center justify-center">
        <SoundWaveLoader />
      </div>
    );
  }

  // Dynamic `og:image` based on file type
  const ogImage =
  fileType && fileType.startsWith("image/")
    ? fileUrl
    : "https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9";


  return (
    <div>
      {/* Meta Tags */}
      <Helmet>
        <title>{"fileData.metadata.title"}</title>
        <meta name="description" content={"fileData.metadata.description"} />
        <meta property="og:title" content={"fileData.metadata.title"} />
        <meta property="og:description" content={"fileData.metadata.description"} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={`https://jsync.vercel.app/view/${id}`} />
      </Helmet>

      {/* File Display */}
      {fileType.startsWith("image/") ? (
        <img src={fileUrl} alt={"fileData.metadata.title"} className="max-w-full h-auto" />
      ) : (
        <iframe
          src={`https://your-appwrite-endpoint/v1/storage/files/${fileData.fileId}/view`}
          style={{ width: "100%", height: "500px" }}
        ></iframe>
      )}
    </div>
  );
};

export default PublicView;

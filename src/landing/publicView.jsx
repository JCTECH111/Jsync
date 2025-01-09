import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { Databases } from "appwrite";
import { client } from "../lib/appwrite";

const databases = new Databases(client);

const PublicView = () => {
  const { id } = useParams();
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const response = await databases.getDocument(
          "databaseId", // Replace with your Appwrite database ID
          "collectionId", // Replace with your Appwrite collection ID
          id
        );
        setFileData(response);
      } catch (error) {
        console.error("Error fetching file data:", error);
      }
    };

    fetchFileData();
  }, [id]);

  if (!fileData) return <div>Loading...</div>;

  return (
    <div>
      <h1>{fileData.metadata.title}</h1>
      <p>{fileData.metadata.description}</p>
      <iframe
        src={`https://your-appwrite-endpoint/v1/storage/files/${fileData.fileId}/view?project=projectId`}
        style={{ width: "100%", height: "500px" }}
      ></iframe>
    </div>
  );
};

export default PublicView;

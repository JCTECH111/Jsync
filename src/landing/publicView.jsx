import React, {useEffect, useState} from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { Databases } from "appwrite";
import { client } from "../lib/appwrite";
import SoundWaveLoader from "../components/SoundWaveLoader";

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

  if (!fileData) return <div className="w-full flex h-screen items-center justify-center"><SoundWaveLoader /></div>;

  return (
    <div>
    <Helmet>
      <title>{fileData.metadata.title}</title>
      <meta name="description" content={fileData.metadata.description} />
      <meta property="og:title" content={fileData.metadata.title} />
      <meta property="og:description" content={fileData.metadata.description} />
      <meta property="og:image" content="path-to-thumbnail" />
      <meta property="og:url" content={`https://your-domain.com/view/${fileData.$id}`} />
    </Helmet>
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

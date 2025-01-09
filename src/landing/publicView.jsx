import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Databases, Storage } from "appwrite";
import { client } from "../lib/appwrite";
import SoundWaveLoader from "../components/SoundWaveLoader";
import { AuthContext } from "../context/AuthContext";

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const filesCollectionID = import.meta.env.VITE_APPWRITE_FILES_ID;
const fileBucketID = import.meta.env.VITE_APPWRITE_BUCKET_USERS_UPLOAD_DOCUMENT;
const userMetaID = import.meta.env.VITE_APPWRITE_USER_METADATA_ID;

const databases = new Databases(client);
const storage = new Storage(client);

const PublicView = () => {
    const { id } = useParams();
    const [fileUrl, setFileUrl] = useState("");
    const [username, setUsername] = useState("");
    const { userId } = useContext(AuthContext);

    useEffect(() => {
        const fetchFileData = async () => {
            try {
                // Fetch file preview URL
                const file = await storage.getFileView(fileBucketID, id);
                setFileUrl(file.href);

                // Fetch the username using user ID from auxcontext
                if (userId) {
                    const userResponse = await databases.getDocument(
                        databaseId,
                        userMetaID, // Replace with the ID of the users collection in your database
                        userId
                    );
                    console.log(userResponse)
                    setUsername(userResponse.userName || "Someone");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchFileData();
    }, [id, userId]);

    if (!fileUrl) {
        return (
            <div className="w-full flex h-screen items-center justify-center">
                <SoundWaveLoader />
            </div>
        );
    }

    // Default `og:image` link
    const ogImage = "https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9";

    return (
        <div>
            {/* Meta Tags */}
            <Helmet>
                <title>Jsync</title>
                <meta
                    name="description"
                    content={`${username} shared this document with you. Explore it now on Jsync, the smart file manager created by Joecode.`}
                />
                <meta property="og:title" content="Jsync" />
                <meta property="og:description" content={`${username} shared this document with you. Explore it now on Jsync!`} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:url" content={`https://jsync.vercel.app/view/${id}`} />
            </Helmet>

            {/* File Display */}
            <iframe
                src={`${fileUrl}`}
                className="w-full h-screen max-w-full max-h-screen  overflow-hidden border-0"
            />

        </div>
    );
};

export default PublicView;

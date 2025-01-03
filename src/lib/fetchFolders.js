import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useFetchFolders = () => {
    const [folders, setFolders] = useState([]);

    useEffect(() => {
        async function fetchFolders() {
            try {
                const response = await fetch('/api/folders'); // Adjust the endpoint
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setFolders(data);
            } catch (error) {
                toast.error('Failed to load folders.');
            }
        }
        fetchFolders();
    }, []);

    return folders;
};

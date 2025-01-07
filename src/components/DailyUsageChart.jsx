import React, {useState, useEffect, useContext} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import { fetchUserActivities } from '../lib/fetchUserActivities';


const ActivityChart = () => {
  const databaseId =import.meta.env.VITE_APPWRITE_DATABASE_ID; // Replace with your database ID
const collectionId = import.meta.env.VITE_APPWRITE_CHART_OVERVIEW_DOCUMENT_ID; // cOLLECTION ID
const [activityData, setActivityData] = useState([]);
const currentYear = new Date().getFullYear();
const { userId } = useContext(AuthContext);
const ownerId = userId; // Replace with the logged-in user's ID


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserActivities(databaseId, collectionId, ownerId, currentYear);
        
        // Transform the data to match chart format
        const formattedData = data.map((activity) => ({
          month: activity.month,
          uploads: activity.totalUploads,
          downloads: activity.totalDownloads,
        }));

        setActivityData(formattedData);
      } catch (error) {
        console.error("Error loading activity data:", error);
      }
    };

    fetchData();
  }, [databaseId, collectionId, ownerId, currentYear]);

  return (
    <div className="relative w-full h-[400px] mt-6">
    <h1 className='text-xl font-bold text-gray-800'>Daily Usage</h1>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={activityData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uploads" stroke="#8884d8" />
          <Line type="monotone" dataKey="downloads" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;

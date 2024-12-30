import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const activityData = [
  { month: 'Jan', uploads: 50, downloads: 30 },
  { month: 'Feb', uploads: 70, downloads: 60 },
  { month: 'Mar', uploads: 90, downloads: 85 },
  { month: 'Apr', uploads: 120, downloads: 100 },
  { month: 'May', uploads: 80, downloads: 110 },
  { month: 'Jun', uploads: 95, downloads: 120 },
];

const ActivityChart = () => {
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

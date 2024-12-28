import { Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { HomeIcon, FolderIcon, DocumentTextIcon, BookmarkIcon, MagnifyingGlassIcon, CogIcon } from '@heroicons/react/24/solid';

// Import your dashboard pages/components
import Overview from './Overview';
import Files from './Files';
import Activities from './Activities';
import Bookmarked from './Bookmarked';
import Search from './Search';
import Settings from './Settings';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full ">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white w-64 h-full p-5 space-y-4 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <h2 className="text-xl font-semibold">File Manager</h2>
        <div className="space-y-4 mt-6">
          <Link to="/dashboard" className="flex items-center space-x-2 hover:bg-gray-700 px-4 py-3 rounded-md">
            <HomeIcon className="w-6 h-6 text-gray-400" />
            <span>Overview</span>
          </Link>

          <Link to="/dashboard/files" className="flex items-center space-x-2 hover:bg-gray-700 px-4 py-3 rounded-md">
            <FolderIcon className="w-6 h-6 text-gray-400" />
            <span>Files</span>
          </Link>

          <Link to="/dashboard/activities" className="flex items-center space-x-2 hover:bg-gray-700 px-4 py-3 rounded-md">
            <DocumentTextIcon className="w-6 h-6 text-gray-400" />
            <span>Activities</span>
          </Link>

          <Link to="/dashboard/bookmarked" className="flex items-center space-x-2 hover:bg-gray-700 px-4 py-3 rounded-md">
            <BookmarkIcon className="w-6 h-6 text-gray-400" />
            <span>Bookmarked</span>
          </Link>

          <Link to="/dashboard/search" className="flex items-center space-x-2 hover:bg-gray-700 px-4 py-3 rounded-md">
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
            <span>Search</span>
          </Link>

          {/* Gap */}
          <div className="h-12"></div>

          <Link to="/dashboard/settings" className="flex items-center space-x-2 hover:bg-gray-700 px-4 py-3 rounded-md">
            <CogIcon className="w-6 h-6 text-gray-400" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <button className="lg:hidden text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
          </button>
          <h1 className="text-2xl font-semibold">File Manager Dashboard</h1>
        </div>

        {/* Central Content */}
        <div className="flex-1 p-6 bg-gray-100">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/files" element={<Files />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/bookmarked" element={<Bookmarked />} />
            <Route path="/search" element={<Search />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

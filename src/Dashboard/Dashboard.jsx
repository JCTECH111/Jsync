import { Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  FolderIcon,
  DocumentTextIcon,
  BookmarkIcon,
  MagnifyingGlassIcon,
  CogIcon,
  CloudIcon,
  BellIcon,
  ArrowRightCircleIcon
} from '@heroicons/react/24/solid';

// Import your dashboard pages/components
import Overview from './Overview';
import Files from './Files';
import ActivitiesPage from './Activities';
import Bookmarked from './Bookmarked';
import Search from './Search';
import Settings from './Settings';
import StorageOverview from '../components/StorageOverview';
import FileManagementPage from './Uploading';
import FileList from './fileList';
import { fetchActivities } from "../lib/fetchActivities"; // Use the function defined earlier
import { AuthContext } from "../context/AuthContext";
const Dashboard = () => {
  const { userId } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false); // For left sidebar
  const [storageNav, setStorageNav] = useState(false); // For right sidebar
  const [notificationOpen, setNotificationOpen] = useState(false); // Notification state
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    try {
      const loadActivities = async () => {
        const data = await fetchActivities(userId);
        setActivities(data);
      };
      loadActivities();
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  return (
    <div className="h-screen w-full grid lg:grid-cols-[15%_65%_20%] grid-cols-1 bg-red-700">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 z-20 lg:w-full w-64 bg-blue-600 text-white p-5 space-y-4 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:relative`}
      >
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">File Manager</h2>
          <button
            className="text-white lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>
        <div className="mt-6 space-y-4">
          <Link to="/dashboard" onClick={() => {
            setSidebarOpen(false);
            setStorageNav(false);
            setNotificationOpen(false)
          }} className="flex items-center px-4 py-3 space-x-2 rounded-md hover:bg-blue-700">
            <HomeIcon className="w-6 h-6 text-white" />
            <span>Overview</span>
          </Link>
          <Link to="/dashboard/files" onClick={() => {
            setSidebarOpen(false);
            setStorageNav(false);
            setNotificationOpen(false)
          }} className="flex items-center px-4 py-3 space-x-2 rounded-md hover:bg-blue-700">
            <FolderIcon className="w-6 h-6 text-white" />
            <span>Files</span>
          </Link>
          <Link to="/dashboard/activities" onClick={() => {
            setSidebarOpen(false);
            setStorageNav(false);
            setNotificationOpen(false)
          }} className="flex items-center px-4 py-3 space-x-2 rounded-md hover:bg-blue-700">
            <DocumentTextIcon className="w-6 h-6 text-white" />
            <span>Activities</span>
          </Link>
          <Link to="/dashboard/bookmarked" onClick={() => {
            setSidebarOpen(false);
            setStorageNav(false);
            setNotificationOpen(false)
          }} className="flex items-center px-4 py-3 space-x-2 rounded-md hover:bg-blue-700">
            <BookmarkIcon className="w-6 h-6 text-white" />
            <span>Bookmarked</span>
          </Link>
          <Link to="/dashboard/search" onClick={() => {
            setSidebarOpen(false);
            setStorageNav(false);
            setNotificationOpen(false)
          }} className="flex items-center px-4 py-3 space-x-2 rounded-md hover:bg-blue-700">
            <MagnifyingGlassIcon className="w-6 h-6 text-white" />
            <span>Search</span>
          </Link>
          <div className="h-12"></div>
          <Link to="/dashboard/settings" onClick={() => {
            setSidebarOpen(false);
            setStorageNav(false);
            setNotificationOpen(false)
          }} className="flex items-center px-4 py-3 space-x-2 rounded-md hover:bg-blue-700">
            <CogIcon className="w-6 h-6 text-white" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto bg-white" >
        {/* Navbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Bars3Icon className="w-8 h-8 text-gray-700" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-700">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <div className="relative">
              <button
                className="relative"
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <BellIcon className="w-6 h-6 text-gray-700" />
                {/* Notification Badge */}
                {!activities || activities.length === 0 ? (
                  null // Render nothing if activities is null or empty
                ) : (
                  <span className="absolute top-0 right-0 inline-block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                )}

              </button>
              {/* Notification Dropdown */}
              {notificationOpen && (
                <div className="absolute z-20 right-0 w-64 p-4 mt-2 text-black bg-white rounded-lg shadow-lg">
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  <ul className="mt-2 space-y-2 overflow-y-auto max-h-60">
                    {activities.slice(0, 5).map((activity) => (
                      <li
                        className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                        key={activity.$id}
                      >
                        {activity.message}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full mt-2 text-sm font-semibold text-blue-600">
                    <a href='/dashboard/activities'>
                      View All
                    </a>
                  </button>
                </div>
              )}
            </div>
            <button
              className="lg:hidden"
              onClick={() => setStorageNav(!storageNav)}
            >
              <CloudIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/files" element={<Files />} />
            <Route path="/files/:fileType" element={<FileList />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/bookmarked" element={<Bookmarked />} />
            <Route path="/search" element={<Search />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/upload" element={<FileManagementPage />} />
          </Routes>
        </div>
      </div>

      {/* Right Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 lg:w-full w-64 bg-white border-[1px] border-gray-300 text-white p-4 transition-transform ${storageNav ? 'translate-x-0' : 'translate-x-full'
          } lg:translate-x-0 lg:relative overflow-y-scroll`}
      >
        <button
          className="flex float-right lg:hidden"
          onClick={() => setStorageNav(!storageNav)}
        >
          <ArrowRightCircleIcon className="w-6 h-6 text-gray-700" />
        </button>
        <h2 className="text-lg font-semibold text-gray-700">Storage Overview</h2>
        <StorageOverview />
      </div>
    </div>
  );
};

export default Dashboard;

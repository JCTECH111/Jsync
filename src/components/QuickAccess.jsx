import { Link } from "react-router-dom";
import {
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  DocumentTextIcon,
  PaperClipIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const QuickAccess = () => {
  const quickAccessItems = [
    { title: "Images", icon: PhotoIcon, bgColor: "bg-blue-500", path: "/dashboard/files/image" },
    { title: "Videos", icon: VideoCameraIcon, bgColor: "bg-purple-500", path: "/dashboard/files/videos" },
    { title: "Music", icon: MusicalNoteIcon, bgColor: "bg-green-500", path: "/dashboard/files/music" },
    { title: "Documents", icon: DocumentTextIcon, bgColor: "bg-yellow-500", path: "/dashboard/files/document" },
    { title: "Others", icon: PaperClipIcon, bgColor: "bg-indigo-500", path: "/dashboard/files/other" },
    { title: "Add", icon: PlusIcon, bgColor: "bg-gray-400", path: "/dashboard/upload" },
  ];

  return (
    <div className="mt-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Quick Access</h2>
        <a href="#view-all-quick-access" className="text-blue-500 hover:underline">
          View All
        </a>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
        {quickAccessItems.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className={`flex flex-col items-center justify-center p-4 space-y-2 text-white rounded-lg shadow ${item.bgColor}`}
          >
            <item.icon className="w-8 h-8" />
            <p className="text-sm font-medium">{item.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;

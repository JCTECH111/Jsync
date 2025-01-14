import { useState, useContext } from "react";
import { ID } from "appwrite";
import { getFilesWithSearch } from "../lib/fetchSearchResult";
import SoundWaveLoader from "../components/SoundWaveLoader";
import {
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { DocumentIcon } from "@heroicons/react/24/outline";
import BookmarkModal from "../components/BookmarkModal";
import { AuthContext } from '../context/AuthContext';
import { removeBookmarked } from '../lib/removeBookmarked'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SearchPage = () => {
  const { userId } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "Eductional document",
    "Assignment",
    "Car papers",
  ]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uniqueId, setUniqueId] = useState(ID.unique());


  const handleSearchChange = (e) => {
    const input = e.target.value;
    setQuery(input);
    if (input) {
      setFilteredSuggestions(
        suggestions.filter((suggestion) =>
          suggestion.toLowerCase().includes(input.toLowerCase())
        )
      );
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setFilteredSuggestions([]);
  };

  const handleActionClick = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleAddBookmark = async (fileId) => {
    try {
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.$id === fileId ? { ...doc, isBookmarked: true } : doc
        )
      );
      setIsModalOpen(true);
      setFileId(fileId);
      setActiveDropdown(null); // Close the dropdown

    } catch (error) {
      console.error("Error adding bookmark:", error);
      toast.error("Failed to add bookmark. Please try again.");
    }
  };

  const handleRemoveBookmark = async (fileId) => {
    try {
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.$id === fileId ? { ...doc, isBookmarked: false } : doc
        )
      );
      await removeBookmarked(fileId);
      setActiveDropdown(null); // Close the dropdown
      toast.success("Bookmark removed successfully!");;
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("Failed to remove bookmark. Please try again.");
    }
  };



  const handleSubmit = async () => {
    setIsLoading(true)
    console.log(userId)
    try {
      const result = await getFilesWithSearch(query)
      console.log(result)
      setDocuments(result)
      toast.success("Search completed successfully!");
    } catch (error) {
      toast.error("Failed to fetch search results. Please try again.", error);
    } finally {
      setIsLoading(false)
    }
  };
  const tagStyles = {
    music: "bg-yellow-100 text-yellow-700",
    image: "bg-purple-100 text-purple-700",
    video: "bg-blue-100 text-blue-700",
    document: "bg-green-100 text-green-700",
    other: "bg-pink-100 text-pink-700",
  };
  return (
    <div className="container p-2 mx-auto">
      <h2 className="mb-6 text-3xl font-bold text-gray-800">
        Search Public Documents
      </h2>
      <ToastContainer />
      {/* Search Input with Suggestions */}
      <div className="relative flex flex-col mb-6">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={handleSearchChange}
          />
          <button className="px-4 py-3 bg-blue-500 rounded-r-lg hover:bg-blue-600" type="submit" onClick={handleSubmit}>
            <MagnifyingGlassIcon className="w-6 h-6 text-white" />
          </button>
        </div>
        {query && filteredSuggestions.length > 0 && (
          <ul className="relative z-10 w-full mt-5 bg-white border border-gray-300 rounded-lg shadow-lg">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Documents Table */}
      <div className="h-screen overflow-x-auto overscroll-y-auto rounded-xl w-full">
        <table className="table-auto w-full border-collapse min-w-full text-left border border-gray-300 shadow-lg rounded-xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">
                User
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">
                User Name
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">
                #
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">
                File Name
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">
                fileType
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">
                Size
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">
                Label
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="py-4 text-center relative">
                  <SoundWaveLoader />
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr
                  key={doc.$id}
                  className="h-[5rem] transition-colors hover:bg-gray-100"
                >
                  {/* Image Column */}
                  <td className="w-[4rem] px-6 py-4">
                    <img
                      src={doc.user.profile}
                      alt="Profile"
                      className="w-[3rem] h-[3rem] object-cover rounded-full border border-gray-300"
                    />
                  </td>

                  {/* Username Column */}
                  <td className="px-6 py-4 text-gray-800">{doc.user.username}</td>

                  {/* Icon Column */}
                  <td className="px-6 py-4 text-gray-800">
                    <DocumentIcon className="w-5 h-5 text-gray-400" />
                  </td>

                  {/* File Name Column */}
                  <td className="px-6 py-4 text-gray-800">{doc.fileName}</td>

                  {/* File Type Column */}
                  <td className="px-6 py-4 text-gray-800">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${tagStyles[doc.fileType] || "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {doc.fileType || "NAN"}
                    </span>
                  </td>

                  {/* File Size Column */}
                  <td className="px-6 py-4 text-gray-800">{doc.fileSize}</td>

                  {/* Label Column */}
                  <td className="px-6 py-4 text-gray-800">{doc.Label}</td>

                  {/* Date Column */}
                  <td className="px-6 py-4 text-gray-800">
                    {new Date(doc.createdAt).toLocaleDateString()}{" "}
                    {new Date(doc.createdAt).toLocaleTimeString()}
                  </td>

                  {/* Action Column */}
                  <td className="relative px-6 py-4">
                    <EllipsisVerticalIcon
                      className="w-6 h-6 text-gray-500 cursor-pointer"
                      onClick={() => handleActionClick(doc.$id)}
                    />
                    {activeDropdown === doc.$id && (
                      <div className="absolute right-0 z-10 w-40 p-2 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {doc.isBookmarked ? (
                          <button
                            onClick={() => handleRemoveBookmark(doc.$id)}
                            className="block w-full px-4 py-2 text-left bg-blue-600 text-white hover:bg-blue-800 rounded-2xl"
                          >
                            Bookmarked
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddBookmark(doc.$id)}
                            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                          >
                            Bookmark
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {isModalOpen && (
        <BookmarkModal
          fileId={fileId}
          userId={userId}
          onClose={() => setIsModalOpen(false)}
          id={uniqueId}
        />
      )}
    </div>
  );
};

export default SearchPage;

import { useState, useContext, useEffect } from "react";
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
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "Educational document",
    "Assignment",
    "Car papers",
  ]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

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
      setActiveDropdown(null);
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
      setActiveDropdown(null);
      toast.success("Bookmark removed successfully!");
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("Failed to remove bookmark. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.warning("Please enter a search term");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchPerformed(true);

    try {
      const result = await getFilesWithSearch(query);
      if (result && result.length > 0) {
        setDocuments(result);
        // Update suggestions based on actual labels from results
        const labels = [...new Set(result.map(doc => doc.Label))];
        setSuggestions(prev => [...new Set([...prev, ...labels])]);
      } else {
        setDocuments([]);
        toast.info("No documents found matching your search");
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to fetch search results. Please try again.");
      toast.error("Failed to fetch search results. Please try again.");
    } finally {
      setIsLoading(false);
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
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Search Input with Suggestions */}
      <form onSubmit={handleSubmit} className="relative flex flex-col mb-6">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={handleSearchChange}
          />
          <button 
            type="submit" 
            className="px-4 py-3 bg-blue-500 rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <MagnifyingGlassIcon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
        {query && filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-12 bg-white border border-gray-300 rounded-lg shadow-lg">
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
      </form>

      {/* Documents Table */}
      <div className="h-screen overflow-x-auto overscroll-y-auto rounded-xl w-full">
        {error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : searchPerformed && documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <DocumentIcon className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700">No documents found</h3>
            <p className="text-gray-500">Try a different search term</p>
          </div>
        ) : (
          <table className="table-auto w-full border-collapse min-w-full text-left border border-gray-300 shadow-lg rounded-xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">User</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">User Name</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">#</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">File Name</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">fileType</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">Size</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">Label</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">Date</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="py-4 text-center relative whitespace-nowrap">
                    <SoundWaveLoader />
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr
                    key={doc.$id}
                    className="h-[5rem] transition-colors hover:bg-gray-100 whitespace-nowrap"
                  >
                    <td className="w-[5rem] px-6 py-4 whitespace-nowrap">
                      <img
                        src="https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.-s2xQBsIowKFaw0Lxl8uqAHaHa%26pid%3DApi&sp=1744926498T7235e3ca72e223c7004c2e0b2a37f06b60f685002f449eb0eb8f5a9ea96a5437"
                        alt="Profile"
                        className="w-[3rem] h-[3rem] object-cover rounded-full border border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-800 whitespace-nowrap">{doc.user?.username || 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                      <DocumentIcon className="w-5 h-5 text-gray-400" />
                    </td>
                    <td className="px-6 py-4 text-gray-800 whitespace-nowrap">{doc.fileName}</td>
                    <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${tagStyles[doc.fileType] || "bg-gray-100 text-gray-700"}`}
                      >
                        {doc.fileType || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-800 whitespace-nowrap">{doc.fileSize || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-800 whitespace-nowrap">{doc.Label || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                      {doc.createdAt ? (
                        <>
                          {new Date(doc.createdAt).toLocaleDateString()}{" "}
                          {new Date(doc.createdAt).toLocaleTimeString()}
                        </>
                      ) : "N/A"}
                    </td>
                    <td className="relative px-6 py-4 whitespace-nowrap">
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
        )}
      </div>

      {isModalOpen && (
        <BookmarkModal
          fileId={fileId}
          userId={userId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SearchPage;
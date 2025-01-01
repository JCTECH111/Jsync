import { useState } from "react";
import {
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([
    "Public Document 1",
    "Public Document 2",
    "Shared Document 3",
  ]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [documents, setDocuments] = useState([
    { id: 1, name: "Public Document 1", owner: "John Doe", date: "2025-01-01" },
    { id: 2, name: "Public Document 2", owner: "Jane Smith", date: "2025-01-02" },
  ]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setQuery(input);
    setFilteredSuggestions(
      suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(input.toLowerCase())
      )
    );
  };

  const handleActionClick = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className="container p-4 mx-auto">
      <h2 className="mb-6 text-3xl font-bold text-gray-800">
        Search Public Documents
      </h2>

      {/* Search Input with Suggestions */}
      <div className="relative flex items-center mb-6">
        <input
          type="text"
          placeholder="Search documents..."
          className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={query}
          onChange={handleSearchChange}
        />
        <button className="px-4 py-3 bg-blue-500 rounded-r-lg hover:bg-blue-600">
          <MagnifyingGlassIcon className="w-6 h-6 text-white" />
        </button>
        {query && filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => setQuery(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Documents Table */}
      <div className="h-screen overflow-x-auto overscroll-y-auto rounded-xl">
        <table className="min-w-full text-left border border-gray-300 shadow-lg rounded-xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">
                Owner
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase">
                Date
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr
                key={doc.id}
                className="transition-colors hover:bg-gray-100"
              >
                <td className="px-6 py-4 text-gray-800">{doc.name}</td>
                <td className="px-6 py-4 text-gray-800">{doc.owner}</td>
                <td className="px-6 py-4 text-gray-800">{doc.date}</td>
                <td className="relative px-6 py-4">
                  {/* Action Dropdown */}
                  <EllipsisVerticalIcon
                    className="w-6 h-6 text-gray-500 cursor-pointer"
                    onClick={() => handleActionClick(doc.id)}
                  />
                  {activeDropdown === doc.id && (
                    <div className="absolute right-0 z-10 w-40 p-2 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                        Bookmark
                      </button>
                      <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                        Download
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchPage;

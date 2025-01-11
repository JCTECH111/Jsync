import React, { useState } from "react";
import { addBookmark } from "../lib/addBookMark"; // Import the function

function BookmarkModal({ fileId, userId, onClose, id }) {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await addBookmark(fileId, userId, notes, id);
      onClose(); // Close the modal after successful submission
    } catch (error) {
      setErrorMessage("Failed to add bookmark. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Bookmark</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes here..."
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-white ${
                isSubmitting
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? "Adding..." : "Add Bookmark"}
            </button>
          </div>
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default BookmarkModal;

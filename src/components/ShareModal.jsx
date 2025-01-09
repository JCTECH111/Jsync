import React, { useState } from "react";
import Modal from  "react-modal"
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, LinkedinShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, WhatsappIcon, LinkedinIcon } from "react-share";

const ShareModal = ({ isOpen, onClose, fileLink }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(fileLink);
    alert("Link copied to clipboard!");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Share File"
      className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
      ariaHideApp={false}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Share File</h2>
        <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg mb-4">
          <span className="truncate text-gray-700">{fileLink}</span>
          <button
            onClick={handleCopyLink}
            className="px-4 py-1 ml-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Copy
          </button>
        </div>
        <div className="flex justify-around mt-4">
          <FacebookShareButton url={fileLink}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <TwitterShareButton url={fileLink}>
            <TwitterIcon size={40} round />
          </TwitterShareButton>
          <WhatsappShareButton url={fileLink}>
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
          <LinkedinShareButton url={fileLink}>
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>
        </div>
        <button
          onClick={onClose}
          className="block w-full mt-6 px-4 py-2 text-sm text-center text-white bg-red-500 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ShareModal;

import React from "react";

const Footer = () => {
  return (
    <footer className="py-4 text-center text-gray-400 border-[1px] border-gray-300">
      <p className="text-lg">
        © {new Date().getFullYear()} All rights reserved. Created by{" "}
        <a
          href="https://your-website-link.com" // Replace with your actual link
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-blue-400 hover:underline"
        >
          JoeCode
        </a>
        .
      </p>
    </footer>
  );
};

export default Footer;

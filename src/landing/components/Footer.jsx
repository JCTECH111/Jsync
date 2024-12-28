import React from "react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-blue-600 text-white py-10">
      <div className="container mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
        <p>Email: support@filemaster.com | Phone: +1 (234) 567-890</p>
        <p className="mt-4">
          Follow us on:
          <a href="#" className="text-white underline ml-2">Twitter</a>,
          <a href="#" className="text-white underline ml-2">Facebook</a>,
          <a href="#" className="text-white underline ml-2">LinkedIn</a>
        </p>
        <p className="mt-4 text-sm">&copy; 2024 FileMaster. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

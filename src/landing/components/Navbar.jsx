import React from "react";

const Navbar = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex justify-between items-center p-5">
        <a href="#" className="text-2xl font-bold text-blue-600">FileMaster</a>
        <nav>
          <a href="#features" className="px-4 text-gray-600 hover:text-blue-600">Features</a>
          <a href="#about" className="px-4 text-gray-600 hover:text-blue-600">About</a>
          <a href="#resources" className="px-4 text-gray-600 hover:text-blue-600">Resources</a>
          <a href="#contact" className="px-4 text-gray-600 hover:text-blue-600">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

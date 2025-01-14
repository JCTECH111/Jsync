import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 py-4 sticky top-4 z-50 rounded-3xl shadow-lg px-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-400">Jsync</h1>

        {/* Menu for larger screens */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <a href="#features" className="text-gray-300 hover:text-white">
              Features
            </a>
          </li>

          <li>
            <a href="#privacy" className="text-gray-300 hover:text-white">
              Privacy & Security
            </a>
          </li>
          <li>
            <a href="#creator-note" className="text-gray-300 hover:text-white">
              Resources
            </a>
          </li>
        </ul>

        {/* Sign-In Button */}
        <a
          href="/signin"
          className="hidden md:block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        >
          Sign In
        </a>

        {/* Hamburger Menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-300 focus:outline-none"
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 rounded-lg mt-2 px-4 py-4">
          <ul className="space-y-4 text-center">
            <li>
              <a href="#features" className="text-gray-300 hover:text-white">
                Features
              </a>
            </li>
            <li>
              <a href="#privacy" className="text-gray-300 hover:text-white">
                Privacy & Security
              </a>
            </li>
            <li>
              <a href="#creator-note" className="text-gray-300 hover:text-white">
                Resources
              </a>
            </li>
            <li>
              <a
                href="/signin"
                className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                Sign In
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

const Footer = () => {
  return (
    <footer className=" py-4 text-gray-400 text-sm border-t border-gray-400">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section */}
        <p>© 2025 Jsync - By Nnamezie Jonathan - JoeCode</p>

        {/* Right Section */}
        <div className="space-x-4">
          <a
            href="https://github.com/jctech111"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            Github
          </a>
          {/* <a
            href="https://fundJoe.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            Portfolio
          </a> */}
          <a
            href="https://wa.me/qr/7AQDB3GTR3MOB1"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

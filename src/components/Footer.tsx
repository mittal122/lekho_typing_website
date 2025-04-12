
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full py-4 px-6 text-center text-sm">
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
        <Link to="/how-to-use" className="hover:underline">
          How to Use
        </Link>
        <span className="hidden sm:inline">•</span>
        <Link to="/test" className="hover:underline">
          Try Typing Test
        </Link>
        <span className="hidden sm:inline">•</span>
        <p>Type Master Unleashed {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;

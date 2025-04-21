import { RiStockFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex justify-center w-full px-4 sm:px-6 lg:px-8">
      <nav className="flex flex-col w-full max-w-6xl sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] p-4 rounded-3xl shadow-2xl bg-[#0F0F0F] mt-10">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-xl sm:text-2xl font-bold text-white flex items-center">
            <RiStockFill className="text-[#d4fb2b] text-3xl sm:text-4xl" />
            <h1 className="text-[#d4fb2b] font-bold ml-1">StockHub</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 text-gray-200">
            <a href="#" className="hover:text-[#d4fb2b] transition-colors">
              How it Works
            </a>
            <a href="#" className="hover:text-[#d4fb2b] transition-colors">
              FAQ
            </a>
            <a href="#" className="hover:text-[#d4fb2b] transition-colors">
              Contact
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden sm:block">
            <Link to="/login">
              <button className="bg-[#d4fb2b] text-black px-5 py-2 font-medium rounded-full hover:bg-yellow-400 transition-colors">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-200 focus:outline-none"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-3 border-t border-gray-700">
            <div className="flex flex-col space-y-3 text-gray-200">
              <a href="#" className="hover:text-[#d4fb2b] py-1">
                How it Works
              </a>
              <a href="#" className="hover:text-[#d4fb2b] py-1">
                FAQ
              </a>
              <a href="#" className="hover:text-[#d4fb2b] py-1">
                Contact
              </a>
              <div className="sm:hidden pt-2">
                <Link to="/login">
                  <button className="w-full bg-[#d4fb2b] text-black px-4 py-2 font-medium rounded-full hover:bg-yellow-400 transition-colors">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
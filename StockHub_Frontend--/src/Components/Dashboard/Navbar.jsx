import { FaHome, FaChartLine, FaWallet, FaNewspaper, FaBell, FaCog, FaSignOutAlt, FaBars, FaTimes, FaSearch, FaUser } from 'react-icons/fa';
import { Routes, Route, Link, Navigate, } from 'react-router-dom';
import { RiStockFill } from "react-icons/ri";
const Navbar = ({ toggleSidebar }) => {
    return (
      <header className="bg-[#0a0a0a] border-b border-gray-800 sticky top-0 z-20">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center lg:hidden">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
            >
              <FaBars className="text-gray-400" />
            </button>
          </div>
          
          <div className="hidden md:flex items-center flex-1 max-w-xs">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full bg-[#111111] border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#d4fb2b] text-gray-300"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-[#111111] text-gray-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-gray-600">
              <FaBell />
            </button>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-[#d4fb2b] flex items-center justify-center text-black font-bold lg:hidden">
                JS
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  };
  export default Navbar;
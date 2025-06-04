import { useLocation } from "react-router-dom";
import { FaHome, FaChartLine, FaWallet, FaNewspaper, FaBell, FaCog, FaSignOutAlt, FaBars, FaTimes, FaSearch, FaUser } from 'react-icons/fa';
import { Routes, Route, Link, Navigate, } from 'react-router-dom';
import { RiStockFill } from "react-icons/ri";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", name: "Dashboard", icon: <FaHome /> },
    { path: "/dashboard/market", name: "Market", icon: <FaChartLine /> },
    { path: "/dashboard/portfolio", name: "Portfolio", icon: <FaWallet /> },
    {
      path: "/dashboard/notifications",
      name: "Notifications",
      icon: <FaBell />,
    },
    { path: "/dashboard/settings", name: "Settings", icon: <FaCog /> },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0 z-30 transition duration-300 ease-in-out bg-[#0a0a0a] border-r border-gray-800 w-64 lg:w-72 flex-shrink-0`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <RiStockFill className="text-[#d4fb2b] text-3xl" />
            <span className="text-[#d4fb2b] font-bold text-xl">StockHub</span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md lg:hidden focus:outline-none focus:ring-1 focus:ring-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
          <ul className="px-2 space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-[#1a1a1a] text-[#d4fb2b]"
                      : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-[#d4fb2b] flex items-center justify-center text-black font-bold">
              JS
            </div>
            <div>
              <p className="text-sm font-medium">John Smith</p>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
          </div>
          <Link
            to="/login"
            className="flex items-center space-x-3 px-4 py-2 text-gray-400 hover:bg-[#1a1a1a] hover:text-white rounded-lg transition-colors w-full"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;

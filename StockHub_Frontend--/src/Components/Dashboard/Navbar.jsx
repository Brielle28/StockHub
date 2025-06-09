import { FaBars, FaBell } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="bg-[#0a0a0a] border-b border-gray-800 sticky top-0 z-20">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Sidebar toggle button (visible on small screens) */}
        <div className="flex items-center justify-end lg:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
          >
            <FaBars className="text-gray-400" />
          </button>
        </div>

        {/* User initials (hidden on large screens) */}
        <div className="flex items-center space-x-2 lg:hidden">
          <div className="h-8 w-8 rounded-full bg-[#d4fb2b] flex items-center justify-center text-black font-bold">
            {user?.firstName?.[0] || "G"}
            {user?.lastName?.[0] || "U"}
          </div>
        </div>

        {/* Spacer to push bell icon to right on large screens */}
        <div className="flex-1"></div>

        {/* Bell icon */}
        <Link to="/dashboard/notifications">
          <button className="p-2 rounded-full bg-[#111111] text-gray-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-gray-600">
            <FaBell />
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;

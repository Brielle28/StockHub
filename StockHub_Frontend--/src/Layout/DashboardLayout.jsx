import { useState } from "react";
import Sidebar from "../Components/Dashboard/Sidebar";
import Navbar from "../Components/Dashboard/Navbar";
import { FaHome, FaChartLine, FaWallet, FaNewspaper, FaBell, FaCog, FaSignOutAlt, FaBars, FaTimes, FaSearch, FaUser } from 'react-icons/fa';
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  
    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };
  
    return (
      <div className="flex h-screen bg-[#070707] text-white overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" 
            onClick={toggleSidebar}
          />
        )}
        
        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar toggleSidebar={toggleSidebar} />
          
          <main className="flex-1 overflow-y-auto bg-[#070707]">
            <Outlet/>
          </main>
        </div>
      </div>
    );
  };
  
  export default DashboardLayout;
// import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, } from 'react-router-dom';
import { FaHome, FaChartLine, FaWallet, FaNewspaper, FaBell, FaCog, FaSignOutAlt, FaBars, FaTimes, FaSearch, FaUser } from 'react-icons/fa';
import { RiStockFill } from "react-icons/ri";
const DashboardHome = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-[#111111] p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-2 text-[#d4fb2b]">Portfolio Value</h2>
        <p className="text-3xl font-bold">$12,345.67</p>
        <p className="text-green-500 mt-2">+2.5% today</p>
      </div>
      <div className="bg-[#111111] p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-2 text-[#d4fb2b]">Active Stocks</h2>
        <p className="text-3xl font-bold">15</p>
        <p className="text-gray-400 mt-2">3 stocks trending up</p>
      </div>
      <div className="bg-[#111111] p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-2 text-[#d4fb2b]">Market News</h2>
        <p className="text-lg">NASDAQ up by 1.2%</p>
        <p className="text-gray-400 mt-2">Updated 5 mins ago</p>
      </div>
    </div>
    
    <div className="mt-8 bg-[#111111] p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-[#d4fb2b]">Recent Activity</h2>
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="border-b border-gray-700 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">AAPL Stock Purchase</p>
                <p className="text-gray-400 text-sm">April 23, 2025</p>
              </div>
              <p className="text-green-500">+$420.69</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
export default DashboardHome

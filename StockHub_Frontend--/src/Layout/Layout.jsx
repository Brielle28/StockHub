// Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer"
const Layout = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  bg-cover bg-center bg-no-repeat bg-[#070707]"
    >
      <Navbar />
      <main className="flex items-center justify-center">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
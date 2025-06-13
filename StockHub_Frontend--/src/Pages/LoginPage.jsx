import React from "react";
import Login from "../Components/Auth/Log.jsx";
import "../../src/index.css"
const LoginPage = () => {
  return (
    <div className="h-screen md:min-h-screen bg-[#070707] overflow-hidden">
      <div className="flex flex-row h-screen md:min-h-screen">
        {/* Login Section */}
        <div className="w-full h-screen lg:w-1/2 flex items-center justify-center sm:px-6 lg:px-8 md:py-12 scrollbar-hidden overflow-y-scroll md:overflow-hidden">
          <Login />
        </div>

        {/* Image Section */}
        <div className="hidden w-[54%] h-screen md:flex items-center justify-center py-5 px-6">
          <div
            className="w-full h-full rounded-[30px] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/yello.webp')" }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

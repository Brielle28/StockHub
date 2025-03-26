import React from "react";
import Login from "../Components/Auth/Log.jsx";

const LoginPage = () => {
  return (
    <>
      <div className="flex md:flex-row items-center justify-center min-h-screen bg-[#070707]">
        <Login />
        <div className="w-[48%] h-screen flex items-center justify-center py-5 px-6">
        <div
          className="w-full h-full rounded-[30px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/yello.webp')" }}
        />
        </div>
          
      </div>
    </>
  );
};

export default LoginPage;

import React from "react";
import SignUp from "../Components/Auth/SignUp.jsx";

const Registration = () => {
  return (
    <div className="w-full flex md:flex-row items-center justify-center min-h-screen bg-[#070707]">
      <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen w-full">
        {/* Image Section - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block w-[50%]">
          <div className="h-screen flex items-center justify-center p-6">
            <div
              className="w-full h-full rounded-3xl bg-cover bg-center bg-no-repeat shadow-2xl"
              style={{ backgroundImage: "url('/yellow2.webp')" }}
            />
          </div>
        </div>

        {/* SignUp Form Section */}
        <SignUp />
      </div>
    </div>
  );
};

export default Registration;
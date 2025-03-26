import React from "react";
import SignUp from "../Components/Auth/SignUp.jsx";
import Forgetpassword from "../Components/Auth/Forgetpassword.jsx"
const ForgetPassword = () => {
  return (
    <>
      <div className="flex md:flex-row items-center justify-center min-h-screen bg-[#070707]">
        <div className="w-[48%] h-screen flex items-center justify-center py-5 px-6">
        <div
          className="w-full h-full rounded-[30px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/yellow3.webp')" }}
        />
        </div>
        <Forgetpassword/>
      </div>
    </>
  );
};

export default ForgetPassword;

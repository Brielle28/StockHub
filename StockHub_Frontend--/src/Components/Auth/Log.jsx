import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdWavingHand } from "react-icons/md";
import { FaGoogle, FaFacebook } from "react-icons/fa";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
    console.log("Login attempted", { email, password });
  };

  return (
    <div className="min-h-screen w-[50%] bg-transparent flex items-center justify-center px-">
      <div className="bg-transparent shadow-lg rounded-xl w-full max-w-md p-5">
        <div className="text-center mb-6">
          <div className=" font-bold text-[#d4fb2b] flex items-center justify-center">
            <h2 className="text-[40px] font-bold">Welcome Back</h2>
            <MdWavingHand className="text-[40px] ml-3 " />
          </div>
          <p className="text-gray-300 mt-">
            To keep connected with our platform, please login with your personal
            info
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400 w-5 h-5" />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#d4fb2b] rounded-lg focus:outline-none focus:ring-0 text-gray-300 placeholder:text-gray-300"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400 w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#d4fb2b] rounded-lg focus:outline-none focus:ring-0 text-gray-300 placeholder:text-gray-300"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <FaEyeSlash className="w-5 h-5" />
              ) : (
                <FaEye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex justify-end items-center">
            <a href="/forget-password" className="text-[#d4fb2b] hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#d4fb2b] text-black font-medium py-2 rounded-lg transition duration-300"
          >
            Sign In
          </button>
        </form>

        <div className="my-4  w-full flex items-center justify-between">
          <div className="h-[2px] w-[170px] bg-white" />
          <h1 className="text-white">OR</h1>
          <div className="h-[2px] w-[170px] bg-white " />
          <div />
        </div>

        <div className="space-y-4">
        <button
            type="submit"
            className="flex items-center justify-center w-full bg-[#565f17] text-black font-medium py-2 rounded-lg hover:bg-[#d4fb2b] transition duration-300"
          >
          <FaGoogle className="mr-3 text-black" size={20} />
            Sign In With Google
          </button>
          
        </div>

        <div className="mt-10 text-center">
          <a href="/signUp" className="text-gray-300">
            Don't you have an account?
            <button
              className="ml-1 text-[#d4fb2b] hover:underline focus:outline-none"
            >
              Sign up
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdWavingHand } from "react-icons/md";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    const result = await login(username, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="w-full h-screen  md:min-h-screen flex items-center justify-center bg-transparent px-4 md:py-5">
      <div className="w-full md:max-w-[500px] bg-gradient-to-b from-[#0c0c0c] to-[#1a1a1a] shadow-2xl rounded-3xl p-8 border border-gray-800">
        <div className="text-center mb-8">
          <div className="font-bold text-[#d4fb2b] flex items-center justify-center mb-4">
            <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#d4fb2b] to-[#a8d916] bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <MdWavingHand className="text-4xl ml-3 animate-bounce text-[#d4fb2b]" />
          </div>
          <p className="text-gray-400 text-[13px] md:text-base">
            Sign in to continue to your account
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-500/50 rounded-xl text-red-300 text-sm backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaUser className="text-gray-500 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-all duration-300" />
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-2 md:py-4 bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] focus:bg-[#0a0a0a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4fb2b]/20 text-gray-300 placeholder:text-gray-500 transition-all duration-300"
              required
              disabled={loading}
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaLock className="text-gray-500 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-all duration-300" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-14 py-2 md:py-4 bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] focus:bg-[#0a0a0a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4fb2b]/20 text-gray-300 placeholder:text-gray-500 transition-all duration-300"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#d4fb2b] transition-all duration-300 transform hover:scale-110"
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={loading}
            >
              {showPassword ? (
                <FaEyeSlash className="w-5 h-5" />
              ) : (
                <FaEye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex justify-end items-center">
            <Link 
              to="/forgot-password" 
              className="text-[12px] md:text-sm text-[#d4fb2b] hover:text-[#c0e429] transition-all duration-300 hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#d4fb2b] to-[#c0e429] text-black font-semibold py-[10px] md:py-4 rounded-xl hover:from-[#c0e429] hover:to-[#a8d916] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-[#d4fb2b]/25"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="md:w-5 md:h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-4 md:mt-8 text-center">
          <div className="flex items-center justify-center mb-2 md:mb-4">
            <div className="h-px bg-gray-600 flex-1"></div>
            <span className="text-gray-500 text-sm px-4">or</span>
            <div className="h-px bg-gray-600 flex-1"></div>
          </div>
          <span className="text-gray-400 text-[12px] md:text-sm">Don't have an account?</span>
          <Link 
            to="/signup" 
            className="ml-2 text-[#d4fb2b] font-semibold hover:text-[#c0e429] transition-all duration-300 hover:underline text-[12px] md:text-sm"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle, FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!termsAccepted) {
      alert("Please accept the Terms & Conditions");
      return;
    }

    // Add account creation logic here
    console.log("Account creation submitted", {
      firstName,
      lastName,
      email,
    });
  };

  return (
    <div className="w-full lg:w-[50%] h-screen overflow-y-scroll flex items-center justify-center px-4 py-8 sm:py-12 bg-transparent">
      <div className="w-full max-w-[550px] bg-[#0c0c0c] rounded-2xl shadow-2xl p-5 md:p-8 md:mt-14 mt-52">
        <h2 className="text-xl md:text-4xl font-bold text-[#d4fb2b] text-center mb-3">
          Create an account
        </h2>

        <p className="text-gray-400 text-center mb-4">
          Already have an account?
          <a href="/login" className="text-[#d4fb2b] ml-1 hover:underline">
            Login
          </a>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] rounded-lg focus:outline-none focus:ring-0 text-gray-300 placeholder:text-gray-500 transition-all"
                required
              />
            </div>
            
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] rounded-lg focus:outline-none focus:ring-0 text-gray-300 placeholder:text-gray-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-colors" />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] rounded-lg focus:outline-none focus:ring-0 text-gray-300 placeholder:text-gray-500 transition-all"
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-colors" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] rounded-lg focus:outline-none focus:ring-0 text-gray-300 placeholder:text-gray-500 transition-all"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#d4fb2b] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-colors" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] rounded-lg focus:outline-none focus:ring-0 text-gray-300 placeholder:text-gray-500 transition-all"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#d4fb2b] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
              className="w-5 h-5 mr-3 rounded-md focus:ring-[#d4fb2b] text-[#d4fb2b] border-gray-600 bg-transparent"
            />
            <label htmlFor="terms" className="text-gray-400 text-sm cursor-pointer select-none">
              I agree to the <a href="#" className="text-[#d4fb2b] hover:underline">Terms & Conditions</a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#d4fb2b] text-black font-medium py-3 rounded-lg hover:bg-[#c0e429] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
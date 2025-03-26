import React, { useState } from "react";
import { FaArrowLeft, FaEnvelope, FaLock } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
const Forgetpassword = () => {
  // States for different stages of password reset
  const [stage, setStage] = useState('email'); // 'email', 'verify-otp', 'reset-password'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Simulated OTP (in real-world, this would come from backend)
  const [generatedOtp, setGeneratedOtp] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    // Simulate OTP generation (in real application, this would be a backend call)
    const simulatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(simulatedOtp);
    
    // In a real app, you'd send this OTP to the user's email
    console.log("Generated OTP:", simulatedOtp);
    
    // Move to OTP verification stage
    setStage('verify-otp');
    setErrorMessage("");
  };

  const handleOtpVerification = (e) => {
    e.preventDefault();
    
    if (otp === generatedOtp) {
      // OTP Verified
      setStage('reset-password');
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid OTP. Please try again.");
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    
    // Password validation
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }

    // Simulate password reset (in real app, call backend API)
    console.log("Password reset for email:", email);
    
    // Reset all states or redirect to login
    setStage('email');
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    alert("Password reset successful!");
  };

  const renderEmailStage = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-4">
      <div className="relative">
        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d4fb2b]" />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-[#d4fb2b] rounded-lg focus:outline-none focus:ring-0 text-gray-300 placeholder:text-gray-300"
          required
        />
      </div>
      
      {errorMessage && (
        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
      )}
      
      <button
        type="submit"
        className="w-full bg-[#d4fb2b] text-black font-medium py-2 rounded-lg transition duration-300 hover:bg-[#a0b720]"
      >
        Send OTP
      </button>
    </form>
  );

  const renderOtpStage = () => (
    <form onSubmit={handleOtpVerification} className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <button 
          type="button" 
          onClick={() => setStage('email')} 
          className="text-[#d4fb2b] flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <p className="text-gray-400">OTP sent to {email}</p>
      </div>
      
      <input
        type="text"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength="6"
        className="w-full pl-4 pr-4 py-2 border border-[#d4fb2b] rounded-lg focus:outline-none focus:ring-0 text-gray-300 placeholder:text-gray-300 text-center tracking-[10px]"
        required
      />
      
      {errorMessage && (
        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
      )}
      
      <button
        type="submit"
        className="w-full bg-[#d4fb2b] text-black font-medium py-2 rounded-lg transition duration-300 hover:bg-[#a0b720]"
      >
        Verify OTP
      </button>
      
      <div className="text-center">
        <button 
          type="button"
          className="text-gray-400 hover:text-[#d4fb2b]"
        >
          Resend OTP
        </button>
      </div>
    </form>
  );

  const renderPasswordResetStage = () => (
    <form onSubmit={handlePasswordReset} className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <button 
          type="button" 
          onClick={() => setStage('verify-otp')} 
          className="text-[#d4fb2b] flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </div>
      
      <div className="relative">
        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d4fb2b]" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-[#d4fb2b] rounded-lg focus:outline-none focus:ring-0 text-gray-300 placeholder:text-gray-300"
          required
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      
      <div className="relative">
        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d4fb2b]" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-[#d4fb2b] rounded-lg focus:outline-none focus:ring-0 text-gray-300 placeholder:text-gray-300"
          required
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      
      {errorMessage && (
        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
      )}
      
      <button
        type="submit"
        className="w-full bg-[#d4fb2b] text-black font-medium py-2 rounded-lg transition duration-300 hover:bg-[#a0b720]"
      >
        Reset Password
      </button>
    </form>
  );

  return (
    <div className="w-[50%] min-h-screen bg-transparent flex items-center justify-center">
      <div className="w-full max-w-md bg-transparent rounded-xl shadow-lg p-6">
        <h2 className="text-[40px] font-bold text-[#d4fb2b] text-center mb-4">
          {stage === 'email' ? 'Forgot Password' : 
           stage === 'verify-otp' ? 'Verify OTP' : 
           'Reset Password'}
        </h2>

        {stage === 'email' && renderEmailStage()}
        {stage === 'verify-otp' && renderOtpStage()}
        {stage === 'reset-password' && renderPasswordResetStage()}
      </div>
    </div>
  );
};

export default Forgetpassword;
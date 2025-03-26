import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle, FaApple } from "react-icons/fa";

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
    <div className="w-[50%] min-h-screen bg-transparent flex items-center justify-center">
      <div className="w-full max-w-md bg-transparent rounded-xl shadow-lg p-3">
        <h2 className="text-[40px] font-bold text-[#d4fb2b] text-center mb-4">
          Create an account
        </h2>

        <p className="text-gray-400 text-center mb-6">
          Already have an account?
          <a href="/login" className="text-[#d4fb2b] ml-1 hover:underline">
            Login
          </a>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#d4fb2b] rounded-lg focus:outline-none focus:ring-0 text-gray-300 placeholder:text-gray-300"
              required
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#d4fb2b] rounded-lg focus:outline-none focus:ring-0 text-gray-300 placeholder:text-gray-300"
              required
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#d4fb2b] rounded-lg focus:outline-none focus:ring-0 text-gray-300 placeholder:text-gray-300"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
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

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
              className="checkbox rounded-[5px] size-5 mr-3"
              style={{
                borderColor: "#d4fb2b",
                backgroundColor: termsAccepted ? "#d4fb2b" : "transparent",
              }}
            />
            <label htmlFor="terms" className="text-gray-400">
              I agree to the Terms & Conditions
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#d4fb2b] text-black font-medium py-2 rounded-lg transition duration-300"
          >
            Create Account
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
        <div className="mt-6 text-center"></div>
      </div>
    </div>
  );
};

export default SignUp;

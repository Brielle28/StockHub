// import React, { useState } from "react";
// import {
//   FaEye,
//   FaEyeSlash,
//   FaUser,
//   FaEnvelope,
//   FaLock,
//   FaUserTag,
// } from "react-icons/fa";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../../Context/AuthContext";

// const SignUp = () => {
//   const [username, setUsername] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [error, setError] = useState("");
//   const [validationErrors, setValidationErrors] = useState([]);
//   const [submitResult, setSubmitResult] = useState(null);
//   const { register, loading } = useAuth();
//   const navigate = useNavigate();

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   let exampl = '';

//   const handleSubmit = async (e) => {
    
//     e.preventDefault();
//     setError("");
//     // setValidationErrors([]);

//     // Client-side validation
//     if (!username.trim()) {
//       setError("Username is required");
//       return;
//     }

//     if (!firstName.trim() || !lastName.trim()) {
//       setError("First name and last name are required");
//       return;
//     }

//     if (!email.trim()) {
//       setError("Email is required");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (!termsAccepted) {
//       setError("Please accept the Terms & Conditions");
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters long");
//       return;
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     const userData = {
//       username,
//       firstName,
//       lastName,
//       email,
//       password,
//     };

//     try {
//       const result = await register(userData);

//       setValidationErrors(result)
//       if (result.success) {
//         navigate("/dashboard");
//       } 
//       else {
//         setError(result.error);
//         console.log(result.error, "this is error");
//         setSubmitResult(result.formattedErrors);
//         console.log(result, "this is result")
//         // Access individual error details
//         if (result.formattedErrors && result.formattedErrors.length > 0) {
//           result.formattedErrors.forEach((err) => {
//             console.log("Error code:", err.code);
//             console.log("Description:", err.description);
//           });

//           // Get just the descriptions for display
//           const errorDescriptions =  result.formattedErrors.map(
//             (err) => err.description
//           );

//           exampl = errorDescriptions
//           // setValidationErrors(errorDescriptions);
//           console.log(validationErrors, "main sign");
//           console.log(exampl, "error description")
//           console.log(result.formattedErrors[0].code, "formatted"); // should show array of error objects
//           console.log(result.formattedErrors, "formatted2");
//           // should show array of error objects
//           console.log(setSubmitResult, "sub");
//         } else {
//           // Clear validation errors if there are none
//           setValidationErrors([]);
//           console.log('here!!!!!!!!!!!!!');
          
//         }
//       }
//     } catch (err) {
//       setError("An unexpected error occurred. Please try again.");
//       setSubmitResult(null);
//       console.error("Registration error:", err);
//     }
//   };
//   console.log(exampl, "main sign");

//   return (
//     <div className="min-h-screen md:h-[60vh] flex items-center justify-center bg-transparent px-4 overflow-y-scroll">
//       <div className="w-full max-w-xl bg-gradient-to-b from-[#0c0c0c] to-[#1a1a1a] rounded-3xl shadow-2xl p-8 border border-gray-800">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-[#d4fb2b] to-[#a8d916] bg-clip-text text-transparent mb-3">
//             Create Your Account
//           </h2>
//           <div className="flex items-center justify-center">
//             <span className="text-gray-400 text-sm">
//               Already have an account?
//             </span>
//             <Link
//               to="/login"
//               className="ml-2 text-[#d4fb2b] font-semibold hover:text-[#c0e429] transition-all duration-300 hover:underline text-sm"
//             >
//               Sign In
//             </Link>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-500/50 rounded-xl text-red-300 text-sm backdrop-blur-sm">
//             <div className="flex items-center">
//               <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
//               {error}
//             </div>
//           </div>
//         )}

//         {/* {submitResult?.formattedErrors &&
//           submitResult.formattedErrors.length > 0 && (
//             <div className="mb-6 p-4 bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-500/50 rounded-xl text-red-300 text-sm backdrop-blur-sm">
//               <div className="flex items-start">
//                 <div className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
//                 <ul className="list-none space-y-1">
//                   {submitResult.formattedErrors.map((err, index) => (
//                     <li key={index}>{err.description}</li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           )} */}

//         {validationErrors && validationErrors.length > 0 &&   (
//           <div className="mb-6 p-4 bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-500/50 rounded-xl text-red-300 text-sm backdrop-blur-sm">
//             <div className="flex items-start">
//               <div className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
//               <ul className="list-none space-y-1">
//                 {validationErrors.map((errorDesc, index) => (
//                   <li key={index}>{errorDesc}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Username Field */}
//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <FaUserTag className="text-gray-500 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-all duration-300" />
//             </div>
//             <input
//               type="text"
//               placeholder="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full pl-12 pr-4 py-[10px] bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] focus:bg-[#0a0a0a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4fb2b]/20 text-gray-300 placeholder:text-gray-500 transition-all duration-300"
//               required
//               disabled={loading}
//             />
//           </div>

//           {/* Name Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <FaUser className="text-gray-500 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-all duration-300" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="First Name"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 className="w-full pl-12 pr-4 py-[10px] bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] focus:bg-[#0a0a0a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4fb2b]/20 text-gray-300 placeholder:text-gray-500 transition-all duration-300"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <FaUser className="text-gray-500 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-all duration-300" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Last Name"
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//                 className="w-full pl-12 pr-4 py-[10px] bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] focus:bg-[#0a0a0a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4fb2b]/20 text-gray-300 placeholder:text-gray-500 transition-all duration-300"
//                 required
//                 disabled={loading}
//               />
//             </div>
//           </div>

//           {/* Email Field */}
//           <div className="relative group">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <FaEnvelope className="text-gray-500 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-all duration-300" />
//             </div>
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full pl-12 pr-4 py-[10px] bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] focus:bg-[#0a0a0a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4fb2b]/20 text-gray-300 placeholder:text-gray-500 transition-all duration-300"
//               required
//               disabled={loading}
//             />
//           </div>

//           {/* Password Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 pl-4  flex items-center  pointer-events-none">
//                 <FaLock className="text-gray-500 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-all duration-300" />
//               </div>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full pl-12 pr-14 py-[10px] bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] focus:bg-[#0a0a0a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4fb2b]/20 text-gray-300 placeholder:text-gray-500 transition-all duration-300"
//                 required
//                 disabled={loading}
//               />
//               <button
//                 type="button"
//                 onClick={togglePasswordVisibility}
//                 className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#d4fb2b] transition-all duration-300 transform hover:scale-110"
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//                 disabled={loading}
//               >
//                 {showPassword ? (
//                   <FaEyeSlash className="w-5 h-5" />
//                 ) : (
//                   <FaEye className="w-5 h-5" />
//                 )}
//               </button>
//             </div>

//             <div className="relative group">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <FaLock className="text-gray-500 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-all duration-300" />
//               </div>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="w-full pl-12 pr-4 py-[10px] bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] focus:bg-[#0a0a0a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4fb2b]/20 text-gray-300 placeholder:text-gray-500 transition-all duration-300"
//                 required
//                 disabled={loading}
//               />
//             </div>
//           </div>

//           {/* Terms Checkbox */}
//           <div className="flex items-start space-x-3">
//             <div className="flex items-center h-6 mt-1">
//               <input
//                 type="checkbox"
//                 id="terms"
//                 checked={termsAccepted}
//                 onChange={() => setTermsAccepted(!termsAccepted)}
//                 className="w-5 h-5 rounded-md border-2 border-gray-600 bg-transparent checked:bg-[#d4fb2b] checked:border-[#d4fb2b] focus:ring-2 focus:ring-[#d4fb2b]/20 transition-all duration-300"
//                 disabled={loading}
//               />
//             </div>
//             <label
//               htmlFor="terms"
//               className="text-gray-400 text-sm cursor-pointer select-none leading-6"
//             >
//               I agree to the{" "}
//               <a
//                 href="#"
//                 className="text-[#d4fb2b] hover:text-[#c0e429] transition-all duration-300 hover:underline font-medium"
//               >
//                 Terms & Conditions
//               </a>{" "}
//               and{" "}
//               <a
//                 href="#"
//                 className="text-[#d4fb2b] hover:text-[#c0e429] transition-all duration-300 hover:underline font-medium"
//               >
//                 Privacy Policy
//               </a>
//             </label>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-[#d4fb2b] to-[#c0e429] text-black font-semibold py-4 rounded-xl hover:from-[#c0e429] hover:to-[#a8d916] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-[#d4fb2b]/25"
//           >
//             {loading ? (
//               <div className="flex items-center justify-center">
//                 <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>
//                 Creating Account...
//               </div>
//             ) : (
//               "Create Account"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignUp;
import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserTag,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [submitResult, setSubmitResult] = useState(null);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // This useEffect will run whenever validationErrors changes
  useEffect(() => {
    if (validationErrors.length > 0) {
      console.log(validationErrors, "Updated validation errors");
      // You can perform any additional logic here when validation errors are updated
      console.log(validationErrors), "thy";
    }
  }, [validationErrors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    const userData = {
      username,
      firstName,
      lastName,
      email,
      password,
    };

    try {
      const result = await register(userData);

      if (result.success) {
        navigate("/login");
      } else {
        setError(result.error);
        console.log(result.error, "this is error");
        setSubmitResult(result.formattedErrors);
        console.log(result, "this is result");

        // Access individual error details
        if (result.formattedErrors && result.formattedErrors.length > 0) {
          result.formattedErrors.forEach((err) => {
            console.log("Error code:", err.code);
            console.log("Description:", err.description);
          });

          // Get just the descriptions for display
          const errorDescriptions = result.formattedErrors.map(
            (err) => err.description
          );

          // Set the validation errors - this will trigger the useEffect above
          setValidationErrors(errorDescriptions);
          
          console.log(result.formattedErrors[0].code, "formatted");
          console.log(result.formattedErrors, "formatted2");
        } else {
          // Clear validation errors if there are none
          setValidationErrors([]);
          console.log('No validation errors');
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setSubmitResult(null);
      setValidationErrors([]);
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen md:h-[60vh] flex items-center justify-center bg-transparent px-4 overflow-y-scroll">
      <div className="w-full max-w-xl bg-gradient-to-b from-[#0c0c0c] to-[#1a1a1a] rounded-3xl shadow-2xl p-8 border border-gray-800">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-[#d4fb2b] to-[#a8d916] bg-clip-text text-transparent mb-3">
            Create Your Account
          </h2>
          <div className="flex items-center justify-center">
            <span className="text-gray-400 text-sm">
              Already have an account?
            </span>
            <Link
              to="/login"
              className="ml-2 text-[#d4fb2b] font-semibold hover:text-[#c0e429] transition-all duration-300 hover:underline text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-500/50 rounded-xl text-red-300 text-sm backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
              {error}
            </div>
          </div>
        )}

        {validationErrors && validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-500/50 rounded-xl text-red-300 text-sm backdrop-blur-sm">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
              <ul className="list-none space-y-1">
                {validationErrors.map((errorDesc, index) => (
                  <li key={index}>{errorDesc}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaUserTag className="text-gray-500 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-all duration-300" />
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-[10px] bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] focus:bg-[#0a0a0a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4fb2b]/20 text-gray-300 placeholder:text-gray-500 transition-all duration-300"
              required
              disabled={loading}
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaUser className="text-gray-500 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-all duration-300" />
              </div>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-12 pr-4 py-[10px] bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] focus:bg-[#0a0a0a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4fb2b]/20 text-gray-300 placeholder:text-gray-500 transition-all duration-300"
                required
                disabled={loading}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaUser className="text-gray-500 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-all duration-300" />
              </div>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full pl-12 pr-4 py-[10px] bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] focus:bg-[#0a0a0a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4fb2b]/20 text-gray-300 placeholder:text-gray-500 transition-all duration-300"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-500 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-all duration-300" />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-[10px] bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] focus:bg-[#0a0a0a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4fb2b]/20 text-gray-300 placeholder:text-gray-500 transition-all duration-300"
              required
              disabled={loading}
            />
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4  flex items-center  pointer-events-none">
                <FaLock className="text-gray-500 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-all duration-300" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-14 py-[10px] bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] focus:bg-[#0a0a0a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4fb2b]/20 text-gray-300 placeholder:text-gray-500 transition-all duration-300"
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

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaLock className="text-gray-500 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-all duration-300" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-[10px] bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] focus:bg-[#0a0a0a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4fb2b]/20 text-gray-300 placeholder:text-gray-500 transition-all duration-300"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start space-x-3">
            <div className="flex items-center h-6 mt-1">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="w-5 h-5 rounded-md border-2 border-gray-600 bg-transparent checked:bg-[#d4fb2b] checked:border-[#d4fb2b] focus:ring-2 focus:ring-[#d4fb2b]/20 transition-all duration-300"
                disabled={loading}
              />
            </div>
            <label
              htmlFor="terms"
              className="text-gray-400 text-sm cursor-pointer select-none leading-6"
            >
              I agree to the{" "}
              <a
                href="#"
                className="text-[#d4fb2b] hover:text-[#c0e429] transition-all duration-300 hover:underline font-medium"
              >
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-[#d4fb2b] hover:text-[#c0e429] transition-all duration-300 hover:underline font-medium"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#d4fb2b] to-[#c0e429] text-black font-semibold py-4 rounded-xl hover:from-[#c0e429] hover:to-[#a8d916] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-[#d4fb2b]/25"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
// import React, { useState } from "react";
// import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// import { MdWavingHand } from "react-icons/md";
// import { FaGoogle, FaFacebook } from "react-icons/fa";
// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Add login logic here
//     console.log("Login attempted", { email, password });
//   };

//   return (
//     <div className="min-h-screen w-[50%] bg-transparent flex items-center justify-center px-">
//       <div className="bg-transparent shadow-lg rounded-xl w-full max-w-md p-5">
//         <div className="text-center mb-6">
//           <div className=" font-bold text-[#d4fb2b] flex items-center justify-center">
//             <h2 className="text-[40px] font-bold">Welcome Back</h2>
//             <MdWavingHand className="text-[40px] ml-3 " />
//           </div>
//           <p className="text-gray-300 mt-">
//             To keep connected with our platform, please login with your personal
//             info
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaEnvelope className="text-gray-400 w-5 h-5" />
//             </div>
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-[#d4fb2b] rounded-lg focus:outline-none focus:ring-0 text-gray-300 placeholder:text-gray-300"
//               required
//             />
//           </div>

//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaLock className="text-gray-400 w-5 h-5" />
//             </div>
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-[#d4fb2b] rounded-lg focus:outline-none focus:ring-0 text-gray-300 placeholder:text-gray-300"
//               required
//             />
//             <button
//               type="button"
//               onClick={togglePasswordVisibility}
//               className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//             >
//               {showPassword ? (
//                 <FaEyeSlash className="w-5 h-5" />
//               ) : (
//                 <FaEye className="w-5 h-5" />
//               )}
//             </button>
//           </div>

//           <div className="flex justify-end items-center">
//             <a href="/forget-password" className="text-[#d4fb2b] hover:underline">
//               Forgot Password?
//             </a>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-[#d4fb2b] text-black font-medium py-2 rounded-lg transition duration-300"
//           >
//             Sign In
//           </button>
//         </form>

//         <div className="my-4  w-full flex items-center justify-between">
//           <div className="h-[2px] w-[170px] bg-white" />
//           <h1 className="text-white">OR</h1>
//           <div className="h-[2px] w-[170px] bg-white " />
//           <div />
//         </div>

//         <div className="space-y-4">
//         <button
//             type="submit"
//             className="flex items-center justify-center w-full bg-[#565f17] text-black font-medium py-2 rounded-lg hover:bg-[#d4fb2b] transition duration-300"
//           >
//           <FaGoogle className="mr-3 text-black" size={20} />
//             Sign In With Google
//           </button>
          
//         </div>

//         <div className="mt-10 text-center">
//           <a href="/signUp" className="text-gray-300">
//             Don't you have an account?
//             <button
//               className="ml-1 text-[#d4fb2b] hover:underline focus:outline-none"
//             >
//               Sign up
//             </button>
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { MdWavingHand } from "react-icons/md";

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
    <div className="w-full max-w-md mx-auto bg-[#0c0c0c] shadow-2xl rounded-2xl p-6 sm:p-8">
      <div className="text-center mb-8 w-full">
        <div className="font-bold text-[#d4fb2b] flex items-center justify-center mb-3 w-full">
          <h2 className="md:text-3xl text-[25px] font-bold">Welcome Back</h2>
          <MdWavingHand className="text-3xl sm:text-4xl ml-3 animate-pulse" />
        </div>
        <p className="text-gray-300 text-sm sm:text-base">
          To keep connected with our platform, please login with your personal info
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaEnvelope className="text-gray-400 w-5 h-5 group-focus-within:text-[#d4fb2b] transition-colors" />
          </div>
          <input
            type="email"
            placeholder="Email Address"
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-3 bg-[#111111] border border-[#333333] focus:border-[#d4fb2b] rounded-lg focus:outline-none focus:ring-0 text-gray-300 placeholder:text-gray-500 transition-all"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#d4fb2b] transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FaEyeSlash className="w-5 h-5" />
            ) : (
              <FaEye className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex justify-end items-center">
          <a href="/forget-password" className="text-sm text-[#d4fb2b] hover:underline transition-all">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-[#d4fb2b] text-black font-medium py-3 rounded-lg hover:bg-[#c0e429] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Sign In
        </button>
      </form>

      <div className="my-6 flex items-center justify-between">
        <div className="h-[1px] flex-1 bg-gray-700" />
        <h1 className="text-gray-400 mx-4 text-sm">OR</h1>
        <div className="h-[1px] flex-1 bg-gray-700" />
      </div>

      <div className="space-y-4">
        <button
          type="button"
          className="flex items-center justify-center w-full bg-[#1e2104] text-white font-medium py-3 rounded-lg hover:bg-[#2d3206] transition-all duration-300"
        >
          <FaGoogle className="mr-3 text-[#d4fb2b]" size={18} />
          <span>Sign In With Google</span>
        </button>
      </div>

      <div className="mt-8 text-center">
        <span className="text-gray-400 text-sm">Don't have an account?</span>
        <a 
          href="/signUp" 
          className="ml-1 text-[#d4fb2b] font-medium hover:underline focus:outline-none text-sm"
        >
          Sign up
        </a>
      </div>
    </div>
  );
};

export default Login;
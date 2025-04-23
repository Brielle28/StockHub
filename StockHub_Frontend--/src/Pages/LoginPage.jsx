// import React from "react";
// import Login from "../Components/Auth/Log.jsx";

// const LoginPage = () => {
//   return (
//     <>
//       <div className="flex md:flex-row items-center justify-center min-h-screen bg-[#070707]">
//         <Login />
//         <div className="w-[48%] h-screen flex items-center justify-center py-5 px-6">
//         <div
//           className="w-full h-full rounded-[30px] bg-cover bg-center bg-no-repeat"
//           style={{ backgroundImage: "url('/yello.webp')" }}
//         />
//         </div>
          
//       </div>
//     </>
//   );
// };

// export default LoginPage;
import React from "react";
import Login from "../Components/Auth/Log.jsx";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[#070707] overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Login Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <Login />
        </div>
        
        {/* Image Section */}
        <div className="hidden lg:flex w-1/2 h-screen relative">
          <div
            className="absolute inset-0 m-4 rounded-3xl bg-cover bg-center bg-no-repeat shadow-2xl transform transition-transform duration-700 hover:scale-[1.01]"
            style={{ backgroundImage: "url('/yello.webp')" }}
          />
          <div className="absolute inset-0 m-4 rounded-3xl bg-black bg-opacity-10 backdrop-blur-sm" />
          <div className="absolute bottom-12 left-12 max-w-md">
            <h2 className="text-4xl font-bold text-white mb-4">Trading Made Simple</h2>
            <p className="text-white text-opacity-80">
              Access your portfolio, market insights, and trading tools in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
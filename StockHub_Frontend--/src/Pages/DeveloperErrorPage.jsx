// import { useRouteError, Link, useNavigate } from "react-router-dom";
// import { useState } from "react";

// const DeveloperErrorPage = () => {
//   const error = useRouteError();
//   const navigate = useNavigate();
//   const [showDetails, setShowDetails] = useState(false);

//   // Determine if this is a development environment
//   const isDevelopment = import.meta.env.DEV === 'development';

//   // Parse error information
//   const errorInfo = {
//     message: error?.message || "An unexpected error occurred",
//     stack: error?.stack || error?.error?.stack || "No stack trace available",
//     name: error?.name || error?.error?.name || "Error",
//     status: error?.status,
//     statusText: error?.statusText,
//   };

//   // Check if it's a component/reference error
//   const isComponentError = errorInfo.message.includes("is not defined") || 
//                           errorInfo.message.includes("Cannot read properties") ||
//                           errorInfo.stack.includes("ReferenceError");

//   const handleGoBack = () => {
//     if (window.history.length > 1) {
//       navigate(-1);
//     } else {
//       navigate("/");
//     }
//   };

//   const handleRefresh = () => {
//     window.location.reload();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
//               <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//             </div>
//             <h1 className="text-3xl font-extrabold text-gray-900">
//               {isComponentError ? "Component Error" : "Application Error"}
//             </h1>
//             <p className="mt-2 text-lg text-gray-600">
//               {isComponentError 
//                 ? "A component failed to load properly" 
//                 : "Something went wrong in the application"
//               }
//             </p>
//           </div>

//           {/* Error Summary */}
//           <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-red-800">
//                   {errorInfo.name}: {errorInfo.message}
//                 </h3>
//                 {errorInfo.status && (
//                   <p className="text-sm text-red-700 mt-1">
//                     Status: {errorInfo.status} {errorInfo.statusText}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Suggested Solutions for Component Errors */}
//           {isComponentError && (
//             <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
//               <h3 className="text-sm font-medium text-blue-800 mb-2">
//                 💡 Possible Solutions:
//               </h3>
//               <ul className="text-sm text-blue-700 space-y-1">
//                 <li>• Check if the component is properly imported</li>
//                 <li>• Verify the component name spelling and export/import syntax</li>
//                 <li>• Ensure all dependencies are installed</li>
//                 <li>• Check for circular imports</li>
//                 <li>• Restart the development server</li>
//               </ul>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3 mb-6">
//             <button
//               onClick={handleRefresh}
//               className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
//             >
//               🔄 Refresh Page
//             </button>
//             <button
//               onClick={handleGoBack}
//               className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
//             >
//               ← Go Back
//             </button>
//             <Link
//               to="/"
//               className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-center"
//             >
//               🏠 Home
//             </Link>
//           </div>

//           {/* Technical Details (Development Only) */}
//           {isDevelopment && (
//             <div className="border-t border-gray-200 pt-6">
//               <button
//                 onClick={() => setShowDetails(!showDetails)}
//                 className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 mb-4"
//               >
//                 <svg 
//                   className={`h-4 w-4 mr-2 transform transition-transform ${showDetails ? 'rotate-90' : ''}`} 
//                   fill="none" 
//                   viewBox="0 0 24 24" 
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//                 {showDetails ? 'Hide' : 'Show'} Technical Details
//               </button>

//               {showDetails && (
//                 <div className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-auto">
//                   <h4 className="text-sm font-medium text-gray-300 mb-2">Stack Trace:</h4>
//                   <pre className="text-xs whitespace-pre-wrap font-mono">
//                     {errorInfo.stack}
//                   </pre>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Footer */}
//           <div className="text-center text-xs text-gray-500 mt-6">
//             {isDevelopment ? 
//               "Development Mode - Technical details available above" : 
//               "If this error persists, please contact support"
//             }
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeveloperErrorPage;
import { useState } from "react";

const DeveloperErrorPage = ({ error }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Determine if this is a development environment
  const isDevelopment = import.meta.env.DEV === 'development';

  // Parse error information (using mock data for demo)
  const errorInfo = {
    message: error?.message || "Component 'StockChart' is not defined",
    stack: error?.stack || `ReferenceError: StockChart is not defined
    at StockDashboard (/src/components/Dashboard.jsx:15:12)
    at renderWithHooks (/node_modules/react-dom/cjs/react-dom.development.js:14803:18)
    at mountIndeterminateComponent (/node_modules/react-dom/cjs/react-dom.development.js:17482:13)
    at beginWork (/node_modules/react-dom/cjs/react-dom.development.js:18596:16)`,
    name: error?.name || "ReferenceError",
    status: error?.status,
    statusText: error?.statusText,
  };

  // Check if it's a component/reference error
  const isComponentError = errorInfo.message.includes("is not defined") || 
                          errorInfo.message.includes("Cannot read properties") ||
                          errorInfo.stack.includes("ReferenceError");

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-gray-900 border border-gray-800 py-12 px-6 shadow-2xl sm:rounded-2xl sm:px-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-900/20 border border-red-700/30 mb-6">
              <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4 leading-tight">
              {isComponentError ? "Component Error" : "Application Error"}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {isComponentError 
                ? "A component failed to load properly in StockHub" 
                : "Something went wrong in the StockHub application"
              }
            </p>
          </div>

          {/* Error Summary */}
          <div className="bg-red-900/10 border border-red-700/30 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-300 mb-2">
                  {errorInfo.name}: {errorInfo.message}
                </h3>
                {errorInfo.status && (
                  <p className="text-red-400">
                    Status: {errorInfo.status} {errorInfo.statusText}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Suggested Solutions for Component Errors */}
          {isComponentError && (
            <div className="bg-[#d4fb2b]/5 border border-[#d4fb2b]/20 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-[#d4fb2b] mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Possible Solutions
              </h3>
              <ul className="text-gray-300 space-y-3">
                <li className="flex items-start">
                  <span className="text-[#d4fb2b] mr-3 mt-1">•</span>
                  Check if the component is properly imported
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4fb2b] mr-3 mt-1">•</span>
                  Verify the component name spelling and export/import syntax
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4fb2b] mr-3 mt-1">•</span>
                  Ensure all dependencies are installed
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4fb2b] mr-3 mt-1">•</span>
                  Check for circular imports
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4fb2b] mr-3 mt-1">•</span>
                  Restart the development server
                </li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button
              onClick={handleRefresh}
              className="flex-1 bg-transparent border border-[#d4fb2b] text-white font-medium py-3 px-6 rounded-full hover:bg-[#d4fb2b] hover:text-black transition-all duration-300 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8.002 8.002 0 0115.356 2M15 15v5h.582M4.582 15H9m6.926-2A8.001 8.001 0 0015.582 15" />
              </svg>
              Refresh Page
            </button>
            <button
              onClick={handleGoBack}
              className="flex-1 bg-transparent border border-gray-600 text-gray-300 font-medium py-3 px-6 rounded-full hover:bg-gray-600 hover:text-white transition-all duration-300 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </button>
            <button
              onClick={handleHome}
              className="flex-1 bg-transparent border border-gray-600 text-gray-300 font-medium py-3 px-6 rounded-full hover:bg-gray-600 hover:text-white transition-all duration-300 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </button>
          </div>

          {/* Technical Details (Development Only) */}
          {isDevelopment && (
            <div className="border-t border-gray-700 pt-8">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center text-gray-300 hover:text-[#d4fb2b] mb-6 transition-colors duration-300 group"
              >
                <svg 
                  className={`h-5 w-5 mr-3 transform transition-all duration-300 group-hover:text-[#d4fb2b] ${showDetails ? 'rotate-90' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-medium">
                  {showDetails ? 'Hide' : 'Show'} Technical Details
                </span>
              </button>

              {showDetails && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 overflow-auto">
                  <h4 className="text-[#d4fb2b] font-semibold mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Stack Trace
                  </h4>
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                    {errorInfo.stack}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-gray-500 mt-8 pt-6 border-t border-gray-700">
            {isDevelopment ? 
              "Development Mode - Technical details available above" : 
              "If this error persists, please contact StockHub support"
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperErrorPage;
import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiAlertTriangle,
  FiRefreshCw,
  FiArrowLeft,
  FiMail,
} from "react-icons/fi";

const ErrorPage = ({
  errorCode = "404",
  errorTitle = "Oops! Page Not Found",
  errorMessage = "The page you're looking for seems to have wandered off into the digital void.",
  onHomeClick = () => (window.location.href = "/"),
  onBackClick = () => window.history.back(),
  autoRedirectTime = 180, // 3 minutes in seconds
  showBackButton = true,
  showContactSupport = false,
}) => {
  const [countdown, setCountdown] = useState(autoRedirectTime);
  const [isVisible, setIsVisible] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);

    // Glitch effect for error code
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 4000);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onHomeClick();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(glitchInterval);
    };
  }, [onHomeClick, autoRedirectTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(212, 251, 43, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 251, 43, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-[#d4fb2b] to-transparent opacity-20 blur-xl"
            style={{
              width: `${60 + Math.random() * 100}px`,
              height: `${60 + Math.random() * 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-orb ${
                8 + Math.random() * 10
              }s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Animated geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-[#d4fb2b] border-opacity-20 rounded-full animate-spin-slow" />
        <div
          className="absolute top-3/4 right-1/4 w-24 h-24 border border-[#d4fb2b] border-opacity-15 rotate-45 animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-[#d4fb2b] bg-opacity-10 rounded-lg animate-bounce-slow" />
        <div
          className="absolute top-1/2 right-1/3 w-20 h-20 border-2 border-[#d4fb2b] border-opacity-25 transform rotate-12 animate-pulse"
          style={{ animationDuration: "6s" }}
        />
      </div>

      {/* Main content container */}
      <div
        className={`relative z-10 text-center max-w-3xl mx-auto transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Error icon with enhanced glow */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#d4fb2b] rounded-full blur-2xl opacity-30 animate-pulse scale-150" />
          <div className="relative bg-[#111111] bg-opacity-80 backdrop-blur-sm rounded-full p-8 border-2 border-[#d4fb2b] border-opacity-40 inline-block shadow-2xl">
            <FiAlertTriangle
              className="w-20 h-20 text-[#d4fb2b] animate-bounce"
              style={{ animationDuration: "2s" }}
            />
          </div>
        </div>

        {/* Error code with advanced glitch effect */}
        <div className="relative mb-6">
          <h1
            className={`text-8xl md:text-9xl lg:text-[12rem] font-black text-[#d4fb2b] transition-all duration-500 ${
              glitchActive ? "animate-pulse scale-105" : ""
            }`}
            style={{
              textShadow: glitchActive
                ? "0 0 10px #d4fb2b, 0 0 20px #d4fb2b, 0 0 40px #d4fb2b"
                : "0 0 20px rgba(212, 251, 43, 0.5)",
            }}
          >
            {errorCode}
          </h1>
          {/* Glitch layers */}
          <div
            className={`absolute inset-0 text-8xl md:text-9xl lg:text-[12rem] font-black text-red-500 opacity-0 ${
              glitchActive ? "opacity-30 animate-ping" : ""
            }`}
            style={{ transform: "translate(-2px, -2px)" }}
          >
            {errorCode}
          </div>
          <div
            className={`absolute inset-0 text-8xl md:text-9xl lg:text-[12rem] font-black text-blue-500 opacity-0 ${
              glitchActive ? "opacity-20 animate-ping" : ""
            }`}
            style={{ transform: "translate(2px, 2px)" }}
          >
            {errorCode}
          </div>
        </div>

        {/* Error title */}
        <h2
          className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-200 mb-6 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {errorTitle}
        </h2>

        {/* Error message */}
        <p
          className={`text-gray-400 text-lg md:text-xl lg:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {errorMessage}
        </p>

        {/* Action buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button
            onClick={onHomeClick}
            className="group relative px-8 py-4 bg-transparent border-2 border-[#d4fb2b] rounded-xl text-[#d4fb2b] hover:bg-[#d4fb2b] hover:text-black transition-all duration-300 flex items-center space-x-3 overflow-hidden font-semibold text-lg shadow-lg hover:shadow-[#d4fb2b]/25 hover:shadow-2xl transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-[#d4fb2b] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            <FiHome className="relative z-10 w-6 h-6" />
            <span className="relative z-10">Take Me Home</span>
          </button>

          {showBackButton && (
            <button
              onClick={onBackClick}
              className="group relative px-8 py-4 bg-gray-800 bg-opacity-80 backdrop-blur-sm border-2 border-gray-600 rounded-xl text-gray-300 hover:border-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300 flex items-center space-x-3 font-semibold text-lg shadow-lg transform hover:scale-105"
            >
              <FiArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Go Back</span>
            </button>
          )}

          <button
            onClick={() => window.location.reload()}
            className="group relative px-8 py-4 bg-gray-800 bg-opacity-80 backdrop-blur-sm border-2 border-gray-600 rounded-xl text-gray-300 hover:border-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300 flex items-center space-x-3 font-semibold text-lg shadow-lg transform hover:scale-105"
          >
            <FiRefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
            <span>Try Again</span>
          </button>
        </div>

        {/* Contact support (conditional) */}
        {showContactSupport && (
          <div
            className={`mb-8 transition-all duration-700 delay-800 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <button
              onClick={() =>
                (window.location.href = "mailto:support@yoursite.com")
              }
              className="inline-flex items-center space-x-2 text-gray-500 hover:text-[#d4fb2b] transition-colors duration-300"
            >
              <FiMail className="w-4 h-4" />
              <span className="text-sm">Need help? Contact Support</span>
            </button>
          </div>
        )}

        {/* Enhanced countdown timer */}
        <div
          className={`inline-flex items-center space-x-4 bg-[#111111] bg-opacity-90 backdrop-blur-md border border-gray-700 rounded-2xl px-8 py-4 shadow-2xl transition-all duration-700 delay-900 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="relative">
            <div className="w-4 h-4 bg-[#d4fb2b] rounded-full animate-pulse" />
            <div className="absolute inset-0 w-4 h-4 bg-[#d4fb2b] rounded-full animate-ping opacity-30" />
            <div
              className="absolute inset-0 w-4 h-4 bg-[#d4fb2b] rounded-full animate-ping opacity-20"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
          <div className="text-center">
            <div className="text-[#d4fb2b] font-mono font-bold text-2xl tracking-wider">
              {formatTime(countdown)}
            </div>
            <div className="text-gray-500 text-sm mt-1">
              Auto-redirect to home
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-orb {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
          }
          50% {
            transform: translateY(-10px) translateX(-10px) rotate(180deg);
          }
          75% {
            transform: translateY(-30px) translateX(5px) rotate(270deg);
          }
        }

        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.05);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;

import { FaGooglePlay, FaApple, FaSpaceShuttle } from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-7xl flex flex-col md:items-center md:justify-center text-center mt-10 md:mt-14 lg:mt-20">
        {/* Hero Content */}
        <div className="w-full flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-300 font-bold mb-4 sm:mb-5 leading-tight">
            Precision Investing and Personalized Insights with{" "}
            <span className="text-[#d4fb2b]">StockHub</span>: Unlock the Power
            of Smart Investing
          </h1>
          
          <p className="text-gray-700 text-center text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-md sm:max-w-lg md:max-w-2xl mx-auto">
            Our platform combines advanced data analytics, intuitive design, and
            deep market understanding to demystify investing
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center w-full max-w-xs sm:max-w-md">
            <a
              href="/login"
              className="flex items-center justify-center bg-transparent border border-[#d4fb2b] text-white font-medium px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#d4fb2b] hover:text-black transition-colors duration-300 w-full"
            >
              Login
            </a>
            <a
              href="/signUp"
              className="flex items-center justify-center bg-transparent border border-[#d4fb2b] text-white font-medium px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#d4fb2b] hover:text-black transition-colors duration-300 w-full"
            >
              Get Started
            </a>
          </div>
        </div>

        {/* Phone Mockup */}
        <div className="w-full flex justify-center mt-8 sm:mt-12 md:mt-16">
          <div className="relative w-60 sm:w-72 md:w-80 lg:w-96 mx-auto">
            <img
              src="/phone.png"
              alt="StockHub Trading App"
              className="w-full h-auto transform shadow-2xl rounded-3xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
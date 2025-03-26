import { FaGooglePlay, FaApple } from "react-icons/fa";
import { FaSpaceShuttle } from "react-icons/fa";
const Home = () => {
  return (
    <>
      <div className="w-full md:w-[75%] flex flex-col items-center justify-center text-center px-8 md:px-11 mt-14">
        {/* <button className="flex items-center justify-center gap-1 px-3 py-2 rounded-[30px] bg-[#1A1C0D] text-[#d4fb2b]">
          <FaSpaceShuttle className="-rotate-45 size-[25px]" />
          <h1 className="text-[15px] font-semibold">GROW FASTER</h1>{" "}
        </button> */}
        <div className="w-full flex flex-col items-center justify-center text-center mt-">
          <h1 className="text-[45px] text-gray-300 font-bold mb-5 leading-[50px]">
            Precision Investing and Personalized Insights with{" "}
            <span className="text-[#d4fb2b]"> StockHub</span>: Unlock the Power
            of Smart Investing
          </h1>
          <p className="text-gray-700 text-center text-[20px] mb-4 max-w-xl mx-auto md:mx-0">
            Our platform combines advanced data analytics, intuitive design, and
            deep market understanding to demystify investing
          </p>

          <div className="flex space-x-4 justify-center md:justify-start">
            <a
              href="#"
              className="flex items-center bg-transparent border-[1px] border-[#d4fb2b] text-white font-medium px-8 py-1 rounded-full hover:bg-[#d4fb2b] hover:text-black"
            >
              Login
            </a>
            <a
              href="#"
              className="flex items-center bg-transparent border-[1px] border-[#d4fb2b] text-white font-medium px-4 py-1 rounded-full hover:bg-[#d4fb2b] hover:text-black"
            >
              Get Started
            </a>
          </div>
        </div>

        {/* Phone Mockup */}
        <div className="w-full md:w-1/2 flex justify-center mt-9 ">
          <div className="relative w-64 md:w-80 lg:w-96">
            <img
              src="/phone.png"
              alt="Stoxis Trading App"
              className="w-full h-auto transform shadow-2xl rounded-3xl"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

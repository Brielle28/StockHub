import { AiOutlineStock } from "react-icons/ai";
import { RiStockFill } from "react-icons/ri";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <>
      <nav className="flex justify-between items-center w-full md:w-[60%] p-4 md:py-1 rounded-[200px] shadow-2xl px-8 md:px-10 bg-[#0F0F0F] mt-10">
        <div className="text-2xl font-bold text-white flex items-center">
          <RiStockFill className="text-[#d4fb2b] text-[40px]" />
          <h1 className="text-[#d4fb2b] font-bold">StockHub</h1>
        </div>
        <div className="space-x-4 hidden md:block text-gray-200">
          <a href="#" className="hover:text-[#d4fb2b]">
            How it Works
          </a>
          <a href="#" className="hover:text-[#d4fb2b]">
            FAG
          </a>
          <a href="#" className="hover:text-[#d4fb2b]">
            Contact
          </a>
        </div>
        <Link to="/login">
          <button className="bg-[#d4fb2b] text-black px-4 py-1 font-medium rounded-full hover:bg-yellow-400">
            Get Started
          </button>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;

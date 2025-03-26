const Footer = () => {
  return (
    <>
      <footer className="footer sm:footer-horizontal footer-center bg-[#070707] text-base-content p-6">
        <aside>
          <p className="text-gray-500 text-[15px] font-medium">
            Copyright © {new Date().getFullYear()} - All right reserved by <span className="text-[#d4fb2b] font-">StockHub</span>
          </p>
        </aside>
      </footer>
    </>
  );
};

export default Footer;

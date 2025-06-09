import React, { useEffect, useState } from "react";
import axiosInstance from "../../Services/axios";

const DashboardHome = () => {
  const [portfolio, setPortfolio] = useState([]);

  const fetchPortfolios = () => {
    axiosInstance
      .get("api/portfolios")
      .then((response) => {
        setPortfolio(response.data);
        console.log(response.data, "Fetched portfolios");
      })
      .catch((error) => {
        console.error("Error fetching portfolios:", error);
      });
  };

  useEffect(() => {
    fetchPortfolios(); // initial fetch

    const intervalId = setInterval(() => {
      fetchPortfolios(); // fetch every 30 seconds
    }, 30000);

    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  const totalValue = portfolio.reduce((sum, p) => sum + p.totalValue, 0);
  const totalDailyChange = portfolio.reduce((sum, p) => sum + p.dailyChange, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#111111] p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-2 text-[#d4fb2b]">
            Total Portfolios
          </h2>
          <p className="text-3xl font-bold">{portfolio.length}</p>
          <p className="text-gray-400 mt-2">
            You currently own {portfolio.length} portfolio
            {portfolio.length !== 1 && "s"}
          </p>
        </div>

        <div className="bg-[#111111] p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-2 text-[#d4fb2b]">
            Combined Portfolio Value
          </h2>
          <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
          <p
            className={`mt-2 ${
              totalDailyChange >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {totalDailyChange >= 0 ? "+" : ""}
            {totalDailyChange.toFixed(2)}% today
          </p>
        </div>

        <div className="bg-[#111111] p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-2 text-[#d4fb2b]">
            Latest Portfolio
          </h2>
          {portfolio.length > 0 ? (
            <>
              <p className="text-lg font-semibold">
                {portfolio[portfolio.length - 1].name}
              </p>
              <p className="text-gray-400">
                {portfolio[portfolio.length - 1].description}
              </p>
            </>
          ) : (
            <p className="text-gray-400">No portfolios available</p>
          )}
        </div>
      </div>

      <div className="mt-8 bg-[#111111] p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-[#d4fb2b]">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {portfolio
            .slice(-3)
            .reverse()
            .map((item) => (
              <div key={item.id} className="border-b border-gray-700 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                  <p className="text-green-500">
                    ${item.totalValue.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

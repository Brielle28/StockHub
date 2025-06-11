import { useState, useEffect, useMemo, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  FiPlus,
  FiTrash2,
  FiWifi,
  FiWifiOff,
  FiTrendingUp,
  FiTrendingDown,
  FiRefreshCw,
  FiBarChart,
  FiPieChart,
} from "react-icons/fi";
import { useSharedPortfolio } from "../../../Context/PortfolioContext";
import * as portfolioService from "../../../Services/portfolioService";
import * as signalR from "@microsoft/signalr";
import axiosInstance from "../../../Services/axios";
const PortfolioDetails = ({ portfolio, onShowAddStock }) => {
  const [portfolioStocks, setPortfolioStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [chartType, setChartType] = useState("pie"); // 'pie' or 'bar'
  const [priceUpdateLoading, setPriceUpdateLoading] = useState(false);
  const [priceUpdateStatus, setPriceUpdateStatus] = useState(null);

  // Use ref to store the connection to avoid re-creating it
  const connectionRef = useRef(null);
  const { handleRemoveStock, formatCurrency, formatChange } =
    useSharedPortfolio();

  // Calculate portfolio totals from backend data
  const portfolioTotals = useMemo(() => {
    if (!portfolioStocks || portfolioStocks.length === 0) {
      return {
        totalValue: 0,
        totalCost: 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0,
        dailyChange: 0,
        dailyChangePercent: 0,
      };
    }

    let totalValue = 0;
    let totalCost = 0;
    let totalGainLoss = 0;
    let totalDailyChange = 0;

    portfolioStocks.forEach((stock) => {
      // Use backend calculated values
      totalValue += stock.currentValue || 0;
      totalCost += (stock.quantity || 0) * (stock.purchasePrice || 0);
      totalGainLoss += stock.gainLoss || 0;

      // Calculate daily change from current price vs previous close
      const dailyStockChange =
        (stock.quantity || 0) *
        ((stock.currentPrice || 0) - (stock.previousClose || 0));
      totalDailyChange += dailyStockChange;
    });

    const totalGainLossPercent =
      totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
    const dailyChangePercent =
      totalValue - totalDailyChange > 0
        ? (totalDailyChange / (totalValue - totalDailyChange)) * 100
        : 0;

    return {
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent,
      dailyChange: totalDailyChange,
      dailyChangePercent,
    };
  }, [portfolioStocks]);

  // Portfolio composition for charts
  const portfolioComposition = useMemo(() => {
    if (!portfolioStocks || portfolioStocks.length === 0) return [];

    return portfolioStocks
      .map((stock) => ({
        name: stock.symbol,
        value: stock.currentValue || 0,
        percentage:
          portfolioTotals.totalValue > 0
            ? ((stock.currentValue || 0) / portfolioTotals.totalValue) * 100
            : 0,
        gainLoss: stock.gainLoss || 0,
        dailyChange:
          (stock.quantity || 0) *
          ((stock.currentPrice || 0) - (stock.previousClose || 0)),
      }))
      .filter((item) => item.value > 0);
  }, [portfolioStocks, portfolioTotals.totalValue]);

  // Updated Price update functions using axiosInstance
  const triggerPriceUpdate = async () => {
    setPriceUpdateLoading(true);
    setPriceUpdateStatus(null);
    
    try {
      const response = await axiosInstance.post("/api/portfolios/trigger-price-update");
      
      if (response.status === 200) {
        setPriceUpdateStatus("Price update triggered successfully");
        // Optionally check status after triggering
        setTimeout(() => checkPriceUpdateStatus(), 1000);
      } else {
        setPriceUpdateStatus("Failed to trigger price update");
      }
    } catch (error) {
      console.error("Error triggering price update:", error);
      setPriceUpdateStatus(
        error.response?.data?.message || 
        error.message || 
        "Error triggering price update"
      );
    } finally {
      setPriceUpdateLoading(false);
    }
  };

  const checkPriceUpdateStatus = async () => {
    try {
      const response = await axiosInstance.get("/api/portfolios/price-update-status");
      
      if (response.status === 200) {
        const data = response.data;
        setPriceUpdateStatus(`Update status: ${data.status || "Unknown"}`);
      }
    } catch (error) {
      console.error("Error checking price update status:", error);
      setPriceUpdateStatus(
        error.response?.data?.message || 
        error.message || 
        "Error checking price update status"
      );
    }
  };

  // SignalR Connection Setup
  useEffect(() => {
    if (!portfolio?.id) return;

    const createConnection = async () => {
      try {
        // Create SignalR connection
        const connection = new signalR.HubConnectionBuilder()
          .withUrl("http://localhost:5012/stockHub") // Replace with your backend URL
          .withAutomaticReconnect()
          .build();

        // Connection event handlers
        connection.onclose(() => {
          setConnectionStatus("Disconnected");
          console.log("SignalR connection closed");
        });

        connection.onreconnecting(() => {
          setConnectionStatus("Reconnecting");
          console.log("SignalR reconnecting...");
        });

        connection.onreconnected(() => {
          setConnectionStatus("Connected");
          console.log("SignalR reconnected");
          // Rejoin the portfolio group after reconnection
          if (portfolio?.id) {
            connection.invoke("JoinGroup", `portfolio_${portfolio.id}`);
          }
        });

        // Listen for stock price updates - expect backend calculated data
        connection.on("ReceiveStockUpdate", (updatedStock) => {
          console.log("Received stock update:", updatedStock);

          setPortfolioStocks((prevStocks) =>
            prevStocks.map((stock) => {
              if (
                stock.symbol === updatedStock.symbol ||
                stock.id === updatedStock.id
              ) {
                return {
                  ...stock,
                  ...updatedStock, // Use all backend calculated values
                };
              }
              return stock;
            })
          );
        });

        // Listen for portfolio-specific updates
        connection.on("ReceivePortfolioUpdate", (portfolioUpdate) => {
          console.log("Received portfolio update:", portfolioUpdate);

          if (portfolioUpdate.portfolioId === portfolio.id) {
            if (
              portfolioUpdate.stocks &&
              Array.isArray(portfolioUpdate.stocks)
            ) {
              setPortfolioStocks((prevStocks) => {
                const updatedStocks = [...prevStocks];

                portfolioUpdate.stocks.forEach((updatedStock) => {
                  const index = updatedStocks.findIndex(
                    (stock) =>
                      stock.symbol === updatedStock.symbol ||
                      stock.id === updatedStock.id
                  );

                  if (index !== -1) {
                    updatedStocks[index] = {
                      ...updatedStocks[index],
                      ...updatedStock, // Use all backend calculated values
                    };
                  }
                });

                return updatedStocks;
              });
            }
          }
        });

        // Start the connection
        await connection.start();
        setConnectionStatus("Connected");
        console.log("SignalR connection started");

        // Join the portfolio group
        await connection.invoke("JoinGroup", `portfolio_${portfolio.id}`);
        console.log(`Joined portfolio group: portfolio_${portfolio.id}`);

        connectionRef.current = connection;
      } catch (error) {
        console.error("SignalR connection error:", error);
        setConnectionStatus("Error");
      }
    };

    createConnection();

    // Cleanup function
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
        setConnectionStatus("Disconnected");
      }
    };
  }, [portfolio?.id]);

  // Fetch portfolio stocks when portfolio changes
  useEffect(() => {
    const fetchPortfolioStocks = async () => {
      if (!portfolio?.id) return;

      setLoading(true);
      try {
        const stocks = await portfolioService.getPortfolioStocks(portfolio.id);
        setPortfolioStocks(stocks || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch portfolio stocks:", err);
        setError("Failed to load portfolio stocks");
        setPortfolioStocks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioStocks();
  }, [portfolio?.id]);

  const handleDeleteStock = async (stockId) => {
    if (!portfolio?.id || !stockId) return;

    try {
      await handleRemoveStock(portfolio.id, stockId);
      // Refresh the stocks list
      const updatedStocks = await portfolioService.getPortfolioStocks(
        portfolio.id
      );
      setPortfolioStocks(updatedStocks || []);
    } catch (err) {
      console.error("Failed to delete stock:", err);
    }
  };

  // Calculate additional metrics for display
  const getStockMetrics = (stock) => {
    const dailyChange =
      (stock.quantity || 0) *
      ((stock.currentPrice || 0) - (stock.previousClose || 0));
    const dailyChangePercent =
      (stock.previousClose || 0) > 0
        ? (((stock.currentPrice || 0) - (stock.previousClose || 0)) /
            (stock.previousClose || 0)) *
          100
        : 0;

    const portfolioWeight =
      portfolioTotals.totalValue > 0
        ? ((stock.currentValue || 0) / portfolioTotals.totalValue) * 100
        : 0;

    return {
      ...stock,
      dailyChange,
      dailyChangePercent,
      portfolioWeight,
    };
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Connection status indicator
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "Connected":
        return "text-green-500";
      case "Reconnecting":
        return "text-yellow-500";
      case "Error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getConnectionIcon = () => {
    return connectionStatus === "Connected" ? <FiWifi /> : <FiWifiOff />;
  };

  // Pie chart colors
  const COLORS = [
    "#d4fb2b",
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#f97316",
  ];

  return (
    <div className="bg-[#111111] rounded-xl p-4 sm:p-6 shadow-xl w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-0 md:mb-6 w-full">
        <div className="mb-4 lg:mb-0 w-full">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-300">
                {portfolio.name}
              </h2>
              {/* Connection Status Indicator */}
              <div
                className={`flex items-center gap-1 text-sm ${getConnectionStatusColor()}`}
              >
                {getConnectionIcon()}
                <span className="hidden sm:inline">{connectionStatus}</span>
              </div>
            </div>
            {portfolio.description && (
              <p className="text-sm sm:text-base text-gray-500 mt-2">
                {portfolio.description}
              </p>
            )}
          </div>

          {/* Enhanced Portfolio Summary */}
          <div className="mt-2 md:mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-sm">
            <div>
              <span className="text-[11px] md:text-[14px] text-gray-400 block">
                Total Value:
              </span>
              <div className="text-[15px] md:text-lg font-semibold text-gray-300">
                {formatCurrency
                  ? formatCurrency(portfolioTotals.totalValue)
                  : `$${portfolioTotals.totalValue.toFixed(2)}`}
              </div>
            </div>
            <div>
              <span className="text-[11px] md:text-[14px] text-gray-400 block">
                Total Gain/Loss:
              </span>
              <div
                className={`text-[15px] md:text-lg font-semibold ${
                  portfolioTotals.totalGainLoss >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {formatChange
                  ? formatChange(
                      portfolioTotals.totalGainLoss,
                      portfolioTotals.totalGainLossPercent
                    )
                  : `${
                      portfolioTotals.totalGainLoss >= 0 ? "+" : ""
                    }$${portfolioTotals.totalGainLoss.toFixed(
                      2
                    )} (${portfolioTotals.totalGainLossPercent.toFixed(2)}%)`}
              </div>
            </div>
            <div>
              <span className="text-[11px] md:text-[14px] text-gray-400 block">
                Daily Change:
              </span>
              <div
                className={`text-[15px] md:text-lg font-semibold ${
                  portfolioTotals.dailyChange >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {formatChange
                  ? formatChange(
                      portfolioTotals.dailyChange,
                      portfolioTotals.dailyChangePercent
                    )
                  : `${
                      portfolioTotals.dailyChange >= 0 ? "+" : ""
                    }$${portfolioTotals.dailyChange.toFixed(
                      2
                    )} (${portfolioTotals.dailyChangePercent.toFixed(2)}%)`}
              </div>
            </div>
            <div>
              <span className="text-[11px] md:text-[14px] text-gray-400 block">
                Daily % Change:
              </span>
              <div
                className={`text-[15px] md:text-lg font-semibold ${
                  portfolioTotals.dailyChangePercent >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {portfolioTotals.dailyChangePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*stock and Price Update Controls buttons */}
      <div className="mb-3 md:mb-6 flex flex-wrap md:flex-row justify-start md:gap-14 gap-2">
        <button
          onClick={onShowAddStock}
          className="px-2 py-1 md:px-4 md:py-2 bg-transparent border border-[#d4fb2b] rounded-lg text-[#d4fb2b] hover:bg-[#d4fb2b] hover:text-black flex items-center transition-all text-[12px] md:text-base"
        >
          <FiPlus className="md:mr-2 mr-1" /> Add Stock
        </button>
        <button
          onClick={triggerPriceUpdate}
          disabled={priceUpdateLoading}
          className="px-2 py-1 md:px-4 md:py-2 bg-transparent border border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white flex items-center transition-all text-[12px] md:text-base disabled:opacity-50"
        >
          <FiRefreshCw
            className={`mr-1 md:mr-2 ${
              priceUpdateLoading ? "animate-spin" : ""
            }`}
          />
          {priceUpdateLoading ? "Updating..." : "Trigger Price Update"}
        </button>

        {/* <button
          onClick={checkPriceUpdateStatus}
          className="px-2 py-1 md:px-4 md:py-2 bg-transparent border border-gray-500 rounded-lg text-gray-500 hover:bg-gray-500 hover:text-white flex items-center transition-all text-[12px] md:text-base"
        >
          Check Update Status
        </button> */}
      </div>

      {/* Price Update Status Display */}
      {/* {priceUpdateStatus && (
        <div className="mb-3 md:mb-6">
          <div className={`flex items-center px-3 py-2 rounded-lg text-sm ${
            priceUpdateStatus.includes('successfully') 
              ? 'bg-green-900 text-green-300' 
              : priceUpdateStatus.includes('Error') || priceUpdateStatus.includes('Failed')
              ? 'bg-red-900 text-red-300'
              : 'bg-gray-800 text-gray-300'
          }`}>
            {priceUpdateStatus}
          </div>
        </div>
      )} */}

      {/* Enhanced Portfolio Composition Chart */}
      {portfolioComposition.length > 0 && (
        <div className="mb-6 bg-gray-900 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[12px] md:text-lg font-semibold text-gray-300">
              Portfolio Composition
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType("pie")}
                className={`p-2 rounded-lg transition-all ${
                  chartType === "pie"
                    ? "bg-[#d4fb2b] text-black"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <FiPieChart className="text-[14px] md:text-[18px]" />
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`p-2 rounded-lg transition-all ${
                  chartType === "bar"
                    ? "bg-[#d4fb2b] text-black"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <FiBarChart className="text-[14px] md:text-[18px]" />
              </button>
            </div>
          </div>

          {/* chart container */}
          <div className="overflow-x-auto">
            <div className="h-80 w-full min-w-[400px] sm:min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "pie" ? (
                  <PieChart>
                    <Pie
                      data={portfolioComposition}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) =>
                        `${name} ${percentage.toFixed(1)}%`
                      }
                      labelLine={false}
                    >
                      {portfolioComposition.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#f3f4f6",
                      }}
                    />
                    <Legend />
                  </PieChart>
                ) : (
                  <BarChart
                    data={portfolioComposition}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "value"
                          ? `$${value.toFixed(2)}`
                          : `$${value.toFixed(2)}`,
                        name === "value"
                          ? "Market Value"
                          : name === "gainLoss"
                          ? "Gain/Loss"
                          : "Daily Change",
                      ]}
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#f3f4f6",
                      }}
                    />
                    <Legend />
                      <Bar dataKey="value" fill="#d4fb2b" name="Market Value"/>
                      <Bar dataKey="gainLoss" fill="#22c55e" name="Gain/Loss" />
                      <Bar
                        dataKey="dailyChange"
                        fill="#3b82f6"
                        name="Daily Change"
                      />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Holdings Table */}
      <div className="bg-[#111111] rounded-xl overflow-hidden border border-gray-800">
        <h3 className="text-lg font-semibold text-gray-300 p-4 border-b border-gray-700">
          Holdings
        </h3>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading stocks...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : portfolioStocks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Symbol
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Quantity
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Avg Cost
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Current Price
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Market Value
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Daily Change
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Total Gain/Loss
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Weight
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Purchase Date
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {portfolioStocks.map((stock) => {
                  const stockMetrics = getStockMetrics(stock);
                  return (
                    <tr
                      key={stock.id}
                      className="hover:bg-gray-800 transition-colors"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-[#d4fb2b] whitespace-nowrap">
                        {stock.symbol}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-300 whitespace-nowrap">
                        {stock.quantity}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-300 whitespace-nowrap">
                        ${stock.purchasePrice.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-300 whitespace-nowrap">
                        ${stock.currentPrice.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-300 whitespace-nowrap">
                        ${stock.currentValue.toFixed(2)}
                      </td>
                      <td
                        className={`py-4 px-4 text-sm whitespace-nowrap ${
                          stockMetrics.dailyChange >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        <div className="flex items-center">
                          {stockMetrics.dailyChange >= 0 ? (
                            <FiTrendingUp className="mr-1" />
                          ) : (
                            <FiTrendingDown className="mr-1" />
                          )}
                          <span>
                            {stockMetrics.dailyChange >= 0 ? "+" : ""}$
                            {stockMetrics.dailyChange.toFixed(2)}
                            <br />({stockMetrics.dailyChangePercent.toFixed(2)}
                            %)
                          </span>
                        </div>
                      </td>
                      <td
                        className={`py-4 px-4 text-sm font-medium whitespace-nowrap ${
                          stock.gainLoss >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        <div className="flex items-center">
                          {stock.gainLoss >= 0 ? (
                            <FiTrendingUp className="mr-1" />
                          ) : (
                            <FiTrendingDown className="mr-1" />
                          )}
                          <span>
                            {stock.gainLoss >= 0 ? "+" : ""}$
                            {stock.gainLoss.toFixed(2)}
                            <br />({stock.gainLossPercent.toFixed(2)}%)
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-300 whitespace-nowrap">
                        {stockMetrics.portfolioWeight.toFixed(1)}%
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-400 whitespace-nowrap">
                        {formatDate(stock.purchaseDate)}
                      </td>
                      <td className="py-4 px-4 text-sm text-right whitespace-nowrap">
                        <button
                          className="text-gray-400 hover:text-red-500 ml-2 p-1"
                          onClick={() => handleDeleteStock(stock.id)}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No stocks in this portfolio. Click "Add Stock" to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioDetails;
import { useState, useEffect, useMemo, useRef } from "react";
import { PieChart, Pie, Cell, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Line } from 'recharts';
import { FiPlus, FiTrash2, FiWifi, FiWifiOff, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { useSharedPortfolio } from "../../../Context/PortfolioContext";
import * as portfolioService from "../../../Services/portfolioService";
import * as signalR from "@microsoft/signalr";

const PortfolioDetails = ({ portfolio, onShowAddStock }) => {
  const [portfolioStocks, setPortfolioStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  
  // Use ref to store the connection to avoid re-creating it
  const connectionRef = useRef(null);
  const { handleRemoveStock, formatCurrency, formatChange } = useSharedPortfolio();

  // Calculate portfolio totals from backend data
  const portfolioTotals = useMemo(() => {
    if (!portfolioStocks || portfolioStocks.length === 0) {
      return {
        totalValue: 0,
        totalCost: 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0,
        dailyChange: 0,
        dailyChangePercent: 0
      };
    }

    let totalValue = 0;
    let totalCost = 0;
    let totalGainLoss = 0;
    let totalDailyChange = 0;

    portfolioStocks.forEach(stock => {
      // Use backend calculated values
      totalValue += stock.currentValue || 0;
      totalCost += (stock.quantity || 0) * (stock.purchasePrice || 0);
      totalGainLoss += stock.gainLoss || 0;
      
      // Calculate daily change from current price vs previous close
      const dailyStockChange = (stock.quantity || 0) * ((stock.currentPrice || 0) - (stock.previousClose || 0));
      totalDailyChange += dailyStockChange;
    });

    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
    const dailyChangePercent = (totalValue - totalDailyChange) > 0 ? (totalDailyChange / (totalValue - totalDailyChange)) * 100 : 0;

    return {
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent,
      dailyChange: totalDailyChange,
      dailyChangePercent
    };
  }, [portfolioStocks]);

  // Portfolio composition for pie chart
  const portfolioComposition = useMemo(() => {
    if (!portfolioStocks || portfolioStocks.length === 0) return [];
    
    return portfolioStocks.map(stock => ({
      name: stock.symbol,
      value: stock.currentValue || 0,
      percentage: portfolioTotals.totalValue > 0 ? ((stock.currentValue || 0) / portfolioTotals.totalValue * 100) : 0
    })).filter(item => item.value > 0);
  }, [portfolioStocks, portfolioTotals.totalValue]);

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
          setConnectionStatus('Disconnected');
          console.log('SignalR connection closed');
        });

        connection.onreconnecting(() => {
          setConnectionStatus('Reconnecting');
          console.log('SignalR reconnecting...');
        });

        connection.onreconnected(() => {
          setConnectionStatus('Connected');
          console.log('SignalR reconnected');
          // Rejoin the portfolio group after reconnection
          if (portfolio?.id) {
            connection.invoke("JoinGroup", `portfolio_${portfolio.id}`);
          }
        });

        // Listen for stock price updates - expect backend calculated data
        connection.on("ReceiveStockUpdate", (updatedStock) => {
          console.log("Received stock update:", updatedStock);
          
          setPortfolioStocks(prevStocks => 
            prevStocks.map(stock => {
              if (stock.symbol === updatedStock.symbol || stock.id === updatedStock.id) {
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
            if (portfolioUpdate.stocks && Array.isArray(portfolioUpdate.stocks)) {
              setPortfolioStocks(prevStocks => {
                const updatedStocks = [...prevStocks];
                
                portfolioUpdate.stocks.forEach(updatedStock => {
                  const index = updatedStocks.findIndex(stock => 
                    stock.symbol === updatedStock.symbol || stock.id === updatedStock.id
                  );
                  
                  if (index !== -1) {
                    updatedStocks[index] = {
                      ...updatedStocks[index],
                      ...updatedStock // Use all backend calculated values
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
        setConnectionStatus('Connected');
        console.log('SignalR connection started');

        // Join the portfolio group
        await connection.invoke("JoinGroup", `portfolio_${portfolio.id}`);
        console.log(`Joined portfolio group: portfolio_${portfolio.id}`);

        connectionRef.current = connection;

      } catch (error) {
        console.error('SignalR connection error:', error);
        setConnectionStatus('Error');
      }
    };

    createConnection();

    // Cleanup function
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
        setConnectionStatus('Disconnected');
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
        console.error('Failed to fetch portfolio stocks:', err);
        setError('Failed to load portfolio stocks');
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
      const updatedStocks = await portfolioService.getPortfolioStocks(portfolio.id);
      setPortfolioStocks(updatedStocks || []);
    } catch (err) {
      console.error('Failed to delete stock:', err);
    }
  };

  // Calculate additional metrics for display
  const getStockMetrics = (stock) => {
    const dailyChange = (stock.quantity || 0) * ((stock.currentPrice || 0) - (stock.previousClose || 0));
    const dailyChangePercent = (stock.previousClose || 0) > 0 ? 
      ((stock.currentPrice || 0) - (stock.previousClose || 0)) / (stock.previousClose || 0) * 100 : 0;
    
    const portfolioWeight = portfolioTotals.totalValue > 0 ? 
      ((stock.currentValue || 0) / portfolioTotals.totalValue * 100) : 0;

    return {
      ...stock,
      dailyChange,
      dailyChangePercent,
      portfolioWeight
    };
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Connection status indicator
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'Connected': return 'text-green-500';
      case 'Reconnecting': return 'text-yellow-500';
      case 'Error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectionIcon = () => {
    return connectionStatus === 'Connected' ? <FiWifi /> : <FiWifiOff />;
  };

  // Pie chart colors
  const COLORS = ['#d4fb2b', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

  return (
    <div className="bg-[#111111] rounded-xl p-4 sm:p-6 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-300">{portfolio.name}</h2>
            {/* Connection Status Indicator */}
            <div className={`flex items-center gap-1 text-sm ${getConnectionStatusColor()}`}>
              {getConnectionIcon()}
              <span className="hidden sm:inline">{connectionStatus}</span>
            </div>
          </div>
          {portfolio.description && (
            <p className="text-sm sm:text-base text-gray-500">{portfolio.description}</p>
          )}
        </div>
        <div className="flex flex-col lg:items-end">
          <div className="text-xl sm:text-2xl font-bold text-gray-300">
            {formatCurrency ? formatCurrency(portfolioTotals.totalValue) : `$${portfolioTotals.totalValue.toFixed(2)}`}
          </div>
          <div className={`flex items-center text-sm sm:text-base ${portfolioTotals.dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {portfolioTotals.dailyChange >= 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
            <span>
              {formatChange ?
                formatChange(portfolioTotals.dailyChange, portfolioTotals.dailyChangePercent) :
                `${portfolioTotals.dailyChange >= 0 ? '+' : ''}$${portfolioTotals.dailyChange.toFixed(2)} (${portfolioTotals.dailyChangePercent.toFixed(2)}%)`
              }
            </span>
            <span className="text-gray-500 ml-2">Today</span>
          </div>
          <div className={`flex items-center text-sm sm:text-base ${portfolioTotals.totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {portfolioTotals.totalGainLoss >= 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
            <span>
              {formatChange ?
                formatChange(portfolioTotals.totalGainLoss, portfolioTotals.totalGainLossPercent) :
                `${portfolioTotals.totalGainLoss >= 0 ? '+' : ''}$${portfolioTotals.totalGainLoss.toFixed(2)} (${portfolioTotals.totalGainLossPercent.toFixed(2)}%)`
              }
            </span>
            <span className="text-gray-500 ml-2">Total</span>
          </div>
          <div>{portfolioTotals.dailyChange} : Daily change</div>
          <div>{portfolioTotals.dailyChangePercent} : Daily Percent change</div>
        </div>
      </div>

      {/* Portfolio Composition Chart */}
      {portfolioComposition.length > 0 && (
        <div className="mb-6 bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Portfolio Composition</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioComposition}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                >
                  {portfolioComposition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Value']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={onShowAddStock}
          className="px-4 py-2 bg-transparent border border-[#d4fb2b] rounded-lg text-[#d4fb2b] hover:bg-[#d4fb2b] hover:text-black flex items-center transition-all text-sm sm:text-base"
        >
          <FiPlus className="mr-2" /> Add Stock
        </button>
      </div>

      {/* Holdings Table */}
      <div className="bg-[#111111] rounded-xl overflow-hidden border border-gray-800">
        <h3 className="text-lg font-semibold text-gray-300 p-4 border-b border-gray-700">Holdings</h3>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading stocks...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              {error}
            </div>
          ) : portfolioStocks.length > 0 ? (
            <div className="min-w-full">
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <table className="min-w-full">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Symbol</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Avg Cost</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Current Price</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Market Value</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Daily Change</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Gain/Loss</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Weight</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Purchase Date</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {portfolioStocks.map((stock) => {
                      const stockMetrics = getStockMetrics(stock);
                      return (
                        <tr key={stock.id} className="hover:bg-gray-800 transition-colors">
                          <td className="py-4 px-4 text-sm font-medium text-[#d4fb2b]">
                            {stock.symbol}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-300">
                            {stock.quantity}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-300">
                            ${stock.purchasePrice.toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-300">
                            ${stock.currentPrice.toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-sm font-medium text-gray-300">
                            ${stock.currentValue.toFixed(2)}
                          </td>
                          <td className={`py-4 px-4 text-sm ${stockMetrics.dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stockMetrics.dailyChange >= 0 ? '+' : ''}${stockMetrics.dailyChange.toFixed(2)} 
                            ({stockMetrics.dailyChangePercent.toFixed(2)}%)
                          </td>
                          <td className={`py-4 px-4 text-sm font-medium ${stock.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stock.gainLoss >= 0 ? '+' : ''}${stock.gainLoss.toFixed(2)} 
                            ({stock.gainLossPercent.toFixed(2)}%)
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-300">
                            {stockMetrics.portfolioWeight.toFixed(1)}%
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-400">
                            {formatDate(stock.purchaseDate)}
                          </td>
                          <td className="py-4 px-4 text-sm text-right">
                            <button
                              className="text-gray-400 hover:text-red-500 ml-2"
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

              {/* Mobile Card View */}
              <div className="lg:hidden">
                {portfolioStocks.map((stock) => {
                  const stockMetrics = getStockMetrics(stock);
                  return (
                    <div key={stock.id} className="p-4 border-b border-gray-700 last:border-b-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-[#d4fb2b] font-medium text-lg">
                            {stock.symbol}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {stockMetrics.portfolioWeight.toFixed(1)}% of portfolio
                          </div>
                        </div>
                        <button
                          className="text-gray-400 hover:text-red-500 p-2"
                          onClick={() => handleDeleteStock(stock.id)}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                     
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <span className="text-gray-400">Quantity:</span>
                          <span className="text-gray-300 ml-2">{stock.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Avg Cost:</span>
                          <span className="text-gray-300 ml-2">${stock.purchasePrice.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Current:</span>
                          <span className="text-gray-300 ml-2">${stock.currentPrice.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Value:</span>
                          <span className="text-gray-300 ml-2 font-medium">${stock.currentValue.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className={`${stockMetrics.dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          <span className="text-gray-400">Daily Change:</span>
                          <span className="ml-2">
                            {stockMetrics.dailyChange >= 0 ? '+' : ''}${stockMetrics.dailyChange.toFixed(2)} 
                            ({stockMetrics.dailyChangePercent.toFixed(2)}%)
                          </span>
                        </div>
                        <div className={`${stock.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          <span className="text-gray-400">Total Gain/Loss:</span>
                          <span className="ml-2 font-medium">
                            {stock.gainLoss >= 0 ? '+' : ''}${stock.gainLoss.toFixed(2)} 
                            ({stock.gainLossPercent.toFixed(2)}%)
                          </span>
                        </div>
                        <div className="text-gray-400">
                          <span>Purchase Date:</span>
                          <span className="text-gray-300 ml-2">{formatDate(stock.purchaseDate)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No stocks in this portfolio. Click "Add Stock" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetails;
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Line } from 'recharts';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useSharedPortfolio } from "../../../Context/PortfolioContext";
import * as portfolioService from "../../../Services/portfolioService";

const PortfolioDetails = ({ portfolio, onShowAddStock }) => {
  const [portfolioStocks, setPortfolioStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { handleRemoveStock, formatCurrency, formatChange } = useSharedPortfolio();

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

  return (
    <div className="bg-[#111111] rounded-xl p-6 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-300">{portfolio.name}</h2>
          <p className="text-gray-500">{portfolio.description}</p>
        </div>
        <div className="mt-4 lg:mt-0 flex flex-col lg:items-end">
          <div className="text-2xl font-bold text-gray-300">
            {formatCurrency(portfolio.value)}
          </div>
          <div className={`flex items-center ${(portfolio.dailyChange || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            <span>{formatChange(portfolio.dailyChange, portfolio.dailyChangePercent)}</span>
            <span className="text-gray-500 ml-2">Today</span>
          </div>
          <div className={`flex items-center ${(portfolio.totalGainLoss || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            <span>{formatChange(portfolio.totalGainLoss, portfolio.totalGainLossPercent)}</span>
            <span className="text-gray-500 ml-2">Total</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={onShowAddStock}
          className="px-4 py-2 bg-transparent border border-[#d4fb2b] rounded-lg text-[#d4fb2b] hover:bg-[#d4fb2b] hover:text-black flex items-center transition-all"
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
            <table className="min-w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Symbol</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Avg Cost</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Current Price</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Market Value</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gain/Loss</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {portfolioStocks.map((stock) => (
                  <tr key={stock.id} className="hover:bg-gray-800">
                    <td className="py-4 px-4 text-sm font-medium text-[#d4fb2b]">
                      {stock.symbol || stock.stock?.symbol}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-300">
                      {stock.name || stock.stock?.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-300">
                      {stock.quantity || 0}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-300">
                      ${(stock.purchasePrice || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-300">
                      ${(stock.currentPrice || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-300">
                      ${(stock.currentValue || (stock.quantity * stock.currentPrice) || 0).toFixed(2)}
                    </td>
                    <td className={`py-4 px-4 text-sm ${(stock.gainLoss || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${(stock.gainLoss || 0).toFixed(2)} ({(stock.gainLossPercent || 0).toFixed(2)}%)
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
                ))}
              </tbody>
            </table>
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
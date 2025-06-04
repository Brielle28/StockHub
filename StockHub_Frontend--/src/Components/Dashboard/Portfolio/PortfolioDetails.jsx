import { useState } from "react";
import { mockAllocationData, mockPerformanceData, mockStocks } from "../../../Utils/PorfolioMockUp";
import { Line } from 'recharts';
import { PieChart, Pie, Cell, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const PortfolioDetails = ({ portfolio, onShowAddStock }) => {
  // Settings for charts display
  const [chartType, setChartType] = useState('pie');
  
  return (
    <div className="bg-[#111111] rounded-xl p-6 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-300">{portfolio.name}</h2>
          <p className="text-gray-500">{portfolio.description}</p>
        </div>
        <div className="mt-4 lg:mt-0 flex flex-col lg:items-end">
          <div className="text-2xl font-bold text-gray-300">${portfolio.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className={`flex items-center ${portfolio.dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            <span>
              {portfolio.dailyChange >= 0 ? '+' : ''}{portfolio.dailyChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (
              {portfolio.dailyChangePercent >= 0 ? '+' : ''}{portfolio.dailyChangePercent.toFixed(2)}%)
            </span>
            <span className="text-gray-500 ml-2">Today</span>
          </div>
          <div className={`flex items-center ${portfolio.totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            <span>
              {portfolio.totalGainLoss >= 0 ? '+' : ''}{portfolio.totalGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (
              {portfolio.totalGainLossPercent >= 0 ? '+' : ''}{portfolio.totalGainLossPercent.toFixed(2)}%)
            </span>
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

      <div className="mb-8 space-y-6">
        {/* Performance Chart - Full width with horizontal scrolling on mobile */}
        <div className="bg-[#111111] rounded-xl p-4 border border-gray-800">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Performance History</h3>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                      formatter={(value) => [`${value.toLocaleString()}`, 'Value']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#d4fb2b" 
                      strokeWidth={2}
                      dot={{ fill: '#d4fb2b', r: 4 }}
                      activeDot={{ r: 6, fill: '#d4fb2b' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Two charts side by side with proper scrolling */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Allocation Data with horizontal scrolling */}
          <div className="bg-[#111111] rounded-xl p-4 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-300">Allocation</h3>
              <div className="flex gap-2">
                <button 
                  className={`px-3 py-1 rounded ${chartType === 'pie' ? 'bg-[#d4fb2b] text-black' : 'bg-gray-800 text-gray-300'}`}
                  onClick={() => setChartType('pie')}
                >
                  Pie
                </button>
                <button 
                  className={`px-3 py-1 rounded ${chartType === 'bar' ? 'bg-[#d4fb2b] text-black' : 'bg-gray-800 text-gray-300'}`}
                  onClick={() => setChartType('bar')}
                >
                  Bar
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[400px]">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'pie' ? (
                      <PieChart>
                        <Pie
                          data={mockAllocationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {mockAllocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value.toLocaleString()}`, 'Value']}
                          contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                        />
                        <Legend formatter={(value) => <span style={{ color: '#d1d5db' }}>{value}</span>} />
                      </PieChart>
                    ) : (
                      <BarChart data={mockAllocationData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                          formatter={(value) => [`${value.toLocaleString()}`, 'Value']}
                        />
                        <Bar dataKey="value" name="Value">
                          {mockAllocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                        <Legend formatter={(value) => <span style={{ color: '#d1d5db' }}>{value}</span>} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {/* Scroll indicator for mobile */}
            <div className="lg:hidden flex justify-center mt-2">
              <div className="h-1 w-16 bg-gray-600 rounded-full opacity-75"></div>
            </div>
          </div>

          {/* Top Performing Stocks */}
          <div className="bg-[#111111] rounded-xl p-4 border border-gray-800">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Top Performers</h3>
            <div className="space-y-4">
              {mockStocks
                .sort((a, b) => b.gainLossPercent - a.gainLossPercent)
                .slice(0, 3)
                .map(stock => (
                  <div key={stock.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                    <div>
                      <div className="text-lg font-semibold text-[#d4fb2b]">{stock.symbol}</div>
                      <div className="text-sm text-gray-400">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${stock.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.gainLossPercent.toFixed(2)}%
                      </div>
                      <div className={`text-sm ${stock.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${stock.gainLoss.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111111] rounded-xl overflow-hidden border border-gray-800">
        <h3 className="text-lg font-semibold text-gray-300 p-4 border-b border-gray-700">Holdings</h3>
        <div className="overflow-x-auto">
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
              {mockStocks.map((stock) => (
                <tr key={stock.id} className="hover:bg-gray-800">
                  <td className="py-4 px-4 text-sm font-medium text-[#d4fb2b]">{stock.symbol}</td>
                  <td className="py-4 px-4 text-sm text-gray-300">{stock.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-300">{stock.quantity}</td>
                  <td className="py-4 px-4 text-sm text-gray-300">${stock.purchasePrice.toFixed(2)}</td>
                  <td className="py-4 px-4 text-sm text-gray-300">${stock.currentPrice.toFixed(2)}</td>
                  <td className="py-4 px-4 text-sm text-gray-300">${stock.currentValue.toFixed(2)}</td>
                  <td className={`py-4 px-4 text-sm ${stock.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${stock.gainLoss.toFixed(2)} ({stock.gainLossPercent.toFixed(2)}%)
                  </td>
                  <td className="py-4 px-4 text-sm text-right">
                    <button className="text-gray-400 hover:text-red-500 ml-2">
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default PortfolioDetails
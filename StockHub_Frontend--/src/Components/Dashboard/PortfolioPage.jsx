// import { useState, useEffect } from 'react';
// import { Line } from 'recharts';
// import { PieChart, Pie, Cell, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
// import { FiPlus, FiTrash2, FiEye, FiEdit, FiChevronDown, FiRefreshCw, FiDollarSign } from 'react-icons/fi';

// // Mock data
// const mockPortfolios = [
//   {
//     id: 1,
//     name: "Tech Stocks",
//     description: "Technology sector investments",
//     value: 25436.78,
//     dailyChange: 345.67,
//     dailyChangePercent: 1.42,
//     stockCount: 5,
//     totalGainLoss: 3456.78,
//     totalGainLossPercent: 15.72
//   },
//   {
//     id: 2,
//     name: "Dividend Stocks",
//     description: "Income generating investments",
//     value: 18234.50,
//     dailyChange: -123.45,
//     dailyChangePercent: -0.67,
//     stockCount: 8,
//     totalGainLoss: 1234.56,
//     totalGainLossPercent: 7.26
//   }
// ];

// const mockStocks = [
//   { id: 1, symbol: "AAPL", name: "Apple Inc.", quantity: 15, purchasePrice: 150.25, currentPrice: 176.28, currentValue: 2644.20, gainLoss: 390.45, gainLossPercent: 17.32 },
//   { id: 2, symbol: "MSFT", name: "Microsoft Corp.", quantity: 10, purchasePrice: 290.45, currentPrice: 318.34, currentValue: 3183.40, gainLoss: 278.90, gainLossPercent: 9.6 },
//   { id: 3, symbol: "GOOGL", name: "Alphabet Inc.", quantity: 5, purchasePrice: 2756.32, currentPrice: 2890.56, currentValue: 14452.80, gainLoss: 671.20, gainLossPercent: 4.87 },
//   { id: 4, symbol: "AMZN", name: "Amazon.com Inc.", quantity: 8, purchasePrice: 3245.67, currentPrice: 3124.89, currentValue: 24999.12, gainLoss: -966.24, gainLossPercent: -3.72 },
// ];

// const mockPerformanceData = [
//   { date: '2024-04-01', value: 23654.45 },
//   { date: '2024-04-02', value: 23789.12 },
//   { date: '2024-04-03', value: 24102.56 },
//   { date: '2024-04-04', value: 24056.78 },
//   { date: '2024-04-05', value: 24234.45 },
//   { date: '2024-04-08', value: 24567.89 },
//   { date: '2024-04-09', value: 24789.23 },
//   { date: '2024-04-10', value: 25012.67 },
//   { date: '2024-04-11', value: 25123.45 },
//   { date: '2024-04-12', value: 25346.78 },
//   { date: '2024-04-15', value: 25436.78 },
// ];

// const mockAllocationData = [
//   { name: 'AAPL', value: 2644.20, color: '#FF6384' },
//   { name: 'MSFT', value: 3183.40, color: '#36A2EB' },
//   { name: 'GOOGL', value: 14452.80, color: '#FFCE56' },
//   { name: 'AMZN', value: 24999.12, color: '#4BC0C0' },
// ];

// const AddStockModal = ({ portfolioId, onClose, onAdd }) => {
//   const [symbol, setSymbol] = useState('');
//   const [quantity, setQuantity] = useState(1);
//   const [purchasePrice, setPurchasePrice] = useState('');
//   const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);

//   const handleSubmit = () => {
//     // Mock implementation
//     onAdd();
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4 text-gray-300">Add Stock to Portfolio</h2>
        
//         <div className="mb-4">
//           <label className="block text-gray-300 mb-2">Stock Symbol</label>
//           <input 
//             className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-300"
//             value={symbol} 
//             onChange={(e) => setSymbol(e.target.value.toUpperCase())}
//             placeholder="AAPL, MSFT, etc."
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-300 mb-2">Quantity</label>
//           <input 
//             className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-300"
//             type="number" 
//             min="1" 
//             value={quantity} 
//             onChange={(e) => setQuantity(e.target.value)}
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-300 mb-2">Purchase Price per Share ($)</label>
//           <input 
//             className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-300"
//             type="number" 
//             step="0.01" 
//             min="0.01" 
//             value={purchasePrice} 
//             onChange={(e) => setPurchasePrice(e.target.value)}
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-300 mb-2">Purchase Date</label>
//           <input 
//             className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-300"
//             type="date" 
//             value={purchaseDate} 
//             onChange={(e) => setPurchaseDate(e.target.value)}
//           />
//         </div>

//         <div className="flex justify-end gap-4 mt-6">
//           <button
//             className="px-4 py-2 border border-gray-600 rounded-lg text-gray-400 hover:text-gray-200"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 bg-transparent border border-[#d4fb2b] rounded-lg text-[#d4fb2b] hover:bg-[#d4fb2b] hover:text-black transition-all"
//             onClick={handleSubmit}
//           >
//             Add Stock
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const CreatePortfolioModal = ({ onClose, onCreate }) => {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');

//   const handleSubmit = () => {
//     // Mock implementation
//     onCreate({ 
//       id: Date.now(), 
//       name, 
//       description, 
//       value: 0,
//       dailyChange: 0,
//       dailyChangePercent: 0,
//       stockCount: 0,
//       totalGainLoss: 0,
//       totalGainLossPercent: 0
//     });
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-[#111111] p-6 rounded-xl w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4 text-gray-300">Create New Portfolio</h2>
        
//         <div className="mb-4">
//           <label className="block text-gray-300 mb-2">Portfolio Name</label>
//           <input 
//             className="w-full bg-[#111111] border border-gray-700 rounded-lg p-2 text-gray-300"
//             value={name} 
//             onChange={(e) => setName(e.target.value)}
//             placeholder="My Portfolio"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-300 mb-2">Description (optional)</label>
//           <textarea 
//             className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-300"
//             value={description} 
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Portfolio description"
//             rows={3}
//           />
//         </div>

//         <div className="flex justify-end gap-4 mt-6">
//           <button
//             className="px-4 py-2 border border-gray-600 rounded-lg text-gray-400 hover:text-gray-200"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 bg-transparent border border-[#d4fb2b] rounded-lg text-[#d4fb2b] hover:bg-[#d4fb2b] hover:text-black transition-all"
//             onClick={handleSubmit}
//             disabled={!name.trim()}
//           >
//             Create
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const PortfolioDetails = ({ portfolio, onShowAddStock }) => {
//   // Settings for charts display
//   const [chartType, setChartType] = useState('pie');
  
//   return (
//     <div className="bg-[#111111] rounded-xl p-6 shadow-xl">
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-300">{portfolio.name}</h2>
//           <p className="text-gray-500">{portfolio.description}</p>
//         </div>
//         <div className="mt-4 lg:mt-0 flex flex-col lg:items-end">
//           <div className="text-2xl font-bold text-gray-300">${portfolio.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
//           <div className={`flex items-center ${portfolio.dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//             <span>
//               {portfolio.dailyChange >= 0 ? '+' : ''}{portfolio.dailyChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (
//               {portfolio.dailyChangePercent >= 0 ? '+' : ''}{portfolio.dailyChangePercent.toFixed(2)}%)
//             </span>
//             <span className="text-gray-500 ml-2">Today</span>
//           </div>
//           <div className={`flex items-center ${portfolio.totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//             <span>
//               {portfolio.totalGainLoss >= 0 ? '+' : ''}{portfolio.totalGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (
//               {portfolio.totalGainLossPercent >= 0 ? '+' : ''}{portfolio.totalGainLossPercent.toFixed(2)}%)
//             </span>
//             <span className="text-gray-500 ml-2">Total</span>
//           </div>
//         </div>
//       </div>

//       <div className="mb-6">
//         <button
//           onClick={onShowAddStock}
//           className="px-4 py-2 bg-transparent border border-[#d4fb2b] rounded-lg text-[#d4fb2b] hover:bg-[#d4fb2b] hover:text-black flex items-center transition-all"
//         >
//           <FiPlus className="mr-2" /> Add Stock
//         </button>
//       </div>

//       <div className="mb-8 space-y-6">
//         {/* Performance Chart - Full width with horizontal scrolling on mobile */}
//         <div className="bg-[#111111] rounded-xl p-4 border border-gray-800">
//           <h3 className="text-lg font-semibold text-gray-300 mb-4">Performance History</h3>
//           <div className="overflow-x-auto">
//             <div className="min-w-[800px]">
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={mockPerformanceData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#333" />
//                     <XAxis dataKey="date" stroke="#666" />
//                     <YAxis stroke="#666" />
//                     <Tooltip 
//                       contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
//                       formatter={(value) => [`${value.toLocaleString()}`, 'Value']}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="value" 
//                       stroke="#d4fb2b" 
//                       strokeWidth={2}
//                       dot={{ fill: '#d4fb2b', r: 4 }}
//                       activeDot={{ r: 6, fill: '#d4fb2b' }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Two charts side by side with proper scrolling */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Allocation Data with horizontal scrolling */}
//           <div className="bg-[#111111] rounded-xl p-4 border border-gray-800">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-300">Allocation</h3>
//               <div className="flex gap-2">
//                 <button 
//                   className={`px-3 py-1 rounded ${chartType === 'pie' ? 'bg-[#d4fb2b] text-black' : 'bg-gray-800 text-gray-300'}`}
//                   onClick={() => setChartType('pie')}
//                 >
//                   Pie
//                 </button>
//                 <button 
//                   className={`px-3 py-1 rounded ${chartType === 'bar' ? 'bg-[#d4fb2b] text-black' : 'bg-gray-800 text-gray-300'}`}
//                   onClick={() => setChartType('bar')}
//                 >
//                   Bar
//                 </button>
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               <div className="min-w-[400px]">
//                 <div className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     {chartType === 'pie' ? (
//                       <PieChart>
//                         <Pie
//                           data={mockAllocationData}
//                           cx="50%"
//                           cy="50%"
//                           labelLine={false}
//                           outerRadius={100}
//                           fill="#8884d8"
//                           dataKey="value"
//                           nameKey="name"
//                           label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                         >
//                           {mockAllocationData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                         <Tooltip 
//                           formatter={(value) => [`${value.toLocaleString()}`, 'Value']}
//                           contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
//                         />
//                         <Legend formatter={(value) => <span style={{ color: '#d1d5db' }}>{value}</span>} />
//                       </PieChart>
//                     ) : (
//                       <BarChart data={mockAllocationData}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#333" />
//                         <XAxis dataKey="name" stroke="#666" />
//                         <YAxis stroke="#666" />
//                         <Tooltip 
//                           contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
//                           formatter={(value) => [`${value.toLocaleString()}`, 'Value']}
//                         />
//                         <Bar dataKey="value" name="Value">
//                           {mockAllocationData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                           ))}
//                         </Bar>
//                         <Legend formatter={(value) => <span style={{ color: '#d1d5db' }}>{value}</span>} />
//                       </BarChart>
//                     )}
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>
//             {/* Scroll indicator for mobile */}
//             <div className="lg:hidden flex justify-center mt-2">
//               <div className="h-1 w-16 bg-gray-600 rounded-full opacity-75"></div>
//             </div>
//           </div>

//           {/* Top Performing Stocks */}
//           <div className="bg-[#111111] rounded-xl p-4 border border-gray-800">
//             <h3 className="text-lg font-semibold text-gray-300 mb-4">Top Performers</h3>
//             <div className="space-y-4">
//               {mockStocks
//                 .sort((a, b) => b.gainLossPercent - a.gainLossPercent)
//                 .slice(0, 3)
//                 .map(stock => (
//                   <div key={stock.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
//                     <div>
//                       <div className="text-lg font-semibold text-[#d4fb2b]">{stock.symbol}</div>
//                       <div className="text-sm text-gray-400">{stock.name}</div>
//                     </div>
//                     <div className="text-right">
//                       <div className={`text-lg font-semibold ${stock.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//                         {stock.gainLossPercent.toFixed(2)}%
//                       </div>
//                       <div className={`text-sm ${stock.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//                         ${stock.gainLoss.toFixed(2)}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-[#111111] rounded-xl overflow-hidden border border-gray-800">
//         <h3 className="text-lg font-semibold text-gray-300 p-4 border-b border-gray-700">Holdings</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead className="bg-gray-900">
//               <tr>
//                 <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Symbol</th>
//                 <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
//                 <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
//                 <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Avg Cost</th>
//                 <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Current Price</th>
//                 <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Market Value</th>
//                 <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gain/Loss</th>
//                 <th className="py-3 px-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-700">
//               {mockStocks.map((stock) => (
//                 <tr key={stock.id} className="hover:bg-gray-800">
//                   <td className="py-4 px-4 text-sm font-medium text-[#d4fb2b]">{stock.symbol}</td>
//                   <td className="py-4 px-4 text-sm text-gray-300">{stock.name}</td>
//                   <td className="py-4 px-4 text-sm text-gray-300">{stock.quantity}</td>
//                   <td className="py-4 px-4 text-sm text-gray-300">${stock.purchasePrice.toFixed(2)}</td>
//                   <td className="py-4 px-4 text-sm text-gray-300">${stock.currentPrice.toFixed(2)}</td>
//                   <td className="py-4 px-4 text-sm text-gray-300">${stock.currentValue.toFixed(2)}</td>
//                   <td className={`py-4 px-4 text-sm ${stock.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//                     ${stock.gainLoss.toFixed(2)} ({stock.gainLossPercent.toFixed(2)}%)
//                   </td>
//                   <td className="py-4 px-4 text-sm text-right">
//                     <button className="text-gray-400 hover:text-red-500 ml-2">
//                       <FiTrash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// const PortfolioCard = ({ portfolio, onSelect, isSelected }) => {
//   // Add null checks to prevent the error
//   const formatValue = (value) => {
//     if (value === undefined || value === null) return "$0.00";
//     return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   };

//   const formatChange = (change, changePercent) => {
//     if (change === undefined || change === null) return "+$0.00 (0.00%)";
    
//     const prefix = change >= 0 ? '+' : '';
//     const formattedChange = change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//     const formattedPercent = changePercent !== undefined && changePercent !== null 
//       ? changePercent.toFixed(2) 
//       : '0.00';
    
//     return `${prefix}${formattedChange} (${prefix}${formattedPercent}%)`;
//   };

//   const changeColor = portfolio?.dailyChange >= 0 ? 'text-green-500' : 'text-red-500';

//   return (
//     <div 
//       className={`bg-[#111111] rounded-xl p-4 cursor-pointer transition-all ${isSelected ? 'border-2 border-[#d4fb2b]' : 'border border-gray-800 hover:border-gray-700'}`}
//       onClick={() => onSelect(portfolio.id)}
//     >
//       <h3 className="text-lg font-bold text-gray-300">{portfolio?.name || "Untitled Portfolio"}</h3>
//       <div className="text-xl font-bold text-gray-300 mt-2">
//         {formatValue(portfolio?.value)}
//       </div>
//       <div className={`text-sm ${changeColor}`}>
//         {formatChange(portfolio?.dailyChange, portfolio?.dailyChangePercent)}
//       </div>
//       <div className="mt-4 flex justify-between items-center">
//         <span className="text-gray-400">{portfolio?.stockCount || 0} stocks</span>
//         <button className="text-[#d4fb2b] hover:text-[#e5ff56] flex items-center">
//           <FiEye size={16} className="mr-1" /> View
//         </button>
//       </div>
//     </div>
//   );
// };

// export default function PortfolioPage() {
//   const [portfolios, setPortfolios] = useState(mockPortfolios);
//   const [selectedPortfolioId, setSelectedPortfolioId] = useState(mockPortfolios[0]?.id || null);
//   const [showAddStockModal, setShowAddStockModal] = useState(false);
//   const [showCreatePortfolioModal, setShowCreatePortfolioModal] = useState(false);
  
//   const selectedPortfolio = portfolios.find(p => p.id === selectedPortfolioId) || null;

//   const handleCreatePortfolio = (newPortfolio) => {
//     setPortfolios([...portfolios, newPortfolio]);
//     setSelectedPortfolioId(newPortfolio.id);
//   };

//   return (
//     <div className="p-4 md:p-6 max-w-7xl mx-auto">
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-300">Your Portfolios</h1>
//         <button
//           onClick={() => setShowCreatePortfolioModal(true)}
//           className="mt-4 md:mt-0 px-4 py-2 bg-transparent border border-[#d4fb2b] rounded-lg text-[#d4fb2b] hover:bg-[#d4fb2b] hover:text-black flex items-center justify-center transition-all"
//         >
//           <FiPlus className="mr-2" /> Create Portfolio
//         </button>
//       </div>

//       <div className="relative mb-6">
//         <div className="overflow-x-auto pb-2 flex space-x-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
//           {portfolios.map(portfolio => (
//             <div className="min-w-[280px] md:min-w-0" key={portfolio.id}>
//               <PortfolioCard 
//                 portfolio={portfolio} 
//                 onSelect={setSelectedPortfolioId}
//                 isSelected={portfolio.id === selectedPortfolioId}
//               />
//             </div>
//           ))}
//         </div>
//         {/* Scroll indicator for mobile */}
//         <div className="md:hidden absolute bottom-0 left-0 right-0 flex justify-center">
//           <div className="h-1 w-16 bg-gray-600 rounded-full opacity-75"></div>
//         </div>
//       </div>

//       {selectedPortfolio && (
//         <PortfolioDetails 
//           portfolio={selectedPortfolio} 
//           onShowAddStock={() => setShowAddStockModal(true)}
//         />
//       )}

//       {showAddStockModal && (
//         <AddStockModal 
//           portfolioId={selectedPortfolioId}
//           onClose={() => setShowAddStockModal(false)}
//           onAdd={() => {
//             // Mock implementation - would fetch updated data in real app
//             setShowAddStockModal(false);
//           }}
//         />
//       )}

//       {showCreatePortfolioModal && (
//         <CreatePortfolioModal 
//           onClose={() => setShowCreatePortfolioModal(false)}
//           onCreate={handleCreatePortfolio}
//         />
//       )}
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { Line } from 'recharts';
import { PieChart, Pie, Cell, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FiPlus, FiTrash2, FiEye, FiEdit, FiChevronDown, FiRefreshCw, FiDollarSign } from 'react-icons/fi';

// Mock data
const mockPortfolios = [
  {
    id: 1,
    name: "Tech Stocks",
    description: "Technology sector investments",
    value: 25436.78,
    dailyChange: 345.67,
    dailyChangePercent: 1.42,
    stockCount: 5,
    totalGainLoss: 3456.78,
    totalGainLossPercent: 15.72
  },
  {
    id: 2,
    name: "Dividend Stocks",
    description: "Income generating investments",
    value: 18234.50,
    dailyChange: -123.45,
    dailyChangePercent: -0.67,
    stockCount: 8,
    totalGainLoss: 1234.56,
    totalGainLossPercent: 7.26
  }
];

const mockStocks = [
  { id: 1, symbol: "AAPL", name: "Apple Inc.", quantity: 15, purchasePrice: 150.25, currentPrice: 176.28, currentValue: 2644.20, gainLoss: 390.45, gainLossPercent: 17.32 },
  { id: 2, symbol: "MSFT", name: "Microsoft Corp.", quantity: 10, purchasePrice: 290.45, currentPrice: 318.34, currentValue: 3183.40, gainLoss: 278.90, gainLossPercent: 9.6 },
  { id: 3, symbol: "GOOGL", name: "Alphabet Inc.", quantity: 5, purchasePrice: 2756.32, currentPrice: 2890.56, currentValue: 14452.80, gainLoss: 671.20, gainLossPercent: 4.87 },
  { id: 4, symbol: "AMZN", name: "Amazon.com Inc.", quantity: 8, purchasePrice: 3245.67, currentPrice: 3124.89, currentValue: 24999.12, gainLoss: -966.24, gainLossPercent: -3.72 },
];

const mockPerformanceData = [
  { date: '2024-04-01', value: 23654.45 },
  { date: '2024-04-02', value: 23789.12 },
  { date: '2024-04-03', value: 24102.56 },
  { date: '2024-04-04', value: 24056.78 },
  { date: '2024-04-05', value: 24234.45 },
  { date: '2024-04-08', value: 24567.89 },
  { date: '2024-04-09', value: 24789.23 },
  { date: '2024-04-10', value: 25012.67 },
  { date: '2024-04-11', value: 25123.45 },
  { date: '2024-04-12', value: 25346.78 },
  { date: '2024-04-15', value: 25436.78 },
];

const mockAllocationData = [
  { name: 'AAPL', value: 2644.20, color: '#FF6384' },
  { name: 'MSFT', value: 3183.40, color: '#36A2EB' },
  { name: 'GOOGL', value: 14452.80, color: '#FFCE56' },
  { name: 'AMZN', value: 24999.12, color: '#4BC0C0' },
];

const AddStockModal = ({ portfolioId, onClose, onAdd }) => {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
    // Mock implementation
    onAdd();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111111] bg-opacity-80 p-6 rounded-xl w-full max-w-md border border-gray-700 shadow-xl backdrop-filter backdrop-blur-md">
        <h2 className="text-xl font-bold mb-4 text-gray-300">Add Stock to Portfolio</h2>
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Stock Symbol</label>
          <input 
            className="w-full bg-[#111111] bg-opacity-70 border border-gray-700 rounded-lg p-2 text-gray-300"
            value={symbol} 
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="AAPL, MSFT, etc."
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Quantity</label>
          <input 
            className="w-full bg-[#111111] bg-opacity-70 border border-gray-700 rounded-lg p-2 text-gray-300"
            type="number" 
            min="1" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Purchase Price per Share ($)</label>
          <input 
            className="w-full bg-[#111111] bg-opacity-70 border border-gray-700 rounded-lg p-2 text-gray-300"
            type="number" 
            step="0.01" 
            min="0.01" 
            value={purchasePrice} 
            onChange={(e) => setPurchasePrice(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Purchase Date</label>
          <input 
            className="w-full bg-[#111111] bg-opacity-70 border border-gray-700 rounded-lg p-2 text-gray-300"
            type="date" 
            value={purchaseDate} 
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-4 py-2 border border-gray-600 rounded-lg text-gray-400 hover:text-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-transparent border border-[#d4fb2b] rounded-lg text-[#d4fb2b] hover:bg-[#d4fb2b] hover:text-black transition-all"
            onClick={handleSubmit}
          >
            Add Stock
          </button>
        </div>
      </div>
    </div>
  );
};

const CreatePortfolioModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // Mock implementation
    onCreate({ 
      id: Date.now(), 
      name, 
      description, 
      value: 0,
      dailyChange: 0,
      dailyChangePercent: 0,
      stockCount: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111111] bg-opacity-80 p-6 rounded-xl w-full max-w-md border border-gray-700 shadow-xl backdrop-filter backdrop-blur-md">
        <h2 className="text-xl font-bold mb-4 text-gray-300">Create New Portfolio</h2>
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Portfolio Name</label>
          <input 
            className="w-full bg-[#111111] bg-opacity-70 border border-gray-700 rounded-lg p-2 text-gray-300"
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="My Portfolio"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Description (optional)</label>
          <textarea 
            className="w-full bg-[#111111] bg-opacity-70 border border-gray-700 rounded-lg p-2 text-gray-300"
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Portfolio description"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-4 py-2 border border-gray-600 rounded-lg text-gray-400 hover:text-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-transparent border border-[#d4fb2b] rounded-lg text-[#d4fb2b] hover:bg-[#d4fb2b] hover:text-black transition-all"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

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

const PortfolioCard = ({ portfolio, onSelect, isSelected }) => {
  // Add null checks to prevent the error
  const formatValue = (value) => {
    if (value === undefined || value === null) return "$0.00";
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatChange = (change, changePercent) => {
    if (change === undefined || change === null) return "+$0.00 (0.00%)";
    
    const prefix = change >= 0 ? '+' : '';
    const formattedChange = change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedPercent = changePercent !== undefined && changePercent !== null 
      ? changePercent.toFixed(2) 
      : '0.00';
    
    return `${prefix}${formattedChange} (${prefix}${formattedPercent}%)`;
  };

  const changeColor = portfolio?.dailyChange >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div 
      className={`bg-[#111111] rounded-xl p-4 cursor-pointer transition-all ${isSelected ? 'border-2 border-[#d4fb2b]' : 'border border-gray-800 hover:border-gray-700'}`}
      onClick={() => onSelect(portfolio.id)}
    >
      <h3 className="text-lg font-bold text-gray-300">{portfolio?.name || "Untitled Portfolio"}</h3>
      <div className="text-xl font-bold text-gray-300 mt-2">
        {formatValue(portfolio?.value)}
      </div>
      <div className={`text-sm ${changeColor}`}>
        {formatChange(portfolio?.dailyChange, portfolio?.dailyChangePercent)}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-gray-400">{portfolio?.stockCount || 0} stocks</span>
        <button className="text-[#d4fb2b] hover:text-[#e5ff56] flex items-center">
          <FiEye size={16} className="mr-1" /> View
        </button>
      </div>
    </div>
  );
};

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState(mockPortfolios);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(mockPortfolios[0]?.id || null);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showCreatePortfolioModal, setShowCreatePortfolioModal] = useState(false);
  
  const selectedPortfolio = portfolios.find(p => p.id === selectedPortfolioId) || null;

  const handleCreatePortfolio = (newPortfolio) => {
    setPortfolios([...portfolios, newPortfolio]);
    setSelectedPortfolioId(newPortfolio.id);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-300">Your Portfolios</h1>
        <button
          onClick={() => setShowCreatePortfolioModal(true)}
          className="mt-4 md:mt-0 px-4 py-2 bg-transparent border border-[#d4fb2b] rounded-lg text-[#d4fb2b] hover:bg-[#d4fb2b] hover:text-black flex items-center justify-center transition-all"
        >
          <FiPlus className="mr-2" /> Create Portfolio
        </button>
      </div>

      <div className="relative mb-6">
        <div className="overflow-x-auto pb-2 flex space-x-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
          {portfolios.map(portfolio => (
            <div className="min-w-[280px] md:min-w-0" key={portfolio.id}>
              <PortfolioCard 
                portfolio={portfolio} 
                onSelect={setSelectedPortfolioId}
                isSelected={portfolio.id === selectedPortfolioId}
              />
            </div>
          ))}
        </div>
        {/* Scroll indicator for mobile */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 flex justify-center">
          <div className="h-1 w-16 bg-gray-600 rounded-full opacity-75"></div>
        </div>
      </div>

      {selectedPortfolio && (
        <PortfolioDetails 
          portfolio={selectedPortfolio} 
          onShowAddStock={() => setShowAddStockModal(true)}
        />
      )}

      {showAddStockModal && (
        <AddStockModal 
          portfolioId={selectedPortfolioId}
          onClose={() => setShowAddStockModal(false)}
          onAdd={() => {
            // Mock implementation - would fetch updated data in real app
            setShowAddStockModal(false);
          }}
        />
      )}

      {showCreatePortfolioModal && (
        <CreatePortfolioModal 
          onClose={() => setShowCreatePortfolioModal(false)}
          onCreate={handleCreatePortfolio}
        />
      )}
    </div>
  );
}
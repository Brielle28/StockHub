import {FiEye } from 'react-icons/fi';

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
export default PortfolioCard
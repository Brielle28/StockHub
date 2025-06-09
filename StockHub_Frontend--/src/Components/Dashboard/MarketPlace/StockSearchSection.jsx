import { useEffect, useState } from "react";
import { FiSearch, FiRefreshCw } from "react-icons/fi";

const StockSearchSection = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  onStockSelect,
  selectedStock,
  marketData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsLoading(true);
      setError(null);
      
      const timer = setTimeout(async () => {
        try {
          const results = await marketData.searchStocks(searchQuery, 10);
          setSearchResults(results);
        } catch (err) {
          console.error("Search error:", err);
          setError("Failed to search stocks. Please try again.");
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, marketData]);

  return (
    <div className="bg-[#111111] rounded-xl p-6 border border-gray-800">
      <h2 className="text-xl font-bold text-gray-300 mb-4">Stock Search</h2>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full bg-[#111111] bg-opacity-70 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-gray-300 placeholder-gray-500 focus:border-[#d4fb2b] focus:outline-none"
          placeholder="Search stocks by symbol or company name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <FiRefreshCw className="h-5 w-5 text-[#d4fb2b] animate-spin" />
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-900 border border-red-600 text-red-300 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {searchQuery && (
        <div className="space-y-2 h-[150px] md:h-[200px] overflow-y-scroll">
          {searchResults.length > 0 ? (
            searchResults.map((stock) => (
              <div
                key={stock.symbol}
                className={`p-2 md:py-2 rounded-lg border cursor-pointer transition-all ${
                  selectedStock?.symbol === stock.symbol
                    ? "border-[#d4fb2b] bg-[#d5fb2b5b] text-black bg-opacity-5"
                    : "border-gray-700 hover:border-gray-600 bg-gray-800 hover:bg-gray-750"
                }`}
                onClick={() => onStockSelect(stock)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[#d4fb2b] font-bold text-sm md:text-lg">
                        {stock.symbol}
                      </span>
                      <span className="text-gray-300">{stock.name}</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {stock.marketCap && `Market Cap: ${stock.marketCap}`}
                      {stock.volume && ` • Volume: ${stock.volume?.toLocaleString()}`}
                    </div>
                  </div>
                  {stock.currentPrice && (
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-300">
                        ${stock.currentPrice?.toFixed(2)}
                      </div>
                      {stock.change !== undefined && (
                        <div
                          className={`text-sm ${
                            stock.change >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change?.toFixed(2)} 
                          {stock.changePercent && ` (${stock.changePercent?.toFixed(2)}%)`}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            !isLoading && (
              <div className="text-center py-8 text-gray-500">
                No stocks found for "{searchQuery}"
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearchSection;
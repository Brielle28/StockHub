import { useState } from "react";
import { FiClock, FiSearch } from "react-icons/fi";
import { useSharedPortfolio } from "../../../Context/PortfolioContext";
import { useMarketData } from "../../../Context/MarketDataContext";
import StockQuoteSection from "./StockQuoteSection";
import StockHistorySection from "./StockHistorySection";
import StockNewsSection from "./StockNewsSection";
import StockSearchSection from "./StockSearchSection";

export default function MarketPage() {
  const { openAddToPortfolioModal } = useSharedPortfolio();
  const marketData = useMarketData();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  const handleAddToPortfolio = (stock) => {
    openAddToPortfolioModal(stock);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-300">
          Stock Market
        </h1>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <div className="flex items-center text-sm text-gray-400">
            <FiClock className="mr-1" />
            Market Open
          </div>
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="w-full mb-5">
        <StockSearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          onStockSelect={handleStockSelect}
          selectedStock={selectedStock}
          marketData={marketData}
        />
      </div>

      <div className="flex flex-col w-full gap-3">
        <div className="space-y-6">
          {selectedStock && (
            <>
              <StockQuoteSection
                stock={selectedStock}
                onAddToPortfolio={handleAddToPortfolio}
                marketData={marketData}
              />
              <StockHistorySection
                stock={selectedStock}
                marketData={marketData}
              />
              <StockNewsSection stock={selectedStock} marketData={marketData} />
            </>
          )}

          {!selectedStock && (
            <div className="bg-[#111111] rounded-xl p-12 border border-gray-800 text-center">
              <FiSearch className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                Search for Stocks
              </h3>
              <p className="text-gray-500">
                Enter a stock symbol or company name to view detailed
                information, charts, and news.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

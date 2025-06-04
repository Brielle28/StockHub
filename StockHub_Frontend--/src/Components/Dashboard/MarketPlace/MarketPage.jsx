import { useState } from "react";
import { FiClock } from "react-icons/fi";
import { useSharedPortfolio } from "../../../Context/PortfolioContext";
import { mockSearchResults } from "../../../Utils/MarketData";
import StockQuoteSection from "./StockQuoteSection";
import StockHistorySection from "./StockHistorySection";
import StockNewsSection from "./StockNewsSection";

import AddToPortfolioMarketModal from "../Modals/AddToPortfolioMarketModal";
import StockSearchSection from "./StockSearchSection";
export default function MarketPage() {
  const { addStockWithOptionalPortfolio, setError } = useSharedPortfolio();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [showAddToPortfolioModal, setShowAddToPortfolioModal] = useState(false);
  const [stockToAdd, setStockToAdd] = useState(null);

  // Filter search results based on query
  const searchResults = searchQuery
    ? mockSearchResults.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
    // Here you would typically call multiple APIs:
    // - Get detailed quote
    // - Get historical data
    // - Get news
  };

  const handleAddToPortfolio = (stock) => {
    setStockToAdd(stock);
    setShowAddToPortfolioModal(true);
  };

  const handlePortfolioAdd = async (portfolioData) => {
    try {
      await addStockWithOptionalPortfolio(portfolioData);
    } catch (error) {
      console.error("Error adding stock to portfolio:", error);
      throw error; // Re-throw so modal can handle it
    }
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
          onStockSelect={handleStockSelect}
          selectedStock={selectedStock}
        />
      </div>

      <div className="flex flex-col w-full gap-3">
        <div className=" space-y-6">
          {selectedStock && (
            <>
              <StockQuoteSection
                stock={selectedStock}
                onAddToPortfolio={handleAddToPortfolio}
              />
              <StockHistorySection stock={selectedStock} />
              <StockNewsSection stock={selectedStock} />
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

      {showAddToPortfolioModal && (
        <AddToPortfolioMarketModal
          stock={stockToAdd}
          onClose={() => setShowAddToPortfolioModal(false)}
          onAdd={handlePortfolioAdd}
        />
      )}
    </div>
  );
}

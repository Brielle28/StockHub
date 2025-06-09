import { useState, useEffect } from "react";
import { FiPlus, FiRefreshCw } from "react-icons/fi";

const StockQuoteSection = ({ stock, onAddToPortfolio, marketData }) => {
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (stock?.symbol) {
      fetchQuote();
    }
  }, [stock?.symbol]);

  const fetchQuote = async () => {
    if (!stock?.symbol) return;
   
    setIsLoading(true);
    setError(null);
   
    try {
      const quoteData = await marketData.getQuote(stock.symbol);
      console.log(quoteData, "this is quote")
      setQuote(quoteData);
      console.log(quoteData, "quote data received")
    } catch (err) {
      console.error("Quote fetch error:", err);
      setError("Failed to load stock quote");
    } finally {
      setIsLoading(false);
    }
  };

  // Create enhanced stock object with quote data
  const getEnhancedStockData = () => {
    if (!quote || !stock) return stock;
    
    return {
      ...stock,
      // Add quote data to stock object
      currentPrice: quote.currentPrice || 0,
      previousClose: quote.previousClose || 0,
      change: quote.change || 0,
      changePercent: quote.changePercent || 0,
      volume: quote.volume || 0,
      marketCap: quote.marketCap || 0,
      peRatio: quote.peRatio || 0,
      dayLow: quote.dayLow || 0,
      dayHigh: quote.dayHigh || 0,
      open: quote.open || 0,
      currency: quote.currency || 'USD',
      lastUpdated: quote.lastUpdated || new Date().toISOString(),
      companyName: quote.companyName || stock.name
    };
  };

  // Handle add to portfolio with enhanced data
  const handleAddToPortfolio = () => {
    const enhancedStock = getEnhancedStockData();
    onAddToPortfolio(enhancedStock);
  };

  if (!stock) return null;

  if (isLoading) {
    return (
      <div className="bg-[#111111] rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-center py-12">
          <FiRefreshCw className="w-8 h-8 text-[#d4fb2b] animate-spin mr-3" />
          <span className="text-gray-400">Loading stock quote...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#111111] rounded-xl p-6 border border-gray-800">
        <div className="text-center py-8">
          <div className="text-red-400 mb-4">{error}</div>
          <button
            onClick={fetchQuote}
            className="px-4 py-2 bg-[#d4fb2b] text-black rounded-lg hover:bg-[#e5ff56] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!quote) return null;

  // Format market cap for better display
  const formatMarketCap = (marketCap) => {
    if (marketCap == null || marketCap === undefined) return "N/A";
    if (marketCap === 0) return "$0";
   
    const billion = marketCap / 1000000000;
    const million = marketCap / 1000000;
   
    if (billion >= 1) {
      return `${billion.toFixed(2)}B`;
    } else if (million >= 1) {
      return `${million.toFixed(2)}M`;
    } else {
      return `${marketCap.toLocaleString()}`;
    }
  };

  return (
    <div className="bg-[#111111] rounded-xl p-6 border border-gray-800">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h2 className=" text-sm md:text-2xl font-bold text-[#d4fb2b]">{quote.symbol || stock.symbol}</h2>
          <p className="text-gray-400 text-sm md:text-lg">{quote.companyName || stock.name}</p>
        </div>
        <button
          onClick={handleAddToPortfolio}
          className="mt-4 lg:mt-0 px-4 py-1 md:py-2 bg-transparent border border-[#d4fb2b] rounded-lg text-[#d4fb2b] hover:bg-[#d4fb2b] hover:text-black flex items-center transition-all"
        >
          <FiPlus className="mr-2" /> Add to Portfolio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-[12px] md:text-sm text-gray-400">Current Price</div>
          <div className="text-lg md:text-2xl font-bold text-gray-300">
            {quote.currentPrice != null ? `${quote.currentPrice.toFixed(2)}` : "N/A"}
          </div>
          {quote.change != null && (
            <div
              className={`text-[12px] md:text-sm ${
                quote.change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {quote.change >= 0 ? "+" : ""}
              {quote.change.toFixed(2)}
              {quote.changePercent != null && ` (${quote.changePercent.toFixed(2)}%)`}
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-[12px] md:text-sm text-gray-400">Day Range</div>
          <div className="text-lg font-semibold text-gray-300">
            {quote.dayLow != null && quote.dayHigh != null ?
              `${quote.dayLow.toFixed(2)} - ${quote.dayHigh.toFixed(2)}` :
              "N/A"
            }
          </div>
          {quote.open != null && (
            <div className="text-[12px] md:text-sm text-gray-500">
              Open: ${quote.open.toFixed(2)}
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Volume</div>
          <div className="text-lg font-semibold text-gray-300">
            {quote.volume != null ? quote.volume.toLocaleString() : "N/A"}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Market Cap</div>
          <div className="text-lg font-semibold text-gray-300">
            {formatMarketCap(quote.marketCap)}
          </div>
          {quote.peRatio != null && quote.peRatio !== 0 && (
            <div className="text-sm text-gray-500">P/E: {quote.peRatio}</div>
          )}
        </div>
      </div>

      <div className=" flex flex-wrap items-start justify-start gap-4 text-sm">
        <div className="flex gap-2">
          <span className="text-gray-400">Previous Close:</span>
          <span className="text-gray-300">
            {quote.previousClose != null ? `${quote.previousClose.toFixed(2)}` : "N/A"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-400">Currency:</span>
          <span className="text-gray-300">
            {quote.currency || "N/A"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-400">Last Updated:</span>
          <span className="text-gray-300">
            {quote.lastUpdated ?
              new Date(quote.lastUpdated).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }) :
              "N/A"
            }
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-400">P/E Ratio:</span>
          <span className="text-gray-300">
            {quote.peRatio != null && quote.peRatio !== 0 ? quote.peRatio.toFixed(2) : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StockQuoteSection;
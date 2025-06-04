// const MarketPage = () => (
//   <div className="p-6">
//     <h1 className="text-2xl font-bold mb-6">Market Overview</h1>
//     <div className="bg-[#111111] p-6 rounded-xl shadow-lg">
//       <h2 className="text-xl font-bold mb-4">Top Performing Stocks</h2>
//       {/* Market content would go here */}
//       <p className="text-gray-400">
//         Market data visualization would be displayed here.
//       </p>
//     </div>
//   </div>
// );
// export default MarketPage;
import { useState, useEffect, useCallback } from "react";
import {
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FiSearch,
  FiPlus,
  FiTrendingUp,
  FiTrendingDown,
  FiRefreshCw,
  FiClock,
  FiDollarSign,
  FiActivity,
  FiBookmark,
  FiExternalLink,
} from "react-icons/fi";

// Mock data - replace with actual API calls
const mockSearchResults = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    currentPrice: 176.28,
    change: 2.45,
    changePercent: 1.41,
    marketCap: "2.8T",
    volume: "45.2M",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    currentPrice: 318.34,
    change: -1.23,
    changePercent: -0.38,
    marketCap: "2.4T",
    volume: "28.7M",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    currentPrice: 2890.56,
    change: 15.67,
    changePercent: 0.54,
    marketCap: "1.8T",
    volume: "15.3M",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    currentPrice: 3124.89,
    change: -8.45,
    changePercent: -0.27,
    marketCap: "1.6T",
    volume: "22.1M",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    currentPrice: 245.67,
    change: 12.34,
    changePercent: 5.29,
    marketCap: "780B",
    volume: "89.5M",
  },
];

const mockHistoricalData = [
  {
    date: "2024-05-20",
    open: 172.45,
    high: 178.32,
    low: 171.89,
    close: 176.28,
    volume: 45200000,
  },
  {
    date: "2024-05-21",
    open: 176.28,
    high: 179.45,
    low: 174.12,
    close: 178.9,
    volume: 38900000,
  },
  {
    date: "2024-05-22",
    open: 178.9,
    high: 182.34,
    low: 177.56,
    close: 181.23,
    volume: 42100000,
  },
  {
    date: "2024-05-23",
    open: 181.23,
    high: 183.67,
    low: 179.45,
    close: 180.12,
    volume: 35600000,
  },
  {
    date: "2024-05-24",
    open: 180.12,
    high: 184.89,
    low: 178.34,
    close: 183.45,
    volume: 41800000,
  },
  {
    date: "2024-05-27",
    open: 183.45,
    high: 186.78,
    low: 182.12,
    close: 185.67,
    volume: 39200000,
  },
  {
    date: "2024-05-28",
    open: 185.67,
    high: 188.23,
    low: 184.45,
    close: 187.89,
    volume: 44500000,
  },
];

const mockNewsData = [
  {
    id: 1,
    headline: "Apple Reports Strong Q2 Earnings Beat Expectations",
    summary:
      "Apple Inc. reported quarterly earnings that exceeded Wall Street expectations, driven by strong iPhone sales and services revenue growth.",
    publishedAt: "2024-05-28T14:30:00Z",
    source: "Reuters",
    url: "#",
  },
  {
    id: 2,
    headline: "New iPhone Models Expected to Drive Next Quarter Growth",
    summary:
      "Analysts predict Apple's upcoming iPhone release will significantly impact Q3 performance with new AI features attracting consumers.",
    publishedAt: "2024-05-28T10:15:00Z",
    source: "Bloomberg",
    url: "#",
  },
  {
    id: 3,
    headline:
      "Apple Expands Services Portfolio with New Subscription Offerings",
    summary:
      "The tech giant announced new service tiers and subscription bundles aimed at increasing recurring revenue streams.",
    publishedAt: "2024-05-27T16:45:00Z",
    source: "TechCrunch",
    url: "#",
  },
];

const mockQuoteData = {
  symbol: "AAPL",
  name: "Apple Inc.",
  currentPrice: 187.89,
  change: 2.45,
  changePercent: 1.32,
  dayHigh: 188.23,
  dayLow: 184.45,
  open: 185.67,
  previousClose: 185.44,
  volume: 44500000,
  avgVolume: 42100000,
  marketCap: "2.85T",
  peRatio: 28.45,
  eps: 6.59,
  dividend: 0.96,
  dividendYield: 0.51,
  beta: 1.24,
  week52High: 199.62,
  week52Low: 164.08,
};

// Portfolio mock data for add to portfolio functionality
const mockPortfolios = [
  { id: 1, name: "Tech Stocks", description: "Technology sector investments" },
  {
    id: 2,
    name: "Dividend Stocks",
    description: "Income generating investments",
  },
  {
    id: 3,
    name: "Growth Portfolio",
    description: "High growth potential stocks",
  },
];

const AddToPortfolioModal = ({ stock, onClose, onAdd }) => {
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(stock?.currentPrice || 0);
  const [createNew, setCreateNew] = useState(false);

  const handleSubmit = () => {
    const portfolioData = {
      portfolioId: createNew ? null : selectedPortfolio,
      newPortfolioName: createNew ? newPortfolioName : null,
      stock: stock,
      quantity: parseInt(quantity),
      purchasePrice: parseFloat(purchasePrice),
    };
    onAdd(portfolioData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111111] bg-opacity-90 p-6 rounded-xl w-full max-w-md border border-gray-700 shadow-xl backdrop-filter backdrop-blur-md">
        <h2 className="text-xl font-bold mb-4 text-gray-300">
          Add {stock?.symbol} to Portfolio
        </h2>

        <div className="mb-4 p-3 bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[#d4fb2b] font-semibold">
                {stock?.symbol}
              </div>
              <div className="text-sm text-gray-400">{stock?.name}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-300">
                ${stock?.currentPrice?.toFixed(2)}
              </div>
              <div
                className={`text-sm ${
                  stock?.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {stock?.change >= 0 ? "+" : ""}
                {stock?.change?.toFixed(2)} ({stock?.changePercent?.toFixed(2)}
                %)
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex gap-4 mb-3">
            <button
              className={`px-3 py-1 rounded ${
                !createNew
                  ? "bg-[#d4fb2b] text-black"
                  : "bg-gray-800 text-gray-300"
              }`}
              onClick={() => setCreateNew(false)}
            >
              Existing Portfolio
            </button>
            <button
              className={`px-3 py-1 rounded ${
                createNew
                  ? "bg-[#d4fb2b] text-black"
                  : "bg-gray-800 text-gray-300"
              }`}
              onClick={() => setCreateNew(true)}
            >
              Create New
            </button>
          </div>

          {createNew ? (
            <input
              className="w-full bg-[#111111] bg-opacity-70 border border-gray-700 rounded-lg p-2 text-gray-300"
              placeholder="New portfolio name"
              value={newPortfolioName}
              onChange={(e) => setNewPortfolioName(e.target.value)}
            />
          ) : (
            <select
              className="w-full bg-[#111111] bg-opacity-70 border border-gray-700 rounded-lg p-2 text-gray-300"
              value={selectedPortfolio}
              onChange={(e) => setSelectedPortfolio(e.target.value)}
            >
              <option value="">Select Portfolio</option>
              {mockPortfolios.map((portfolio) => (
                <option key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-300 mb-2">Quantity</label>
            <input
              className="w-full bg-[#111111] bg-opacity-70 border border-gray-700 rounded-lg p-2 text-gray-300"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Price per Share</label>
            <input
              className="w-full bg-[#111111] bg-opacity-70 border border-gray-700 rounded-lg p-2 text-gray-300"
              type="number"
              step="0.01"
              min="0.01"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4 p-3 bg-gray-800 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Investment:</span>
            <span className="text-gray-300 font-semibold">
              ${(quantity * purchasePrice || 0).toFixed(2)}
            </span>
          </div>
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
            disabled={
              (!createNew && !selectedPortfolio) ||
              (createNew && !newPortfolioName.trim())
            }
          >
            Add to Portfolio
          </button>
        </div>
      </div>
    </div>
  );
};

const StockSearchSection = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  onStockSelect,
  selectedStock,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        // Here you would call your actual search API
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

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

      {searchQuery && (
        <div className="space-y-2">
          {searchResults.length > 0 ? (
            searchResults.map((stock) => (
              <div
                key={stock.symbol}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedStock?.symbol === stock.symbol
                    ? "border-[#d4fb2b] bg-[#d4fb2b] bg-opacity-5"
                    : "border-gray-700 hover:border-gray-600 bg-gray-800 hover:bg-gray-750"
                }`}
                onClick={() => onStockSelect(stock)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[#d4fb2b] font-bold text-lg">
                        {stock.symbol}
                      </span>
                      <span className="text-gray-300">{stock.name}</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Market Cap: {stock.marketCap} • Volume: {stock.volume}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-300">
                      ${stock.currentPrice.toFixed(2)}
                    </div>
                    <div
                      className={`text-sm ${
                        stock.change >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change.toFixed(2)} (
                      {stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No stocks found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StockQuoteSection = ({ stock, onAddToPortfolio }) => {
  if (!stock) return null;

  const quote = mockQuoteData;

  return (
    <div className="bg-[#111111] rounded-xl p-6 border border-gray-800">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#d4fb2b]">{quote.symbol}</h2>
          <p className="text-gray-400">{quote.name}</p>
        </div>
        <button
          onClick={() => onAddToPortfolio(stock)}
          className="mt-4 lg:mt-0 px-4 py-2 bg-transparent border border-[#d4fb2b] rounded-lg text-[#d4fb2b] hover:bg-[#d4fb2b] hover:text-black flex items-center transition-all"
        >
          <FiPlus className="mr-2" /> Add to Portfolio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Current Price</div>
          <div className="text-2xl font-bold text-gray-300">
            ${quote.currentPrice.toFixed(2)}
          </div>
          <div
            className={`text-sm ${
              quote.change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {quote.change >= 0 ? "+" : ""}
            {quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Day Range</div>
          <div className="text-lg font-semibold text-gray-300">
            ${quote.dayLow.toFixed(2)} - ${quote.dayHigh.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            Open: ${quote.open.toFixed(2)}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Volume</div>
          <div className="text-lg font-semibold text-gray-300">
            {quote.volume.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            Avg: {quote.avgVolume.toLocaleString()}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400">Market Cap</div>
          <div className="text-lg font-semibold text-gray-300">
            {quote.marketCap}
          </div>
          <div className="text-sm text-gray-500">P/E: {quote.peRatio}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">52W High:</span>
          <span className="text-gray-300">${quote.week52High.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">52W Low:</span>
          <span className="text-gray-300">${quote.week52Low.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Dividend:</span>
          <span className="text-gray-300">
            ${quote.dividend.toFixed(2)} ({quote.dividendYield.toFixed(2)}%)
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Beta:</span>
          <span className="text-gray-300">{quote.beta.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const StockHistorySection = ({ stock }) => {
  const [timeRange, setTimeRange] = useState("1M");

  if (!stock) return null;

  const timeRanges = ["1D", "5D", "1M", "3M", "6M", "1Y", "5Y"];

  return (
    <div className="bg-[#111111] rounded-xl p-6 border border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-300">Price History</h3>
        <div className="flex gap-2 mt-2 md:mt-0">
          {timeRanges.map((range) => (
            <button
              key={range}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === range
                  ? "bg-[#d4fb2b] text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockHistoricalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#222",
                    borderColor: "#444",
                  }}
                  formatter={(value, name) => [
                    `$${value.toFixed(2)}`,
                    name.charAt(0).toUpperCase() + name.slice(1),
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#d4fb2b"
                  strokeWidth={2}
                  dot={{ fill: "#d4fb2b", r: 3 }}
                  activeDot={{ r: 5, fill: "#d4fb2b" }}
                  name="Close Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StockNewsSection = ({ stock }) => {
  if (!stock) return null;

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="bg-[#111111] rounded-xl p-6 border border-gray-800">
      <h3 className="text-lg font-semibold text-gray-300 mb-4">Latest News</h3>

      <div className="space-y-4">
        {mockNewsData.map((article) => (
          <div
            key={article.id}
            className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-gray-300 font-medium flex-1 mr-4">
                {article.headline}
              </h4>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatTimeAgo(article.publishedAt)}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-3">{article.summary}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{article.source}</span>
              <button className="text-[#d4fb2b] hover:text-[#e5ff56] flex items-center text-sm">
                <FiExternalLink className="w-3 h-3 mr-1" />
                Read more
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MarketTickerSection = () => {
  const [tickerStocks] = useState(mockSearchResults.slice(0, 5));

  return (
    <div className="bg-[#111111] rounded-xl p-4 border border-gray-800 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-300 flex items-center">
          <FiActivity className="mr-2" />
          Market Ticker
        </h3>
        <button className="text-gray-400 hover:text-[#d4fb2b]">
          <FiRefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="flex space-x-4 min-w-max">
          {tickerStocks.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg min-w-[200px]"
            >
              <div>
                <div className="text-[#d4fb2b] font-semibold">
                  {stock.symbol}
                </div>
                <div className="text-sm text-gray-400 truncate">
                  {stock.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-300 font-semibold">
                  ${stock.currentPrice.toFixed(2)}
                </div>
                <div
                  className={`text-sm ${
                    stock.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stock.change >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function MarketPage() {
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

  const handlePortfolioAdd = (portfolioData) => {
    console.log("Adding to portfolio:", portfolioData);
    // Here you would call your portfolio API
    // After successful addition, you might want to show a success message
    alert(`Successfully added ${portfolioData.stock.symbol} to portfolio!`);
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

      <MarketTickerSection />

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
        <AddToPortfolioModal
          stock={stockToAdd}
          onClose={() => setShowAddToPortfolioModal(false)}
          onAdd={handlePortfolioAdd}
        />
      )}
    </div>
  );
}

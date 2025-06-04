import { mockQuoteData } from "../../../Utils/MarketData";
import { FiPlus } from "react-icons/fi";
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
export default StockQuoteSection;

import { useState } from "react";
import { useSharedPortfolio } from "../../../Context/PortfolioContext";

const AddToPortfolioModal = ({ isOpen, stock, onClose, onAdd }) => {
  const { portfolios } = useSharedPortfolio();
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(stock?.currentPrice || 0);
  const [createNew, setCreateNew] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const portfolioData = {
      portfolioId: createNew ? null : selectedPortfolio,
      newPortfolioName: createNew ? newPortfolioName : null,
      stock: stock,
      quantity: parseInt(quantity),
      purchasePrice: parseFloat(purchasePrice),
    };
    onAdd(portfolioData);
    // Reset form
    setSelectedPortfolio("");
    setNewPortfolioName("");
    setQuantity(1);
    setPurchasePrice(stock?.currentPrice || 0);
    setCreateNew(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#b60606] bg-opacity-90 p-6 rounded-xl w-full max-w-md border border-gray-700 shadow-xl backdrop-filter backdrop-blur-md">
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
              {portfolios.map((portfolio) => (
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
            className="px-4 py-2 bg-transparent border border-[#582bfb] rounded-lg text-[#d4fb2b] hover:bg-[#d4fb2b] hover:text-black transition-all"
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
export default AddToPortfolioModal
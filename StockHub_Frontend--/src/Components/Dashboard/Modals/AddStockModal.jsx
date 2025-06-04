import { useState } from "react";

const AddStockModal = ({ isOpen, onClose, onAdd, portfolioId, stockData }) => {
  const [symbol, setSymbol] = useState(stockData?.symbol || "");
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(
    stockData?.currentPrice || ""
  );
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  if (!isOpen) return null;

  const handleSubmit = () => {
    const stockToAdd = {
      symbol: symbol.toUpperCase(),
      quantity: parseInt(quantity),
      purchasePrice: parseFloat(purchasePrice),
      purchaseDate,
      portfolioId,
      stockData,
    };
    onAdd(stockToAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111111] bg-opacity-80 p-6 rounded-xl w-full max-w-md border border-gray-700 shadow-xl backdrop-filter backdrop-blur-md">
        <h2 className="text-xl font-bold mb-4 text-gray-300">
          Add Stock to Portfolio
        </h2>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Stock Symbol</label>
          <input
            className="w-full bg-[#111111] bg-opacity-70 border border-gray-700 rounded-lg p-2 text-gray-300"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="AAPL, MSFT, etc."
            disabled={!!stockData}
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
          <label className="block text-gray-300 mb-2">
            Purchase Price per Share ($)
          </label>
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
export default AddStockModal
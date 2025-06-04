import { useState } from "react";

const CreatePortfolioModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    const newPortfolio = {
      id: Date.now().toString(),
      name,
      description,
      value: 0,
      dailyChange: 0,
      dailyChangePercent: 0,
      stockCount: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      createdAt: new Date().toISOString(),
    };
    onCreate(newPortfolio);
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111111] bg-opacity-80 p-6 rounded-xl w-full max-w-md border border-gray-700 shadow-xl backdrop-filter backdrop-blur-md">
        <h2 className="text-xl font-bold mb-4 text-gray-300">
          Create New Portfolio
        </h2>

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
          <label className="block text-gray-300 mb-2">
            Description (optional)
          </label>
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
export default CreatePortfolioModal;
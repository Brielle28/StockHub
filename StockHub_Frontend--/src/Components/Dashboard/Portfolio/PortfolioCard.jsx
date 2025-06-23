import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { useState } from "react";
import { useSharedPortfolio } from "../../../Context/PortfolioContext";
// import { useSharedPortfolio } from '../path/to/your/context'; // Adjust import path

const PortfolioCard = ({ portfolio, onSelect, isSelected }) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { handleDeletePortfolio, handleUpdatePortfolio } = useSharedPortfolio();

  const formatValue = (value) => {
    if (value === undefined || value === null) return "$0.00";
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatChange = (change, changePercent) => {
    if (change === undefined || change === null) return "+$0.00 (0.00%)";

    const prefix = change >= 0 ? "+" : "";
    const formattedChange = change.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const formattedPercent =
      changePercent !== undefined && changePercent !== null
        ? changePercent.toFixed(2)
        : "0.00";

    return `${prefix}$${formattedChange} (${prefix}${formattedPercent}%)`;
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setEditName(portfolio.name);
    setEditDescription(portfolio.description || "");
    setIsEditing(true);
    setShowActions(false);
  };

  const handleSaveEdit = async (e) => {
    e.stopPropagation();
    if (editName.trim() && editDescription.trim()) {
      await handleUpdatePortfolio(portfolio.id, {
        name: editName.trim(),
        description: editDescription.trim(),
      });
    }
    setIsEditing(false);
    setEditName("");
    setEditDescription("");
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditName("");
    setEditDescription("");
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowActions(false);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await handleDeletePortfolio(portfolio.id);
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const toggleActions = (e) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  const changeColor =
    portfolio?.dailyChange >= 0 ? "text-green-500" : "text-red-500";

  return (
    <>
      <div
        className={`bg-[#111111] rounded-xl p-5 cursor-pointer transition-all relative group
          ${
            isSelected
              ? "border-2 border-[#d4fb2b] shadow-lg shadow-[#d4fb2b]/20"
              : "border border-gray-800 hover:border-gray-700 hover:bg-[#1a1a1a]"
          }`}
        onClick={() => !isEditing && onSelect(portfolio.id)}
      >
        {/* Header with name and actions */}
        <div className="flex justify-between items-start mb-3">
          {isEditing ? (
            <div className="flex flex-col gap-3 flex-1 mr-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      editName.trim() &&
                      editDescription.trim()
                    )
                      handleSaveEdit(e);
                    if (e.key === "Escape") handleCancelEdit(e);
                  }}
                  placeholder="Portfolio name"
                  className="bg-[#1a1a1a] border border-gray-600 focus:border-[#d4fb2b] rounded-md px-3 py-2 text-sm text-white flex-1 focus:outline-none focus:ring-1 focus:ring-[#d4fb2b]"
                  autoFocus
                />
              </div>
              <div className="flex items-start gap-2">
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") handleCancelEdit(e);
                  }}
                  placeholder="Portfolio description"
                  rows="2"
                  className="bg-[#1a1a1a] border border-gray-600 focus:border-[#d4fb2b] rounded-md px-3 py-2 text-sm text-white flex-1 focus:outline-none focus:ring-1 focus:ring-[#d4fb2b] resize-none"
                />
                <div className="flex flex-col gap-1">
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editName.trim() || !editDescription.trim()}
                    className="p-2 text-green-500 hover:text-green-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiCheck size={16} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 text-red-500 hover:text-red-400 transition-colors"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 pr-3">
                <h3 className="text-lg font-bold text-white mb-1 leading-tight">
                  {portfolio?.name || "Untitled Portfolio"}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                  {portfolio?.description || "No description provided"}
                </p>
              </div>

              <div className="relative flex-shrink-0">
                <button
                  onClick={toggleActions}
                  className="text-yellow-600 transition-all"
                >
                  <FiMoreVertical size={20} />
                </button>

                {showActions && (
                  <div className="absolute right-0 top-10 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl z-10 min-w-[120px]">
                    <button
                      onClick={handleEdit}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 flex items-center rounded-t-lg"
                    >
                      <FiEdit2 size={14} className="mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 flex items-center rounded-b-lg"
                    >
                      <FiTrash2 size={14} className="mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {!isEditing && (
          <>
            {/* Daily change */}
            <div className={`text-sm font-medium ${changeColor} mb-4`}>
              {formatChange(
                portfolio?.dailyChange,
                portfolio?.dailyChangePercent
              )}
            </div>

            {/* Portfolio value */}
            <div className="text-2xl font-bold text-white mb-4">
              {formatValue(portfolio?.totalValue)}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-800">
              <span className="text-gray-500 text-sm">
                {portfolio?.stockCount || 0} stock
                {portfolio?.stockCount !== 1 ? "s" : ""}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(portfolio.id);
                }}
                className="text-[#d4fb2b] hover:text-[#e5ff56] flex items-center text-sm font-medium transition-colors"
              >
                <FiEye size={14} className="mr-1" />
                View
              </button>
            </div>
          </>
        )}

        {/* Click overlay to close actions when clicking elsewhere */}
        {showActions && (
          <div
            className="fixed inset-0 z-5"
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(false);
            }}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50"
          onClick={cancelDelete}
        >
          <div
            className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <FiTrash2 className="text-red-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Delete Portfolio
                </h3>
                <p className="text-sm text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-white">
                  "{portfolio.name}"
                </span>
                ?
              </p>
              <p className="text-sm text-gray-400">
                {portfolio.description && `"${portfolio.description}"`}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                All stocks and data in this portfolio will be permanently
                removed.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
              >
                <FiTrash2 size={14} className="mr-1" />
                Delete Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioCard;

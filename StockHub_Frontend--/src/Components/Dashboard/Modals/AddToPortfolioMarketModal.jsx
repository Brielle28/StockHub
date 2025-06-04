import { useState } from "react";
import { FiLoader, FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";
import { useSharedPortfolio } from "../../../Context/PortfolioContext";

const AddToPortfolioMarketModal = ({ stock, onClose, onAdd }) => {
  const { portfolios, loading: contextLoading } = useSharedPortfolio();
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(stock?.currentPrice || 0);
  const [createNew, setCreateNew] = useState(false);

  // Local loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Validation states
  const [validationErrors, setValidationErrors] = useState({});

  // Filter portfolios based on search query
  const filteredPortfolios = portfolios.filter((portfolio) =>
    portfolio.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!createNew && !selectedPortfolio) {
      errors.portfolio = "Please select a portfolio";
    }

    if (createNew && !newPortfolioName.trim()) {
      errors.portfolioName = "Portfolio name is required";
    }

    if (createNew && newPortfolioName.trim().length < 2) {
      errors.portfolioName = "Portfolio name must be at least 2 characters";
    }

    if (!quantity || quantity < 1) {
      errors.quantity = "Quantity must be at least 1";
    }

    if (!purchasePrice || purchasePrice <= 0) {
      errors.purchasePrice = "Purchase price must be greater than 0";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    // Clear previous states
    setError(null);
    setSuccess(false);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const portfolioData = {
        createNew,
        newPortfolioName: createNew ? newPortfolioName.trim() : null,
        selectedPortfolioId: createNew ? null : selectedPortfolio,
        stock: stock,
        quantity: parseInt(quantity),
        purchasePrice: parseFloat(purchasePrice),
      };

      await onAdd(portfolioData);

      // Show success state
      setSuccess(true);

      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error adding stock to portfolio:", error);
      setError(
        error.message || "Failed to add stock to portfolio. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Success state UI
  if (success) {
    return (
      <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#111111] bg-opacity-90 p-6 rounded-xl w-full max-w-md border border-gray-700 shadow-xl backdrop-filter backdrop-blur-md">
          <div className="text-center">
            <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2 text-gray-300">Success!</h2>
            <p className="text-gray-400 mb-4">
              Successfully added {stock?.symbol} to{" "}
              {createNew ? "new" : "existing"} portfolio
            </p>
            <div className="animate-pulse text-sm text-gray-500">
              Closing automatically...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111111] bg-opacity-90 p-6 rounded-xl w-full max-w-md border border-gray-700 shadow-xl backdrop-filter backdrop-blur-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-300">
            Add {stock?.symbol} to Portfolio
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-200 disabled:opacity-50"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-600 rounded-lg flex items-start gap-2">
            <FiAlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-red-400 font-medium text-sm">Error</div>
              <div className="text-red-300 text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Stock Info */}
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

        {/* Portfolio Selection */}
        <div className="mb-4">
          <div className="flex gap-4 mb-3">
            <button
              className={`px-3 py-1 rounded transition-all ${
                !createNew
                  ? "bg-[#d4fb2b] text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => {
                setCreateNew(false);
                setValidationErrors({});
              }}
              disabled={isSubmitting}
            >
              Existing Portfolio
            </button>
            <button
              className={`px-3 py-1 rounded transition-all ${
                createNew
                  ? "bg-[#d4fb2b] text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => {
                setCreateNew(true);
                setValidationErrors({});
              }}
              disabled={isSubmitting}
            >
              Create New
            </button>
          </div>

          {createNew ? (
            <div>
              <input
                className={`w-full bg-[#111111] bg-opacity-70 border rounded-lg p-2 text-gray-300 transition-colors ${
                  validationErrors.portfolioName
                    ? "border-red-500 focus:border-red-400"
                    : "border-gray-700 focus:border-[#d4fb2b]"
                }`}
                placeholder="New portfolio name"
                value={newPortfolioName}
                onChange={(e) => {
                  setNewPortfolioName(e.target.value);
                  if (validationErrors.portfolioName) {
                    setValidationErrors((prev) => ({
                      ...prev,
                      portfolioName: null,
                    }));
                  }
                }}
                disabled={isSubmitting}
              />
              {validationErrors.portfolioName && (
                <div className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <FiAlertCircle className="w-3 h-3" />
                  {validationErrors.portfolioName}
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Loading state for portfolios */}
              {contextLoading ? (
                <div className="flex items-center justify-center p-4 border border-gray-700 rounded-lg">
                  <FiLoader className="w-5 h-5 animate-spin text-[#d4fb2b] mr-2" />
                  <span className="text-gray-400">Loading portfolios...</span>
                </div>
              ) : (
                <>
                  <input
                    className="w-full bg-[#111111] bg-opacity-70 border border-gray-700 rounded-lg p-2 text-gray-300 mb-2 focus:border-[#d4fb2b] transition-colors"
                    placeholder="Search portfolios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isSubmitting}
                  />

                  <div
                    className={`max-h-32 overflow-y-auto border rounded-lg ${
                      validationErrors.portfolio
                        ? "border-red-500"
                        : "border-gray-700"
                    }`}
                  >
                    {filteredPortfolios.length > 0 ? (
                      filteredPortfolios.map((portfolio) => (
                        <div
                          key={portfolio.id}
                          className={`p-2 cursor-pointer transition-colors ${
                            isSubmitting
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-700"
                          } ${
                            selectedPortfolio === portfolio.id
                              ? "bg-gray-600"
                              : ""
                          }`}
                          onClick={() => {
                            if (!isSubmitting) {
                              setSelectedPortfolio(portfolio.id);
                              if (validationErrors.portfolio) {
                                setValidationErrors((prev) => ({
                                  ...prev,
                                  portfolio: null,
                                }));
                              }
                            }
                          }}
                        >
                          <div className="text-gray-300">{portfolio.name}</div>
                          <div className="text-xs text-gray-500">
                            {portfolio.stocks?.length || 0} stocks
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500 text-center">
                        {searchQuery
                          ? "No portfolios found"
                          : "No portfolios available"}
                      </div>
                    )}
                  </div>

                  {validationErrors.portfolio && (
                    <div className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" />
                      {validationErrors.portfolio}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Quantity and Price */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-300 mb-2">Quantity</label>
            <input
              className={`w-full bg-[#111111] bg-opacity-70 border rounded-lg p-2 text-gray-300 transition-colors ${
                validationErrors.quantity
                  ? "border-red-500 focus:border-red-400"
                  : "border-gray-700 focus:border-[#d4fb2b]"
              }`}
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                if (validationErrors.quantity) {
                  setValidationErrors((prev) => ({ ...prev, quantity: null }));
                }
              }}
              disabled={isSubmitting}
            />
            {validationErrors.quantity && (
              <div className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <FiAlertCircle className="w-3 h-3" />
                {validationErrors.quantity}
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Price per Share</label>
            <input
              className={`w-full bg-[#111111] bg-opacity-70 border rounded-lg p-2 text-gray-300 transition-colors ${
                validationErrors.purchasePrice
                  ? "border-red-500 focus:border-red-400"
                  : "border-gray-700 focus:border-[#d4fb2b]"
              }`}
              type="number"
              step="0.01"
              min="0.01"
              value={purchasePrice}
              onChange={(e) => {
                setPurchasePrice(e.target.value);
                if (validationErrors.purchasePrice) {
                  setValidationErrors((prev) => ({
                    ...prev,
                    purchasePrice: null,
                  }));
                }
              }}
              disabled={isSubmitting}
            />
            {validationErrors.purchasePrice && (
              <div className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <FiAlertCircle className="w-3 h-3" />
                {validationErrors.purchasePrice}
              </div>
            )}
          </div>
        </div>

        {/* Total Investment */}
        <div className="mb-4 p-3 bg-gray-800 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Investment:</span>
            <span className="text-gray-300 font-semibold">
              ${(quantity * purchasePrice || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-4 py-2 border border-gray-600 rounded-lg text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 bg-transparent border rounded-lg transition-all flex items-center gap-2 ${
              isSubmitting
                ? "border-gray-600 text-gray-500 cursor-not-allowed"
                : "border-[#d4fb2b] text-[#d4fb2b] hover:bg-[#d4fb2b] hover:text-black"
            }`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add to Portfolio"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddToPortfolioMarketModal;

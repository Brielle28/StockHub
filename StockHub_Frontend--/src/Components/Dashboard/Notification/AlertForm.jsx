import { useState } from "react";
import { useAlerts } from "../../../Context/AlertsContext";
import Toast from "./Toast";

const AlertForm = () => {
  const { createAlert, loading } = useAlerts();
  const [formData, setFormData] = useState({
    symbol: "",
    targetPrice: "",
    condition: 0, // Changed to numeric value to match backend enum
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  // Map condition enum values to display text
  const conditionOptions = [
    { value: 0, label: "Price Goes Above", text: "GREATER_THAN" },
    { value: 1, label: "Price Goes Below", text: "LESS_THAN" },
    { value: 2, label: "Price Equals", text: "EQUALS" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.symbol.trim()) {
      newErrors.symbol = "Stock symbol is required";
    } else {
      // Convert to uppercase for validation to handle lowercase input
      const upperSymbol = formData.symbol.toUpperCase().trim();
      // Updated regex to allow letters, numbers, and common symbols used in stock symbols
      if (!/^[A-Z0-9.\-=]{1,10}$/.test(upperSymbol)) {
        newErrors.symbol = "Invalid stock symbol format (letters, numbers, dots, dashes, and equals allowed)";
      }
    }

    if (!formData.targetPrice) {
      newErrors.targetPrice = "Target price is required";
    } else if (parseFloat(formData.targetPrice) <= 0) {
      newErrors.targetPrice = "Target price must be positive";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const alertData = {
        symbol: formData.symbol.toUpperCase().trim(),
        targetPrice: parseFloat(formData.targetPrice),
        condition: parseInt(formData.condition), // Ensure it's sent as number, not string
      };

      console.log("Sending alert data:", alertData); // Debug log to verify the payload

      const result = await createAlert(alertData);

      if (result.success) {
        setFormData({ symbol: "", targetPrice: "", condition: 0 });
        setToast({ message: "Alert created successfully!", type: "success" });
      } else {
        setToast({ message: result.error, type: "error" });
      }
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Stock Symbol
            </label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) =>
                setFormData({ ...formData, symbol: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#0A0A0A]/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-[#D4FB2B] focus:outline-none focus:ring-1 focus:ring-[#D4FB2B]/20 transition-all text-sm"
              placeholder="e.g., AAPL, BRK.A, MS=F"
              maxLength="10"
            />
            {errors.symbol && (
              <p className="text-red-400 text-xs mt-1">{errors.symbol}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Target Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.targetPrice}
              onChange={(e) =>
                setFormData({ ...formData, targetPrice: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#0A0A0A]/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-[#D4FB2B] focus:outline-none focus:ring-1 focus:ring-[#D4FB2B]/20 transition-all text-sm"
              placeholder="0.00"
            />
            {errors.targetPrice && (
              <p className="text-red-400 text-xs mt-1">{errors.targetPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Condition
            </label>
            <select
              value={formData.condition}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  condition: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 bg-[#0A0A0A]/80 border border-gray-600/50 rounded-lg text-white focus:border-[#D4FB2B] focus:outline-none focus:ring-1 focus:ring-[#D4FB2B]/20 transition-all text-sm"
            >
              {conditionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#D4FB2B] to-[#85e600] text-black font-medium py-2 rounded-lg hover:shadow-lg hover:shadow-[#D4FB2B]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                <span>Creating...</span>
              </div>
            ) : (
              "Create Alert"
            )}
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};
export default AlertForm;
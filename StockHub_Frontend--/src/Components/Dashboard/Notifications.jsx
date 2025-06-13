import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Check,
  X,
  Filter,
  Download,
  Search,
  Activity,
} from "lucide-react";

// Mock data
const mockAlerts = [
  {
    id: 1,
    symbol: "AAPL",
    targetPrice: 150.0,
    condition: "Greater Than",
    createdDate: "2024-06-10",
    status: "active",
  },
  {
    id: 2,
    symbol: "GOOGL",
    targetPrice: 2800.0,
    condition: "Less Than",
    createdDate: "2024-06-09",
    status: "active",
  },
  {
    id: 3,
    symbol: "TSLA",
    targetPrice: 200.0,
    condition: "Equal To",
    createdDate: "2024-06-08",
    status: "active",
  },
];

const mockTriggeredAlerts = [
  {
    id: 1,
    symbol: "MSFT",
    targetPrice: 300.0,
    actualPrice: 305.5,
    triggerDate: "2024-06-12 10:30:00",
    condition: "Greater Than",
  },
  {
    id: 2,
    symbol: "NVDA",
    targetPrice: 800.0,
    actualPrice: 795.0,
    triggerDate: "2024-06-11 14:22:00",
    condition: "Less Than",
  },
  {
    id: 3,
    symbol: "AMZN",
    targetPrice: 125.0,
    actualPrice: 125.0,
    triggerDate: "2024-06-10 09:15:00",
    condition: "Equal To",
  },
];

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-emerald-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-[#D4FB2B]";
  const textColor =
    type === "success" || type === "error" ? "text-white" : "text-black";

  return (
    <div
      className={`fixed top-6 right-6 ${bgColor} ${textColor} px-6 py-4 rounded-xl shadow-2xl z-50 max-w-sm backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="w-5 h-5" />
          <span className="font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className={`ml-4 ${textColor} hover:opacity-70 transition-opacity`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Alert Creation Form Component
const AlertForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    symbol: "",
    targetPrice: "",
    condition: "Greater Than",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.symbol.trim()) {
      newErrors.symbol = "Stock symbol is required";
    } else if (!/^[A-Z]{1,5}$/.test(formData.symbol.toUpperCase())) {
      newErrors.symbol = "Invalid stock symbol format";
    }

    if (!formData.targetPrice) {
      newErrors.targetPrice = "Target price is required";
    } else if (parseFloat(formData.targetPrice) <= 0) {
      newErrors.targetPrice = "Target price must be positive";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...formData,
        symbol: formData.symbol.toUpperCase(),
        targetPrice: parseFloat(formData.targetPrice),
      });
      setFormData({ symbol: "", targetPrice: "", condition: "Greater Than" });
    }
  };

  return (
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
            placeholder="e.g., AAPL"
            maxLength="5"
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
              setFormData({ ...formData, condition: e.target.value })
            }
            className="w-full px-3 py-2 bg-[#0A0A0A]/80 border border-gray-600/50 rounded-lg text-white focus:border-[#D4FB2B] focus:outline-none focus:ring-1 focus:ring-[#D4FB2B]/20 transition-all text-sm"
          >
            <option value="Greater Than">Price Goes Above</option>
            <option value="Less Than">Price Goes Below</option>
            <option value="Equal To">Price Equals</option>
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
  );
};

// Active Alerts Component
const ActiveAlerts = ({ alerts, onDelete, loading }) => {
  const getConditionIcon = (condition) => {
    switch (condition) {
      case "Greater Than":
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case "Less Than":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case "Greater Than":
        return "text-emerald-400";
      case "Less Than":
        return "text-red-400";
      default:
        return "text-amber-400";
    }
  };

  return (
    <div className="p-6">
      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6 text-gray-500" />
          </div>
          <h3 className="text-base font-medium text-gray-300 mb-1">
            No Active Alerts
          </h3>
          <p className="text-gray-500 text-sm">
            Create your first alert to start monitoring
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="group bg-[#0A0A0A]/50 rounded-lg p-4 border border-gray-600/30 hover:border-[#D4FB2B]/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <div className="font-mono text-[#D4FB2B] font-bold text-lg">
                      {alert.symbol}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {alert.createdDate}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {getConditionIcon(alert.condition)}
                      <span
                        className={`text-xs font-medium ${getConditionColor(
                          alert.condition
                        )}`}
                      >
                        {alert.condition}
                      </span>
                    </div>
                    <div className="text-white font-bold text-sm">
                      ${alert.targetPrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDelete(alert.id)}
                  disabled={loading}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-md transition-all duration-300 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Triggered Alerts Component
const TriggeredAlerts = ({ alerts }) => {
  const getConditionIcon = (condition) => {
    switch (condition) {
      case "Greater Than":
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case "Less Than":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="p-6">
      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 text-gray-500" />
          </div>
          <h3 className="text-base font-medium text-gray-300 mb-1">
            No Triggered Alerts
          </h3>
          <p className="text-gray-500 text-sm">
            Your triggered alerts will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-[#0A0A0A]/50 rounded-lg p-4 border border-gray-600/30 hover:border-emerald-400/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="font-mono text-[#D4FB2B] font-bold text-lg">
                    {alert.symbol}
                  </div>
                  <div className="flex items-center space-x-1">
                    {getConditionIcon(alert.condition)}
                    <span className="text-gray-400 text-xs">
                      {alert.condition}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold text-sm">
                    ${alert.actualPrice.toFixed(2)}
                  </div>
                  <div className="text-gray-400 text-xs">Triggered</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400">Target: </span>
                  <span className="text-white font-medium">
                    ${alert.targetPrice.toFixed(2)}
                  </span>
                </div>
                <div className="text-gray-400">
                  {new Date(alert.triggerDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Notifications Overlay Component
const NotificationsOverlay = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("newAlert");
  const [activeAlerts, setActiveAlerts] = useState(mockAlerts);
  const [triggeredAlerts, setTriggeredAlerts] = useState(mockTriggeredAlerts);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const overlayRef = useRef(null);

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const handleCreateAlert = async (alertData) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newAlert = {
        id: Date.now(),
        ...alertData,
        createdDate: new Date().toISOString().split("T")[0],
        status: "active",
      };

      setActiveAlerts((prev) => [...prev, newAlert]);
      showToast("Alert created successfully!", "success");
      setActiveTab("activeAlerts"); // Switch to active alerts tab
    } catch (error) {
      showToast("Failed to create alert. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setActiveAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
      showToast("Alert deleted successfully!", "success");
    } catch (error) {
      showToast("Failed to delete alert. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "newAlert", label: "New Alert", icon: Plus, count: null },
    {
      id: "activeAlerts",
      label: "Active",
      icon: Bell,
      count: activeAlerts.length,
    },
    {
      id: "triggeredAlerts",
      label: "History",
      icon: Check,
      count: triggeredAlerts.length,
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed top-16 right-10 w-96 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-2xl border border-gray-700/50 shadow-2xl backdrop-blur-xl z-50 max-h-[calc(100vh-5rem)] overflow-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#D4FB2B]/10 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-[#D4FB2B]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Notifications</h2>
              <p className="text-gray-400 text-[12px]">Manage your alerts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-700/50 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "text-[#D4FB2B] border-b-2 border-[#D4FB2B] bg-[#D4FB2B]/5"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="text-[12px]">{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                      activeTab === tab.id
                        ? "bg-[#D4FB2B] text-black"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto max-h-96">
          {activeTab === "newAlert" && (
            <AlertForm onSubmit={handleCreateAlert} loading={loading} />
          )}
          {activeTab === "activeAlerts" && (
            <ActiveAlerts
              alerts={activeAlerts}
              onDelete={handleDeleteAlert}
              loading={loading}
            />
          )}
          {activeTab === "triggeredAlerts" && (
            <TriggeredAlerts alerts={triggeredAlerts} />
          )}
        </div>

        {/* Footer Stats */}
        <div className="p-4 border-t border-gray-700/50 bg-[#0A0A0A]/50">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400 ">
              <span className="text-[#D4FB2B] font-bold">
                {activeAlerts.length}
              </span>{" "}
              Active
            </div>
            <div className="text-gray-400">
              <span className="text-emerald-400 font-bold">
                {triggeredAlerts.length}
              </span>{" "}
              Triggered
            </div>
            <div className="flex items-center space-x-1 text-emerald-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs">Live</span>
            </div>
          </div>
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
export default NotificationsOverlay;

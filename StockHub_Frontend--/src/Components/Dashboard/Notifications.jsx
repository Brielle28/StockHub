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
  Activity,
  Wifi,
  WifiOff,
  AlertTriangle,
} from "lucide-react";
import { useAlerts } from "../../Context/AlertsContext";

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

// Connection status indicator
const ConnectionStatus = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case "connected":
        return { icon: Wifi, color: "text-emerald-400", text: "Live" };
      case "connecting":
        return { icon: Activity, color: "text-yellow-400", text: "Connecting" };
      case "failed":
        return { icon: AlertTriangle, color: "text-red-400", text: "Failed" };
      default:
        return { icon: WifiOff, color: "text-gray-400", text: "Offline" };
    }
  };

  const { icon: Icon, color, text } = getStatusInfo();

  return (
    <div className={`flex items-center space-x-1 ${color}`}>
      <div
        className={`w-2 h-2 ${color.replace("text-", "bg-")} rounded-full ${
          status === "connected" ? "animate-pulse" : ""
        }`}
      ></div>
      <Icon className="w-3 h-3" />
      <span className="text-xs">{text}</span>
    </div>
  );
};

// Alert Creation Form Component
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

  const handleSubmit = async () => {
    if (validateForm()) {
      const alertData = {
        symbol: formData.symbol.toUpperCase(),
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

// Active Alerts Component
const ActiveAlerts = () => {
  const { activeAlerts, deleteAlert, loading } = useAlerts();
  const [toast, setToast] = useState(null);

  const handleDelete = async (alertId) => {
    const result = await deleteAlert(alertId);

    if (result.success) {
      setToast({ message: "Alert deleted successfully!", type: "success" });
    } else {
      setToast({ message: result.error, type: "error" });
    }
  };

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
    <>
      <div className="p-6">
        {activeAlerts.length === 0 ? (
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
            {activeAlerts.map((alert) => (
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
                        {new Date(
                          alert.createdDate || alert.createdAt
                        ).toLocaleDateString()}
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
                    onClick={() => handleDelete(alert.id)}
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

// Triggered Alerts Component
const TriggeredAlerts = () => {
  const { triggeredAlerts } = useAlerts();

  // Map numeric condition values to strings
  const getConditionText = (condition) => {
    switch (condition) {
      case 0:
        return "Greater Than";
      case 1:
        return "Less Than";
      case 2:
        return "Equals";
      default:
        return "Unknown";
    }
  };

  const getConditionIcon = (condition) => {
    const conditionText = getConditionText(condition);
    switch (conditionText) {
      case "Greater Than":
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case "Less Than":
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case "Equals":
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="p-6">
      {triggeredAlerts.length === 0 ? (
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
          {triggeredAlerts.map((alert) => (
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
                      {getConditionText(alert.condition)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold text-sm">
                    ${alert.targetPrice.toFixed(2)}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {alert.symbol}{" "}
                    {getConditionText(alert.condition) === "Greater Than"
                      ? "Above"
                      : getConditionText(alert.condition) === "Less Than"
                      ? "Below"
                      : "Equal to"}{" "}
                    Target
                  </div>
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
                  {new Date(
                    alert.triggerDate || alert.triggeredAt
                  ).toLocaleDateString()}
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
  const {
    activeAlerts,
    triggeredAlerts,
    connectionStatus,
    error,
    clearError,
    refreshData,
  } = useAlerts();

  const [activeTab, setActiveTab] = useState("newAlert");
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

  // Clear error when component mounts
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

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
        className="fixed top-16 lg:right-10 w-96 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-2xl border border-gray-700/50 shadow-2xl backdrop-blur-xl z-50 max-h-[calc(100vh-5rem)] overflow-auto"
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
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshData}
              className="text-gray-400 hover:text-white p-2 hover:bg-gray-700/50 rounded-lg transition-all"
              title="Refresh data"
            >
              <Activity className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 hover:bg-gray-700/50 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
              <button
                onClick={clearError}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

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
          {activeTab === "newAlert" && <AlertForm />}
          {activeTab === "activeAlerts" && <ActiveAlerts />}
          {activeTab === "triggeredAlerts" && <TriggeredAlerts />}
        </div>

        {/* Footer Stats */}
        <div className="p-4 border-t border-gray-700/50 bg-[#0A0A0A]/50">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
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
            <ConnectionStatus status={connectionStatus} />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsOverlay;

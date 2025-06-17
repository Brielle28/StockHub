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
import AlertForm from "./Notification/AlertForm";
import ActiveAlerts from "./Notification/ActiveAlerts";
import TriggeredAlerts from "./Notification/TriggeredAlerts";
import ConnectionStatus from "./Notification/ConnectionStatus";

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
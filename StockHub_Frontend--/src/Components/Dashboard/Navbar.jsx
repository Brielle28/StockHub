import { FaBars, FaBell } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import NotificationsOverlay from "./Notifications";
import { useAlerts } from "../../Context/AlertsContext";

// Toast notification component for new alerts
const NewAlertToast = ({ alert, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 8000); // Show for 8 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const getConditionText = (condition) => {
    switch (condition) {
      case 0: return "above";
      case 1: return "below";
      case 2: return "equal to";
      default: return "at";
    }
  };

  return (
    <div className="fixed top-20 right-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 max-w-sm backdrop-blur-sm animate-slide-in">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <FaBell className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm mb-1">🎯 Alert Triggered!</div>
          <div className="text-sm opacity-90">
            <span className="font-semibold">{alert.symbol}</span> is now{" "}
            <span className="font-semibold">{getConditionText(alert.condition)}</span>{" "}
            <span className="font-semibold">${alert.targetPrice?.toFixed(2)}</span>
          </div>
          <div className="text-xs opacity-75 mt-1">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const Navbar = ({ toggleSidebar }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [newAlertToast, setNewAlertToast] = useState(null);
  const [lastTriggeredCount, setLastTriggeredCount] = useState(0);
  
  const { user } = useAuth();
  const { triggeredAlerts, activeAlerts, connectionStatus } = useAlerts();

  // Check for new triggered alerts and show toast
  useEffect(() => {
    if (triggeredAlerts.length > lastTriggeredCount && lastTriggeredCount > 0) {
      // New alert triggered
      const newAlert = triggeredAlerts[triggeredAlerts.length - 1];
      setNewAlertToast(newAlert);
      setHasUnreadNotifications(true);
    }
    setLastTriggeredCount(triggeredAlerts.length);
  }, [triggeredAlerts.length, lastTriggeredCount]);

  // Determine notification dot status
  useEffect(() => {
    // Show red dot if there are unread notifications or connection issues
    // Show green dot if connected and alerts are active
    // No dot if no alerts and disconnected
    if (triggeredAlerts.length > 0 && hasUnreadNotifications) {
      // Has unread triggered alerts - red dot
      setHasUnreadNotifications(true);
    } else if (activeAlerts.length > 0 && connectionStatus === 'connected') {
      // Has active alerts and connected - green dot (but no unread)
      // We'll show this as a subtle indicator
    }
  }, [triggeredAlerts.length, activeAlerts.length, connectionStatus]);

  // Clear unread status when notifications are opened
  const handleNotificationsOpen = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen) {
      // Opening notifications - mark as read
      setHasUnreadNotifications(false);
    }
  };

  // Determine dot color and visibility
  const getDotStatus = () => {
    if (hasUnreadNotifications || triggeredAlerts.length > 0) {
      return { show: true, color: 'bg-red-500', pulse: hasUnreadNotifications };
    } else if (activeAlerts.length > 0 && connectionStatus === 'connected') {
      return { show: true, color: 'bg-emerald-500', pulse: false };
    } else if (connectionStatus === 'failed') {
      return { show: true, color: 'bg-amber-500', pulse: true };
    }
    return { show: false, color: '', pulse: false };
  };

  const dotStatus = getDotStatus();

  return (
    <>
      <header className="bg-[#0a0a0a] border-b border-gray-800 sticky top-0 z-20">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Sidebar toggle button (visible on small screens) */}
          <div className="flex items-center justify-end lg:hidden">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
            >
              <FaBars className="text-gray-400" />
            </button>
          </div>

          {/* User initials (hidden on large screens) */}
          <div className="flex items-center space-x-2 lg:hidden">
            <div className="h-8 w-8 rounded-full bg-[#d4fb2b] flex items-center justify-center text-black font-bold">
              {user?.firstName?.[0] || "G"}
              {user?.lastName?.[0] || "U"}
            </div>
          </div>

          {/* Spacer to push bell icon to right on large screens */}
          <div className="flex-1"></div>

          {/* Bell icon with notification dot */}
          <button
            onClick={handleNotificationsOpen}
            className="relative p-2 rounded-full bg-[#111111] text-gray-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-gray-600 transition-colors"
          >
            <FaBell />
            
            {/* Notification dot */}
            {dotStatus.show && (
              <div className="absolute -top-1 -right-1">
                <div 
                  className={`w-3 h-3 ${dotStatus.color} rounded-full border-2 border-[#0a0a0a] ${
                    dotStatus.pulse ? 'animate-pulse' : ''
                  }`}
                >
                  {/* Inner glow effect for active states */}
                  <div 
                    className={`w-full h-full ${dotStatus.color} rounded-full ${
                      dotStatus.pulse ? 'animate-ping opacity-75' : ''
                    }`}
                  ></div>
                </div>
              </div>
            )}
          </button>

          <NotificationsOverlay
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />
        </div>
      </header>

      {/* Toast for new alerts */}
      {newAlertToast && (
        <NewAlertToast
          alert={newAlertToast}
          onClose={() => setNewAlertToast(null)}
        />
      )}

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;
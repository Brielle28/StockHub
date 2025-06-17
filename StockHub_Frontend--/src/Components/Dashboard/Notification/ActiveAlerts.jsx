import { useState } from "react";
import { useAlerts } from "../../../Context/AlertsContext";
import { AlertCircle, Bell, Trash2, TrendingDown, TrendingUp,  } from "lucide-react";
import { FaEquals } from "react-icons/fa";
import Toast from "./Toast";

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

  // Convert numeric conditions to readable text
  const getConditionText = (condition) => {
    if (typeof condition === 'number') {
      switch (condition) {
        case 0:
          return "Greater Than";
        case 1:
          return "Less Than";
        case 2:
          return "Equal To";
        default:
          return "Unknown";
      }
    }
    return condition; // If it's already text, return as is
  };

  const getConditionIcon = (condition) => {
    const conditionText = getConditionText(condition);
    switch (conditionText) {
      case "Greater Than":
        return <TrendingUp className="text-[10px] text-emerald-400" />;
      case "Less Than":
        return <TrendingDown className="text-[10px] text-red-400" />;
      case "Equal To":
        return <FaEquals className="text-[10px] text-amber-400" />;
      default:
        return <AlertCircle className="text-[10px] text-gray-400" />;
    }
  };

  const getConditionColor = (condition) => {
    const conditionText = getConditionText(condition);
    switch (conditionText) {
      case "Greater Than":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "Less Than":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "Equal To":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };
  return (
    <>
      <div className="p-6">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-700/20 to-gray-800/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-gray-600/20">
              <Bell className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              No Active Alerts
            </h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Create your first price alert to start monitoring your favorite stocks
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-gray-800/20 scrollbar-thumb-gray-600/40">
            {activeAlerts.map((alert, index) => (
              <div
                key={alert.id}
                className="group relative bg-gradient-to-r from-[#0A0A0A]/80 to-[#0A0A0A]/60 rounded-xl p-3 border border-gray-600/20 hover:border-[#D4FB2B]/40 transition-all duration-500 hover:shadow-lg hover:shadow-[#D4FB2B]/10 backdrop-blur-sm"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards"
                }}
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4FB2B]/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative flex items-center justify-between">
                  {/* Left section - Stock info */}
                  <div className="flex items-center space-x-4">
                    <div className="text-start">
                      <div className="font-mono text-[#D4FB2B] font-bold text-[17px] tracking-wider">
                        {alert.symbol}
                      </div>
                      <div className="text-gray-500 text-xs mt-1 font-medium">
                        {new Date(
                          alert.createdDate || alert.createdAt
                        ).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>

                    {/* Condition indicator */}
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-[12px] font-semibold ${getConditionColor(alert.condition)}`}>
                       <span className="text-sm"> {getConditionIcon(alert.condition)} </span> 
                        <span className="">{getConditionText(alert.condition)}</span>
                      </div>
                      
                      {/* Price comparison visual */}
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-white font-bold text-lg">
                          ${alert.targetPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right section - Delete button */}
                  <button
                    onClick={() => handleDelete(alert.id)}
                    disabled={loading}
                    className="opacity-0 group-hover:opacity-100 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 p-2.5 rounded-lg transition-all duration-300 disabled:opacity-50 hover:scale-110 active:scale-95"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4FB2B]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-track-gray-800\\/20::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.2);
          border-radius: 3px;
        }
        
        .scrollbar-thumb-gray-600\\/40::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.4);
          border-radius: 3px;
        }
        
        .scrollbar-thumb-gray-600\\/40::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.6);
        }
      `}</style>
    </>
  );
};
export default ActiveAlerts;
import { AlertCircle, Check, TrendingDown, TrendingUp } from "lucide-react";
import { useAlerts } from "../../../Context/AlertsContext";

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
export default TriggeredAlerts;
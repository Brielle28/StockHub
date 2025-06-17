// import { useAlerts } from "../../Context/AlertsContext";
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
export default ConnectionStatus;
import { Bell, X } from "lucide-react";
import { useEffect } from "react";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-[#D4FB2B]"
      : type === "error"
      ? "bg-red-500"
      : "bg-[#D4FB2B]";
  const textColor =
    type === "success" || type === "error" ? "text-black" : "text-black";

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
export default Toast;
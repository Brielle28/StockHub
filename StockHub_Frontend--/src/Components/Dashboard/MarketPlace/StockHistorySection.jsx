import { useState, useEffect } from "react";
import { FiRefreshCw } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../../Services/axios";

const StockHistorySection = ({ stock }) => {
  const [timeRange, setTimeRange] = useState("1mo");
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const timeRangeMap = {
    "1D": { range: "1d", interval: "1m" },
    "5D": { range: "5d", interval: "5m" },
    "1M": { range: "1mo", interval: "1d" },
    "3M": { range: "3mo", interval: "1d" },
    "6M": { range: "6mo", interval: "1d" },
    "1Y": { range: "1y", interval: "1wk" },
    "5Y": { range: "5y", interval: "1mo" },
  };

  const timeRanges = ["1D", "5D", "1M", "3M", "6M", "1Y", "5Y"];

  // Safely parse date string
  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    
    // Handle different date formats
    let date;
    if (typeof dateStr === 'string') {
      // If it's ISO string, parse directly
      if (dateStr.includes('T')) {
        date = new Date(dateStr);
      } else {
        // If it's just a date string, parse it
        date = new Date(dateStr);
      }
    } else {
      date = new Date(dateStr);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateStr);
      return new Date();
    }
    
    return date;
  };

  // Format date based on time range
  const formatDate = (dateStr, timeRange) => {
    const date = parseDate(dateStr);
    
    try {
      switch (timeRange) {
        case "1D":
          return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
        case "5D":
          return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric'
          });
        case "1M":
        case "3M":
          return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
        case "6M":
        case "1Y":
          return date.toLocaleDateString('en-US', { 
            month: 'short', 
            year: '2-digit' 
          });
        case "5Y":
          return date.toLocaleDateString('en-US', { 
            year: 'numeric' 
          });
        default:
          return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: '2-digit' 
          });
      }
    } catch (error) {
      console.warn('Date formatting error:', error, dateStr);
      return dateStr; // Fallback to original string
    }
  };

  // Format tooltip date for detailed view
  const formatTooltipDate = (dateStr) => {
    const date = parseDate(dateStr);
    
    try {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: timeRange === "1D" || timeRange === "5D" ? '2-digit' : undefined,
        minute: timeRange === "1D" || timeRange === "5D" ? '2-digit' : undefined,
      });
    } catch (error) {
      console.warn('Tooltip date formatting error:', error, dateStr);
      return dateStr; // Fallback to original string
    }
  };

  // Calculate tick interval based on data length
  const calculateTickInterval = (dataLength) => {
    if (dataLength <= 10) return 0;
    if (dataLength <= 30) return Math.ceil(dataLength / 8);
    if (dataLength <= 100) return Math.ceil(dataLength / 10);
    return Math.ceil(dataLength / 12);
  };

  useEffect(() => {
    if (stock?.symbol) {
      fetchHistory();
    }
  }, [stock?.symbol, timeRange]);

  const fetchHistory = async () => {
    if (!stock?.symbol) return;

    setIsLoading(true);
    setError(null);

    try {
      const { range, interval } = timeRangeMap[timeRange] || timeRangeMap["1M"];
      const response = await axiosInstance.get(`/api/StockData/${stock.symbol}/history`, {
        params: { range, interval },
      });

      const transformedData = response.data?.dataPoints || [];
      
      // Add formatted date for display with error handling
      const dataWithFormattedDates = transformedData.map((item, index) => {
        try {
          return {
            ...item,
            formattedDate: formatDate(item.date, timeRange),
            originalDate: item.date
          };
        } catch (error) {
          console.warn(`Error formatting date at index ${index}:`, error, item.date);
          return {
            ...item,
            formattedDate: item.date || `Point ${index + 1}`, // Fallback
            originalDate: item.date
          };
        }
      });
      
      setHistoryData(dataWithFormattedDates);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load price history");
      setHistoryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeRangeChange = (range) => setTimeRange(range);

  if (!stock) return null;

  const tickInterval = calculateTickInterval(historyData.length);

  return (
    <div className="bg-[#111111] rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h3 className="text-lg font-semibold text-gray-300">Price History</h3>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-all duration-200 ${
                timeRange === range || (timeRange === "1mo" && range === "1M")
                  ? "bg-[#d4fb2b] text-black font-medium"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => handleTimeRangeChange(range)}
              disabled={isLoading}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <FiRefreshCw className="w-6 h-6 text-[#d4fb2b] animate-spin mr-3" />
          <span className="text-gray-400">Loading price history...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <div className="text-red-400 mb-4">{error}</div>
          <button
            onClick={fetchHistory}
            className="px-4 py-2 bg-[#d4fb2b] text-black rounded-lg hover:bg-[#e5ff56] transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="w-full">
          <div className="w-full h-64 sm:h-80 lg:h-96">
            {historyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={historyData}
                  margin={{ 
                    top: 10, 
                    right: 10, 
                    left: 0, 
                    bottom: 10 
                  }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#333" 
                    opacity={0.3}
                  />
                  <XAxis 
                    dataKey="formattedDate" 
                    stroke="#666" 
                    tick={{ fontSize: 10 }}
                    interval={tickInterval}
                    angle={historyData.length > 20 ? -45 : 0}
                    textAnchor={historyData.length > 20 ? "end" : "middle"}
                    height={historyData.length > 20 ? 60 : 40}
                  />
                  <YAxis 
                    stroke="#666" 
                    tick={{ fontSize: 10 }} 
                    domain={["dataMin - 1", "dataMax + 1"]}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      borderColor: "#444",
                      borderRadius: "12px",
                      border: "1px solid #444",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                    }}
                    labelStyle={{
                      color: "#d4fb2b",
                      fontWeight: "600",
                      marginBottom: "4px"
                    }}
                    formatter={(value) => [
                      `$${Number(value).toFixed(2)}`,
                      "Close Price",
                    ]}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return formatTooltipDate(payload[0].payload.originalDate);
                      }
                      return label;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke="#d4fb2b"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ 
                      r: 6, 
                      fill: "#d4fb2b",
                      stroke: "#000",
                      strokeWidth: 2
                    }}
                    name="Close Price"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-lg mb-2">📈</div>
                  <div>No price history data available</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockHistorySection;
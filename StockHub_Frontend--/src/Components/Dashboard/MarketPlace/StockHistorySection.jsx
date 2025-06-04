import { useState } from "react";
import { mockHistoricalData } from "../../../Utils/MarketData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StockHistorySection = ({ stock }) => {
  const [timeRange, setTimeRange] = useState("1M");

  if (!stock) return null;

  const timeRanges = ["1D", "5D", "1M", "3M", "6M", "1Y", "5Y"];

  return (
    <div className="bg-[#111111] rounded-xl p-6 border border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-300">Price History</h3>
        <div className="flex gap-2 mt-2 md:mt-0">
          {timeRanges.map((range) => (
            <button
              key={range}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === range
                  ? "bg-[#d4fb2b] text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockHistoricalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#222",
                    borderColor: "#444",
                  }}
                  formatter={(value, name) => [
                    `$${value.toFixed(2)}`,
                    name.charAt(0).toUpperCase() + name.slice(1),
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#d4fb2b"
                  strokeWidth={2}
                  dot={{ fill: "#d4fb2b", r: 3 }}
                  activeDot={{ r: 5, fill: "#d4fb2b" }}
                  name="Close Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StockHistorySection;

import { mockNewsData } from "../../../Utils/MarketData";
import { FiExternalLink } from "react-icons/fi";
const StockNewsSection = ({ stock }) => {
  if (!stock) return null;

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="bg-[#111111] rounded-xl p-6 border border-gray-800">
      <h3 className="text-lg font-semibold text-gray-300 mb-4">Latest News</h3>

      <div className="space-y-4">
        {mockNewsData.map((article) => (
          <div
            key={article.id}
            className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-gray-300 font-medium flex-1 mr-4">
                {article.headline}
              </h4>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatTimeAgo(article.publishedAt)}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-3">{article.summary}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{article.source}</span>
              <button className="text-[#d4fb2b] hover:text-[#e5ff56] flex items-center text-sm">
                <FiExternalLink className="w-3 h-3 mr-1" />
                Read more
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default StockNewsSection;

// import { mockNewsData } from "../../../Utils/MarketData";
// import { FiExternalLink } from "react-icons/fi";
// const StockNewsSection = ({ stock }) => {
//   if (!stock) return null;

//   const formatTimeAgo = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diff = now - date;
//     const hours = Math.floor(diff / (1000 * 60 * 60));

//     if (hours < 1) return "Just now";
//     if (hours < 24) return `${hours}h ago`;
//     const days = Math.floor(hours / 24);
//     return `${days}d ago`;
//   };

//   return (
//     <div className="bg-[#111111] rounded-xl p-6 border border-gray-800">
//       <h3 className="text-lg font-semibold text-gray-300 mb-4">Latest News</h3>

//       <div className="space-y-4">
//         {mockNewsData.map((article) => (
//           <div
//             key={article.id}
//             className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
//           >
//             <div className="flex justify-between items-start mb-2">
//               <h4 className="text-gray-300 font-medium flex-1 mr-4">
//                 {article.headline}
//               </h4>
//               <span className="text-xs text-gray-500 whitespace-nowrap">
//                 {formatTimeAgo(article.publishedAt)}
//               </span>
//             </div>
//             <p className="text-gray-400 text-sm mb-3">{article.summary}</p>
//             <div className="flex justify-between items-center">
//               <span className="text-xs text-gray-500">{article.source}</span>
//               <button className="text-[#d4fb2b] hover:text-[#e5ff56] flex items-center text-sm">
//                 <FiExternalLink className="w-3 h-3 mr-1" />
//                 Read more
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
// export default StockNewsSection;
import { useState, useEffect } from "react";
import { FiExternalLink, FiRefreshCw } from "react-icons/fi";

const StockNewsSection = ({ stock, marketData }) => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (stock?.symbol) {
      fetchNews();
    }
  }, [stock?.symbol]);

  const fetchNews = async () => {
    if (!stock?.symbol) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newsData = await marketData.getNews(stock.symbol, 10, 0);
      setNews(Array.isArray(newsData) ? newsData : []);
    } catch (err) {
      console.error("News fetch error:", err);
      setError("Failed to load news");
      setNews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Unknown";
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      const hours = Math.floor(diff / (1000 * 60 * 60));

      if (hours < 1) return "Just now";
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return "Unknown";
    }
  };

  const handleReadMore = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (!stock) return null;

  return (
    <div className="bg-[#111111] rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-300">Latest News</h3>
        {!isLoading && (
          <button
            onClick={fetchNews}
            className="text-[#d4fb2b] hover:text-[#e5ff56] text-sm flex items-center"
          >
            <FiRefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <FiRefreshCw className="w-6 h-6 text-[#d4fb2b] animate-spin mr-3" />
          <span className="text-gray-400">Loading news...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <div className="text-red-400 mb-4">{error}</div>
          <button
            onClick={fetchNews}
            className="px-4 py-2 bg-[#d4fb2b] text-black rounded-lg hover:bg-[#e5ff56] transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-4">
          {news.length > 0 ? (
            news.map((article, index) => (
              <div
                key={article.id || index}
                className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-gray-300 font-medium flex-1 mr-4">
                    {article.headline || article.title || "No headline available"}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatTimeAgo(article.publishedAt || article.published_at || article.date)}
                  </span>
                </div>
                
                {(article.summary || article.description) && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                    {article.summary || article.description}
                  </p>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {article.source || article.publisher || "Unknown Source"}
                  </span>
                  
                  {(article.url || article.link) && (
                    <button 
                      onClick={() => handleReadMore(article.url || article.link)}
                      className="text-[#d4fb2b] hover:text-[#e5ff56] flex items-center text-sm transition-colors"
                    >
                      <FiExternalLink className="w-3 h-3 mr-1" />
                      Read more
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No news articles available for {stock.symbol}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockNewsSection;
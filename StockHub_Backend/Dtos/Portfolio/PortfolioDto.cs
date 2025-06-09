using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace StockHub_Backend.DTOs.Portfolio
{
    public class PortfolioDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int StockCount { get; set; }
        public decimal TotalValue { get; set; }
        public decimal DailyChange { get; set; }
        public decimal DailyChangePercent { get; set; }
    }

    // Kafka event DTOs
    public class StockPriceUpdateEvent
    {
        public string Symbol { get; set; }
        public decimal Price { get; set; }
        public decimal PreviousClose { get; set; }
        public DateTime Timestamp { get; set; }
    }

    public class PortfolioChangeEvent
    {
        public string UserId { get; set; }
        public int PortfolioId { get; set; }
        public string ChangeType { get; set; } // Created, Updated, Deleted
        public DateTime Timestamp { get; set; }
        public string PortfolioName { get; set; }
        public string Description { get; set; }
    }

    public class PortfolioStockChangeEvent
    {
        public string UserId { get; set; }
        public int PortfolioId { get; set; }
        public string Symbol { get; set; }
        public string ChangeType { get; set; } // Added, Updated, Removed
        public DateTime Timestamp { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? PurchasePrice { get; set; }
        public decimal? CurrentPrice { get; set; }
        public DateTime? PurchaseDate { get; set; }
    }

    public class StockPriceChangeEvent
    {
        public string Symbol { get; set; }
        public decimal CurrentPrice { get; set; }
        public decimal PreviousPrice { get; set; }
        public decimal ChangePercent { get; set; }
        public DateTime Timestamp { get; set; }
        public List<int> AffectedPortfolioIds { get; set; } = new List<int>();
        public List<string> AffectedUserIds { get; set; } = new List<string>();
    }
}
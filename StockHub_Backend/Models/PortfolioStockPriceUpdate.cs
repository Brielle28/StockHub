using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace StockHub_Backend.Models
{
    public class PortfolioStockPriceUpdate
    {
        public int PortfolioStockId { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public decimal CurrentPrice { get; set; }
        public decimal Change { get; set; }
        public decimal ChangePercent { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
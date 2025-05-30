using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace StockHub_Backend.Models
{
    [Table("Stock")]
    public class Stock
    {
        public int Id { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Purchase { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal LastDiv { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal CurrentPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PreviousClose { get; set; }

        public string Industry { get; set; } = string.Empty;
        public long MarketCap { get; set; }
        public DateTime LastUpdated { get; set; }

        public List<Comment> Comments { get; set; } = new List<Comment>();
        public List<PortfolioStock> PortfolioStocks { get; set; } = new List<PortfolioStock>();
    }
}
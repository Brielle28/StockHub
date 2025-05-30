using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Models
{

    public class StockQuote
    {
        public string Symbol { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public decimal CurrentPrice { get; set; }
        public decimal Change { get; set; }
        public decimal ChangePercent { get; set; }
        public DateTime LastUpdated { get; set; }
        public string Currency { get; set; } = "USD";
        public long Volume { get; set; }
        public decimal DayHigh { get; set; }
        public decimal DayLow { get; set; }
        public decimal Open { get; set; }
        public decimal PreviousClose { get; set; }
        public decimal MarketCap { get; set; }
        public decimal PeRatio { get; set; }
    }

}
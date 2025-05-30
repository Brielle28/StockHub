using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Models
{
    public class StockHistory
    {
        public string Symbol { get; set; } = string.Empty;
        public List<StockDataPoint> DataPoints { get; set; } = new();
        public string Range { get; set; } = string.Empty;
        public DateTime RetrievedAt { get; set; }
    }
}
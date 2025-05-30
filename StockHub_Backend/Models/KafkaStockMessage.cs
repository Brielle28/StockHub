using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using System.ComponentModel.DataAnnotations;

namespace StockHub_Backend.Models
{
    public class KafkaStockMessage
    {
        public string Symbol { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal Change { get; set; }
        public decimal ChangePercent { get; set; }
        public DateTime Timestamp { get; set; }
        public long Volume { get; set; }
    }
}
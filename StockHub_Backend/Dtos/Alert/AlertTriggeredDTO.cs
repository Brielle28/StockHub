using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Dtos.Alert
{
    public class AlertTriggeredDTO
    {
        public Guid AlertId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string Symbol { get; set; } = string.Empty;
        public decimal CurrentPrice { get; set; }
        public decimal TargetPrice { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
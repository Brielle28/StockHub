using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockHub_Backend.Models;

namespace StockHub_Backend.Dtos.Alert
{
     public class AlertResponseDTO
    {
        public Guid Id { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public decimal TargetPrice { get; set; }
        public AlertCondition Condition { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? TriggeredAt { get; set; }
    }
}
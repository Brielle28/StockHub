using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using StockHub_Backend.Models;

namespace StockHub_Backend.Dtos.Alert
{
    public class CreateAlertRequestDTO
    {
        [Required]
        [StringLength(10, MinimumLength = 1)]
        public string Symbol { get; set; } = string.Empty;
        
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Target price must be greater than 0")]
        public decimal TargetPrice { get; set; }
        
        [Required]
        public AlertCondition Condition { get; set; }
    }
}
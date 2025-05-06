using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Dtos.Portfolio
{
    public class AddStockToPortfolioDto
    {
        [Required]
        public string Symbol { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Quantity { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal PurchasePrice { get; set; }
        
        public DateTime? PurchaseDate { get; set; } = DateTime.UtcNow;
    }
}
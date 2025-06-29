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
        [StringLength(10, MinimumLength = 1)]
        public string Symbol { get; set; }

        [Required]
        [Range(0.0001, double.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
        public decimal Quantity { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Purchase price must be greater than 0")]
        public decimal PurchasePrice { get; set; }

        public DateTime? PurchaseDate { get; set; }

        // Optional - for when current price is known at time of adding
        public decimal? CurrentPrice { get; set; }
        public decimal? PreviousClose { get; set; }
    }

}
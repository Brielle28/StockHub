using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Dtos.Portfolio
{
    public class UpdatePortfolioStockDto
    {
        [Range(0.0001, double.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
        public decimal? Quantity { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Purchase price must be greater than 0")]
        public decimal? PurchasePrice { get; set; }

        public DateTime? PurchaseDate { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Current price must be greater than 0")]
        public decimal? CurrentPrice { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Previous close must be greater than 0")]
        public decimal? PreviousClose { get; set; }
    }
}
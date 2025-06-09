using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Dtos.Portfolio
{
     public class StockPriceUpdateDto
    {
        [Required]
        public string Symbol { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal CurrentPrice { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Dtos.Portfolio
{
    public class BulkStockPriceUpdateDto
    {
        [Required]
        public Dictionary<string, decimal> StockPrices { get; set; } = new Dictionary<string, decimal>();
    }
}
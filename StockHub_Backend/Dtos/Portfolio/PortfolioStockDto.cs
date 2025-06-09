// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;

// namespace StockHub_Backend.Dtos.Portfolio
// {
//     public class PortfolioStockDto
//     {
//         public int Id { get; set; }
//         public string Symbol { get; set; }
//         public string CompanyName { get; set; }
//         public decimal Quantity { get; set; }
//         public decimal PurchasePrice { get; set; }
//         public DateTime PurchaseDate { get; set; }
//         public decimal CurrentPrice { get; set; }
//         public decimal CurrentValue { get; set; }
//         public decimal GainLoss { get; set; }
//         public decimal GainLossPercent { get; set; }
//     }
// }


using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StockHub_Backend.DTOs.Portfolio
{
    public class PortfolioStockDto
    {
        public int Id { get; set; }
        public string Symbol { get; set; }
        public decimal Quantity { get; set; }
        public decimal PurchasePrice { get; set; }
        public DateTime PurchaseDate { get; set; }
        public decimal CurrentPrice { get; set; }
        public decimal PreviousClose { get; set; }
        public decimal CurrentValue { get; set; }
        public decimal GainLoss { get; set; }
        public decimal GainLossPercent { get; set; }
    }

   
    

    

   

    
}

namespace StockHub_Backend.Dtos.Portfolio
{
    // Legacy DTOs for backward compatibility
    public class PortfolioRequestDto
    {
        [Required]
        public string Symbol { get; set; }
    }
}
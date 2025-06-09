using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockHub_Backend.DTOs.Portfolio;

namespace StockHub_Backend.Dtos.Portfolio
{

    // public class PortfolioDetailDto
    // {
    //     public int Id { get; set; }
    //     public string Name { get; set; }
    //     public string Description { get; set; }
    //     public decimal TotalValue { get; set; }
    //     public decimal TotalGainLoss { get; set; }
    //     public decimal TotalGainLossPercent { get; set; }
    //     public List<PortfolioStockDto> Stocks { get; set; }
    //     public DateTime CreatedAt { get; set; }
    //     public DateTime UpdatedAt { get; set; }
    // }

    public class PortfolioDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<PortfolioStockDto> Stocks { get; set; } = new List<PortfolioStockDto>();
        public decimal TotalValue { get; set; }
        public decimal TotalGainLoss { get; set; }
        public decimal TotalGainLossPercent { get; set; }
    }
}
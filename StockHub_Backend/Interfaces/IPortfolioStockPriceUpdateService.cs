using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Interfaces
{
    public interface IPortfolioStockPriceUpdateService
    {
        Task UpdateAllPortfolioStockPricesAsync();
    }
}
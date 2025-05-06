using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockHub_Backend.DTOs.Portfolio;

namespace StockHub_Backend.Interfaces
{
    public interface IEventPublisher
    {
         Task PublishStockPriceUpdate(StockPriceUpdateEvent eventData);
        Task PublishPortfolioChange(PortfolioChangeEvent eventData);
        Task PublishPortfolioStockChange(PortfolioStockChangeEvent eventData);
    }
}
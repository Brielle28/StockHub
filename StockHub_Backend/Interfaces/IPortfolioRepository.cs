// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;
// using StockHub_Backend.Dtos.Portfolio;
// using StockHub_Backend.DTOs.Portfolio;
// using StockHub_Backend.Models;

// namespace StockHub_Backend.Interfaces
// {
//     public interface IPortfolioRepository
//     {
//         // Portfolio CRUD operations
//         Task<List<PortfolioDto>> GetUserPortfolios(AppUser user);
//         Task<PortfolioDetailDto> GetPortfolioById(int portfolioId, string userId);
//         Task<Portfolio> CreatePortfolio(Portfolio portfolio);
//         Task<bool> UpdatePortfolio(Portfolio portfolio);
//         Task<bool> DeletePortfolio(int portfolioId, string userId);
//         Task<bool> UserOwnsPortfolio(int portfolioId, string userId);
        
//         // Portfolio stocks operations
//         Task<PortfolioStockDto> AddStockToPortfolio(int portfolioId, AddStockToPortfolioDto stockDto, AppUser user);
//         Task<bool> RemoveStockFromPortfolio(int portfolioId, int stockId, string userId);
//         Task<List<PortfolioStockDto>> GetPortfolioStocks(int portfolioId, string userId);
        
//         // Legacy method to maintain backward compatibility
//         Task<List<dynamic>> GetUserPortfolio(AppUser user);
//     }
// }

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StockHub_Backend.Dtos.Portfolio;
using StockHub_Backend.DTOs.Portfolio;
using StockHub_Backend.Models;

namespace StockHub_Backend.Interfaces
{
    public interface IPortfolioRepository
    {
        // Portfolio CRUD operations
        Task<List<PortfolioDto>> GetUserPortfolios(AppUser user);
        Task<PortfolioDetailDto> GetPortfolioById(int portfolioId, string userId);
        Task<Portfolio> CreatePortfolio(Portfolio portfolio);
        Task<bool> UpdatePortfolio(Portfolio portfolio);
        Task<bool> DeletePortfolio(int portfolioId, string userId);
        Task<bool> UserOwnsPortfolio(int portfolioId, string userId);
       
        // Portfolio stocks operations - no dependency on Stock repository
        Task<PortfolioStockDto> AddStockToPortfolio(int portfolioId, AddStockToPortfolioDto stockDto, AppUser user);
        Task<bool> UpdatePortfolioStock(int portfolioId, int portfolioStockId, UpdatePortfolioStockDto updateDto, string userId);
        Task<bool> RemoveStockFromPortfolio(int portfolioId, int portfolioStockId, string userId);
        Task<List<PortfolioStockDto>> GetPortfolioStocks(int portfolioId, string userId);
        
        // Stock price update operations (optional - for external price updates)
        Task<bool> UpdateStockPrice(int portfolioStockId, decimal currentPrice);
        Task<bool> UpdateAllStockPrices(Dictionary<string, decimal> symbolPrices);
       
        // Legacy method to maintain backward compatibility
        Task<List<dynamic>> GetUserPortfolio(AppUser user);
    }
}
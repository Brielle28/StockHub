using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StockHub_Backend.Data;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Models;

namespace StockHub_Backend.Repository
{
    public class PortfolioRepository : IPortfolioRepository
    {
        private readonly ApplicationDBContext _applicationDBContext;
        public PortfolioRepository(ApplicationDBContext applicationDBContext)
        {
            _applicationDBContext = applicationDBContext;
        }
        public async Task<List<Stock>> GetUserPortfolio(AppUser user)
        {
            return await _applicationDBContext.portfolios.Where(u => u.AppUserId == user.Id)
            .Select(stock => new Stock
            {
              Id = stock.StockId,
              CompanyName = stock.Stock.CompanyName,
              Symbol = stock.Stock.Symbol,
              Purchase = stock.Stock.Purchase,
              LastDiv = stock.Stock.LastDiv,
              Industry = stock.Stock.Industry,
              MarketCap = stock.Stock.MarketCap

            }).ToListAsync();
        }
    }
}
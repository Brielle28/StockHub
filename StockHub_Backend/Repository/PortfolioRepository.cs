// using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StockHub_Backend.Data;
using StockHub_Backend.Dtos.Portfolio;
using StockHub_Backend.DTOs;
using StockHub_Backend.DTOs.Portfolio;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Models;
using StockHub_Backend.Services;

namespace StockHub_Backend.Repositories
{
    public class PortfolioRepository : IPortfolioRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly ICacheService _cacheService;
        private readonly IEventPublisher _eventPublisher;
        private readonly IStockRepository _stockRepository;

        public PortfolioRepository(
            ApplicationDBContext context, 
            ICacheService cacheService, 
            IEventPublisher eventPublisher,
            IStockRepository stockRepository)
        {
            _context = context;
            _cacheService = cacheService;
            _eventPublisher = eventPublisher;
            _stockRepository = stockRepository;
        }

        public async Task<List<PortfolioDto>> GetUserPortfolios(AppUser user)
        {
            // Try to get from cache first
            string cacheKey = $"portfolios:{user.Id}";
            var cachedPortfolios = await _cacheService.GetAsync<List<PortfolioDto>>(cacheKey);
            
            if (cachedPortfolios != null)
            {
                return cachedPortfolios;
            }

            // If not in cache, fetch from database
            var portfolios = await _context.Portfolios
                .Where(p => p.AppUserId == user.Id)
                .Include(p => p.PortfolioStocks)
                .ThenInclude(ps => ps.Stock)
                .ToListAsync();

            var result = portfolios.Select(p => new PortfolioDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                StockCount = p.PortfolioStocks.Count,
                TotalValue = p.PortfolioStocks.Sum(ps => ps.Quantity * ps.Stock.CurrentPrice),
                DailyChange = p.PortfolioStocks.Sum(ps => ps.Quantity * (ps.Stock.CurrentPrice - ps.Stock.PreviousClose)),
                DailyChangePercent = p.PortfolioStocks.Sum(ps => ps.Quantity * ps.Stock.PreviousClose) > 0 
                    ? p.PortfolioStocks.Sum(ps => ps.Quantity * (ps.Stock.CurrentPrice - ps.Stock.PreviousClose)) / 
                      p.PortfolioStocks.Sum(ps => ps.Quantity * ps.Stock.PreviousClose) * 100 
                    : 0
            }).ToList();

            // Cache the result
            await _cacheService.SetAsync(cacheKey, result, 5); // Cache for 5 minutes

            return result;
        }

        public async Task<PortfolioDetailDto> GetPortfolioById(int portfolioId, string userId)
        {
            // Try to get from cache first
            string cacheKey = $"portfolio:{portfolioId}";
            var cachedPortfolio = await _cacheService.GetAsync<PortfolioDetailDto>(cacheKey);
            
            if (cachedPortfolio != null)
            {
                return cachedPortfolio;
            }

            // If not in cache, fetch from database
            var portfolio = await _context.Portfolios
                .Include(p => p.PortfolioStocks)
                .ThenInclude(ps => ps.Stock)
                .FirstOrDefaultAsync(p => p.Id == portfolioId && p.AppUserId == userId);

            if (portfolio == null)
            {
                return null;
            }

            var stocks = portfolio.PortfolioStocks.Select(ps => new PortfolioStockDto
            {
                Id = ps.Id,
                Symbol = ps.Stock.Symbol,
                CompanyName = ps.Stock.CompanyName,
                Quantity = ps.Quantity,
                PurchasePrice = ps.PurchasePrice,
                PurchaseDate = ps.PurchaseDate,
                CurrentPrice = ps.Stock.CurrentPrice,
                CurrentValue = ps.Quantity * ps.Stock.CurrentPrice,
                GainLoss = ps.Quantity * (ps.Stock.CurrentPrice - ps.PurchasePrice),
                GainLossPercent = ps.PurchasePrice > 0 ? (ps.Stock.CurrentPrice - ps.PurchasePrice) / ps.PurchasePrice * 100 : 0
            }).ToList();

            var result = new PortfolioDetailDto
            {
                Id = portfolio.Id,
                Name = portfolio.Name,
                Description = portfolio.Description,
                CreatedAt = portfolio.CreatedAt,
                UpdatedAt = portfolio.UpdatedAt,
                Stocks = stocks,
                TotalValue = stocks.Sum(s => s.CurrentValue),
                TotalGainLoss = stocks.Sum(s => s.GainLoss),
                TotalGainLossPercent = stocks.Sum(s => s.PurchasePrice * s.Quantity) > 0 
                    ? stocks.Sum(s => s.GainLoss) / stocks.Sum(s => s.PurchasePrice * s.Quantity) * 100 
                    : 0
            };

            // Cache the result
            await _cacheService.SetAsync(cacheKey, result, 5); // Cache for 5 minutes

            return result;
        }

        public async Task<Portfolio> CreatePortfolio(Portfolio portfolio)
        {
            await _context.Portfolios.AddAsync(portfolio);
            await _context.SaveChangesAsync();

            // Invalidate cache
            await _cacheService.RemoveAsync($"portfolios:{portfolio.AppUserId}");

            // Publish event
            await _eventPublisher.PublishPortfolioChange(new PortfolioChangeEvent
            {
                UserId = portfolio.AppUserId,
                PortfolioId = portfolio.Id,
                ChangeType = "Created",
                Timestamp = DateTime.UtcNow
            });

            return portfolio;
        }

        public async Task<bool> UpdatePortfolio(Portfolio portfolio)
        {
            portfolio.UpdatedAt = DateTime.UtcNow;
            _context.Portfolios.Update(portfolio);
            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                // Invalidate caches
                await _cacheService.RemoveAsync($"portfolios:{portfolio.AppUserId}");
                await _cacheService.RemoveAsync($"portfolio:{portfolio.Id}");

                // Publish event
                await _eventPublisher.PublishPortfolioChange(new PortfolioChangeEvent
                {
                    UserId = portfolio.AppUserId,
                    PortfolioId = portfolio.Id,
                    ChangeType = "Updated",
                    Timestamp = DateTime.UtcNow
                });
            }

            return result;
        }

        public async Task<bool> DeletePortfolio(int portfolioId, string userId)
        {
            var portfolio = await _context.Portfolios
                .Include(p => p.PortfolioStocks)
                .FirstOrDefaultAsync(p => p.Id == portfolioId && p.AppUserId == userId);

            if (portfolio == null)
            {
                return false;
            }

            // First remove all portfolio stocks
            _context.PortfolioStocks.RemoveRange(portfolio.PortfolioStocks);
            
            // Then remove the portfolio
            _context.Portfolios.Remove(portfolio);
            
            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                // Invalidate caches
                await _cacheService.RemoveAsync($"portfolios:{userId}");
                await _cacheService.RemoveAsync($"portfolio:{portfolioId}");

                // Publish event
                await _eventPublisher.PublishPortfolioChange(new PortfolioChangeEvent
                {
                    UserId = userId,
                    PortfolioId = portfolioId,
                    ChangeType = "Deleted",
                    Timestamp = DateTime.UtcNow
                });
            }

            return result;
        }

        public async Task<bool> UserOwnsPortfolio(int portfolioId, string userId)
        {
            return await _context.Portfolios.AnyAsync(p => p.Id == portfolioId && p.AppUserId == userId);
        }

        public async Task<PortfolioStockDto> AddStockToPortfolio(int portfolioId, AddStockToPortfolioDto stockDto, AppUser user)
        {
            var portfolio = await _context.Portfolios
                .FirstOrDefaultAsync(p => p.Id == portfolioId && p.AppUserId == user.Id);

            if (portfolio == null)
            {
                return null;
            }

            var stock = await _stockRepository.GetBySymbolAsync(stockDto.Symbol);
            if (stock == null)
            {
                return null;
            }

            var portfolioStock = new PortfolioStock
            {
                PortfolioId = portfolioId,
                StockId = stock.Id,
                Quantity = stockDto.Quantity,
                PurchasePrice = stockDto.PurchasePrice,
                PurchaseDate = stockDto.PurchaseDate ?? DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            await _context.PortfolioStocks.AddAsync(portfolioStock);
            await _context.SaveChangesAsync();

            // Invalidate caches
            await _cacheService.RemoveAsync($"portfolios:{user.Id}");
            await _cacheService.RemoveAsync($"portfolio:{portfolioId}");

            // Publish event
            await _eventPublisher.PublishPortfolioStockChange(new PortfolioStockChangeEvent
            {
                UserId = user.Id,
                PortfolioId = portfolioId,
                StockId = stock.Id,
                Symbol = stock.Symbol,
                ChangeType = "Added",
                Timestamp = DateTime.UtcNow
            });

            // Return the created portfolio stock with calculated values
            return new PortfolioStockDto
            {
                Id = portfolioStock.Id,
                Symbol = stock.Symbol,
                CompanyName = stock.CompanyName,
                Quantity = portfolioStock.Quantity,
                PurchasePrice = portfolioStock.PurchasePrice,
                PurchaseDate = portfolioStock.PurchaseDate,
                CurrentPrice = stock.CurrentPrice,
                CurrentValue = portfolioStock.Quantity * stock.CurrentPrice,
                GainLoss = portfolioStock.Quantity * (stock.CurrentPrice - portfolioStock.PurchasePrice),
                GainLossPercent = portfolioStock.PurchasePrice > 0 
                    ? (stock.CurrentPrice - portfolioStock.PurchasePrice) / portfolioStock.PurchasePrice * 100 
                    : 0
            };
        }

        public async Task<bool> RemoveStockFromPortfolio(int portfolioId, int stockId, string userId)
        {
            var portfolioStock = await _context.PortfolioStocks
                .Include(ps => ps.Portfolio)
                .Include(ps => ps.Stock)
                .FirstOrDefaultAsync(ps => ps.Id == stockId && ps.Portfolio.AppUserId == userId && ps.PortfolioId == portfolioId);

            if (portfolioStock == null)
            {
                return false;
            }

            string symbol = portfolioStock.Stock.Symbol;
            int stockIdValue = portfolioStock.StockId;

            _context.PortfolioStocks.Remove(portfolioStock);
            var result = await _context.SaveChangesAsync() > 0;

            if (result)
            {
                // Invalidate caches
                await _cacheService.RemoveAsync($"portfolios:{userId}");
                await _cacheService.RemoveAsync($"portfolio:{portfolioId}");

                // Publish event
                await _eventPublisher.PublishPortfolioStockChange(new PortfolioStockChangeEvent
                {
                    UserId = userId,
                    PortfolioId = portfolioId,
                    StockId = stockIdValue,
                    Symbol = symbol,
                    ChangeType = "Removed",
                    Timestamp = DateTime.UtcNow
                });
            }

            return result;
        }

        public async Task<List<PortfolioStockDto>> GetPortfolioStocks(int portfolioId, string userId)
        {
            var stocks = await _context.PortfolioStocks
                .Include(ps => ps.Stock)
                .Include(ps => ps.Portfolio)
                .Where(ps => ps.PortfolioId == portfolioId && ps.Portfolio.AppUserId == userId)
                .Select(ps => new PortfolioStockDto
                {
                    Id = ps.Id,
                    Symbol = ps.Stock.Symbol,
                    CompanyName = ps.Stock.CompanyName,
                    Quantity = ps.Quantity,
                    PurchasePrice = ps.PurchasePrice,
                    PurchaseDate = ps.PurchaseDate,
                    CurrentPrice = ps.Stock.CurrentPrice,
                    CurrentValue = ps.Quantity * ps.Stock.CurrentPrice,
                    GainLoss = ps.Quantity * (ps.Stock.CurrentPrice - ps.PurchasePrice),
                    GainLossPercent = ps.PurchasePrice > 0 
                        ? (ps.Stock.CurrentPrice - ps.PurchasePrice) / ps.PurchasePrice * 100 
                        : 0
                })
                .ToListAsync();

            return stocks;
        }

        // Legacy method to maintain backward compatibility
        public async Task<List<dynamic>> GetUserPortfolio(AppUser user)
        {
            // Legacy method implementation - map from new structure to old
            var portfolios = await GetUserPortfolios(user);
            
            // Create a flattened list of stocks from all portfolios
            var result = new List<dynamic>();
            
            foreach (var portfolio in portfolios)
            {
                var details = await GetPortfolioById(portfolio.Id, user.Id);
                foreach (var stock in details.Stocks)
                {
                    dynamic stockItem = new System.Dynamic.ExpandoObject();
                    stockItem.Symbol = stock.Symbol;
                    stockItem.Quantity = stock.Quantity;
                    stockItem.PurchasePrice = stock.PurchasePrice;
                    stockItem.CurrentPrice = stock.CurrentPrice;
                    stockItem.Value = stock.CurrentValue;
                    
                    result.Add(stockItem);
                }
            }
            
            return result;
        }
    }
}
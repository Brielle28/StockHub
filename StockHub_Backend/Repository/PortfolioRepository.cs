using System;
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
        private readonly IPortfolioCacheService _cacheService;
        private readonly IEventPublisher _eventPublisher;
        private readonly ILogger<PortfolioRepository> _logger;

        public PortfolioRepository(
            ApplicationDBContext context,
            IPortfolioCacheService cacheService,
            IEventPublisher eventPublisher, ILogger<PortfolioRepository> logger)
        {
            _context = context;
            _cacheService = cacheService;
            _eventPublisher = eventPublisher;
            _logger = logger;
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
                .ToListAsync();

            var result = portfolios.Select(p => CalculatePortfolioSummary(p)).ToList();

            // Cache the result
            await _cacheService.SetAsync(cacheKey, result, 5); // Cache for 5 minutes

            return result;
        }

        private PortfolioDto CalculatePortfolioSummary(Portfolio portfolio)
        {
            if (portfolio.PortfolioStocks == null || !portfolio.PortfolioStocks.Any())
            {
                return new PortfolioDto
                {
                    Id = portfolio.Id,
                    Name = portfolio.Name,
                    Description = portfolio.Description,
                    CreatedAt = portfolio.CreatedAt,
                    UpdatedAt = portfolio.UpdatedAt,
                    StockCount = 0,
                    TotalValue = 0,
                    DailyChange = 0,
                    DailyChangePercent = 0
                };
            }

            var stocks = portfolio.PortfolioStocks.Where(ps => ps.Quantity > 0).ToList();

            var totalCurrentValue = stocks.Sum(ps => (decimal)(ps.Quantity * ps.CurrentPrice));
            var totalPreviousValue = stocks.Sum(ps => (decimal)(ps.Quantity * (ps.PreviousClose ?? ps.CurrentPrice)));
            var dailyChange = totalCurrentValue - totalPreviousValue;
            var dailyChangePercent = totalPreviousValue > 0 ? (dailyChange / totalPreviousValue) * 100 : 0;

            return new PortfolioDto
            {
                Id = portfolio.Id,
                Name = portfolio.Name,
                Description = portfolio.Description,
                CreatedAt = portfolio.CreatedAt,
                UpdatedAt = portfolio.UpdatedAt,
                StockCount = stocks.Count,
                TotalValue = totalCurrentValue,
                DailyChange = dailyChange,
                DailyChangePercent = dailyChangePercent
            };
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
                .FirstOrDefaultAsync(p => p.Id == portfolioId && p.AppUserId == userId);

            if (portfolio == null)
            {
                return null;
            }

            var stocks = portfolio.PortfolioStocks
                .Where(ps => ps.Quantity > 0)
                .Select(ps => CreatePortfolioStockDto(ps))
                .ToList();

            var totalPurchaseValue = stocks.Sum(s => s.PurchasePrice * s.Quantity);

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
                TotalGainLossPercent = totalPurchaseValue > 0
                    ? stocks.Sum(s => s.GainLoss) / totalPurchaseValue * 100
                    : 0
            };

            // Cache the result
            await _cacheService.SetAsync(cacheKey, result, 5); // Cache for 5 minutes

            return result;
        }

        private PortfolioStockDto CreatePortfolioStockDto(PortfolioStock ps)
        {
            var currentPrice = (decimal)ps.CurrentPrice;
            var previousClose = (decimal)(ps.PreviousClose ?? ps.CurrentPrice);
            var currentValue = ps.Quantity * currentPrice;
            var totalCost = ps.Quantity * ps.PurchasePrice;
            var gainLoss = currentValue - totalCost;
            var gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

            return new PortfolioStockDto
            {
                Id = ps.Id,
                Symbol = ps.Symbol,
                // CompanyName = ps.CompanyName,
                Quantity = ps.Quantity,
                PurchasePrice = ps.PurchasePrice,
                PurchaseDate = ps.PurchaseDate,
                CurrentPrice = currentPrice,
                PreviousClose = previousClose,
                CurrentValue = currentValue,
                GainLoss = gainLoss,
                GainLossPercent = gainLossPercent
            };
        }

        public async Task<Portfolio> CreatePortfolio(Portfolio portfolio)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
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

                await transaction.CommitAsync();
                return portfolio;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> UpdatePortfolio(Portfolio portfolio)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
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

                await transaction.CommitAsync();
                return result;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> DeletePortfolio(int portfolioId, string userId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var portfolio = await _context.Portfolios
                    .Include(p => p.PortfolioStocks)
                    .FirstOrDefaultAsync(p => p.Id == portfolioId && p.AppUserId == userId);

                if (portfolio == null)
                {
                    await transaction.RollbackAsync();
                    return false;
                }

                // First remove all portfolio stocks
                if (portfolio.PortfolioStocks.Any())
                {
                    _context.PortfolioStocks.RemoveRange(portfolio.PortfolioStocks);
                }

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

                await transaction.CommitAsync();
                return result;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> UserOwnsPortfolio(int portfolioId, string userId)
        {
            return await _context.Portfolios.AnyAsync(p => p.Id == portfolioId && p.AppUserId == userId);
        }

        public async Task<PortfolioStockDto> AddStockToPortfolio(int portfolioId, AddStockToPortfolioDto stockDto, AppUser user)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var portfolio = await _context.Portfolios
                    .FirstOrDefaultAsync(p => p.Id == portfolioId && p.AppUserId == user.Id);

                if (portfolio == null)
                {
                    await transaction.RollbackAsync();
                    return null;
                }

                // Validate input data
                if (stockDto.Quantity <= 0 || stockDto.PurchasePrice <= 0)
                {
                    await transaction.RollbackAsync();
                    return null;
                }

                // Check if stock already exists in portfolio
                var existingStock = await _context.PortfolioStocks
                    .FirstOrDefaultAsync(ps => ps.PortfolioId == portfolioId && ps.Symbol == stockDto.Symbol);

                if (existingStock != null)
                {
                    // Update existing stock instead of creating new one
                    var averagePrice = ((existingStock.Quantity * existingStock.PurchasePrice) +
                                      (stockDto.Quantity * stockDto.PurchasePrice)) /
                                      (existingStock.Quantity + stockDto.Quantity);

                    existingStock.Quantity += stockDto.Quantity;
                    existingStock.PurchasePrice = averagePrice;
                    existingStock.CurrentPrice = stockDto.CurrentPrice ?? stockDto.PurchasePrice;
                    if (stockDto.PreviousClose.HasValue)
                        existingStock.PreviousClose = stockDto.PreviousClose.Value;

                    _context.PortfolioStocks.Update(existingStock);

                    await _context.SaveChangesAsync();
                    // try
                    // {
                    //     await _context.SaveChangesAsync();
                    // }
                    // catch (Exception ex)
                    // {
                    //     // Log the full exception chain
                    //     _logger.LogError(ex, "Error saving portfolio changes");

                    //     // Re-throw to maintain the same behavior
                    //     throw;
                    // }

                    await InvalidatePortfolioCaches(user.Id, portfolioId);
                    await PublishStockChangeEvent(user.Id, portfolioId, stockDto.Symbol, "Updated");

                    await transaction.CommitAsync();
                    return CreatePortfolioStockDto(existingStock);
                }

                // Create new portfolio stock
                var portfolioStock = new PortfolioStock
                {
                    PortfolioId = portfolioId,
                    Symbol = stockDto.Symbol?.ToUpper() ?? throw new ArgumentException("Symbol is required"),
                    Quantity = stockDto.Quantity,
                    PurchasePrice = stockDto.PurchasePrice,
                    PurchaseDate = stockDto.PurchaseDate ?? DateTime.UtcNow,
                    CurrentPrice = stockDto.CurrentPrice ?? stockDto.PurchasePrice,
                    PreviousClose = stockDto.PreviousClose,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.PortfolioStocks.AddAsync(portfolioStock);
                await _context.SaveChangesAsync();

                await InvalidatePortfolioCaches(user.Id, portfolioId);
                await PublishStockChangeEvent(user.Id, portfolioId, portfolioStock.Symbol, "Added");

                await transaction.CommitAsync();
                return CreatePortfolioStockDto(portfolioStock);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> UpdatePortfolioStock(int portfolioId, int portfolioStockId, UpdatePortfolioStockDto updateDto, string userId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var portfolioStock = await _context.PortfolioStocks
                    .Include(ps => ps.Portfolio)
                    .FirstOrDefaultAsync(ps => ps.Id == portfolioStockId &&
                                             ps.PortfolioId == portfolioId &&
                                             ps.Portfolio.AppUserId == userId);

                if (portfolioStock == null)
                {
                    await transaction.RollbackAsync();
                    return false;
                }

                // Update the portfolio stock properties with validation
                if (updateDto.Quantity.HasValue)
                {
                    if (updateDto.Quantity.Value <= 0)
                    {
                        await transaction.RollbackAsync();
                        return false;
                    }
                    portfolioStock.Quantity = updateDto.Quantity.Value;
                }

                if (updateDto.PurchasePrice.HasValue)
                {
                    if (updateDto.PurchasePrice.Value <= 0)
                    {
                        await transaction.RollbackAsync();
                        return false;
                    }
                    portfolioStock.PurchasePrice = updateDto.PurchasePrice.Value;
                }

                if (updateDto.PurchaseDate.HasValue)
                    portfolioStock.PurchaseDate = updateDto.PurchaseDate.Value;

                if (updateDto.CurrentPrice.HasValue)
                {
                    if (updateDto.CurrentPrice.Value <= 0)
                    {
                        await transaction.RollbackAsync();
                        return false;
                    }
                    portfolioStock.CurrentPrice = updateDto.CurrentPrice.Value;
                }

                if (updateDto.PreviousClose.HasValue)
                    portfolioStock.PreviousClose = updateDto.PreviousClose.Value;

                _context.PortfolioStocks.Update(portfolioStock);
                var result = await _context.SaveChangesAsync() > 0;

                if (result)
                {
                    await InvalidatePortfolioCaches(userId, portfolioId);
                    await PublishStockChangeEvent(userId, portfolioId, portfolioStock.Symbol, "Updated");
                }

                await transaction.CommitAsync();
                return result;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> RemoveStockFromPortfolio(int portfolioId, int portfolioStockId, string userId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var portfolioStock = await _context.PortfolioStocks
                    .Include(ps => ps.Portfolio)
                    .FirstOrDefaultAsync(ps => ps.Id == portfolioStockId &&
                                             ps.PortfolioId == portfolioId &&
                                             ps.Portfolio.AppUserId == userId);

                if (portfolioStock == null)
                {
                    await transaction.RollbackAsync();
                    return false;
                }

                string symbol = portfolioStock.Symbol;

                _context.PortfolioStocks.Remove(portfolioStock);
                var result = await _context.SaveChangesAsync() > 0;

                if (result)
                {
                    await InvalidatePortfolioCaches(userId, portfolioId);
                    await PublishStockChangeEvent(userId, portfolioId, symbol, "Removed");
                }

                await transaction.CommitAsync();
                return result;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<List<PortfolioStockDto>> GetPortfolioStocks(int portfolioId, string userId)
        {
            var stocks = await _context.PortfolioStocks
                .Include(ps => ps.Portfolio)
                .Where(ps => ps.PortfolioId == portfolioId &&
                           ps.Portfolio.AppUserId == userId &&
                           ps.Quantity > 0)
                .ToListAsync();

            return stocks.Select(CreatePortfolioStockDto).ToList();
        }

        public async Task<bool> UpdateStockPrice(int portfolioStockId, decimal currentPrice)
        {
            if (currentPrice <= 0)
                return false;

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var portfolioStock = await _context.PortfolioStocks
                    .Include(ps => ps.Portfolio)
                    .FirstOrDefaultAsync(ps => ps.Id == portfolioStockId);

                if (portfolioStock == null)
                {
                    await transaction.RollbackAsync();
                    return false;
                }

                portfolioStock.PreviousClose = portfolioStock.CurrentPrice;
                portfolioStock.CurrentPrice = (decimal?)(double)currentPrice;

                _context.PortfolioStocks.Update(portfolioStock);
                var result = await _context.SaveChangesAsync() > 0;

                if (result)
                {
                    await InvalidatePortfolioCaches(portfolioStock.Portfolio.AppUserId, portfolioStock.PortfolioId);
                }

                await transaction.CommitAsync();
                return result;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> UpdateAllStockPrices(Dictionary<string, decimal> symbolPrices)
        {
            if (symbolPrices == null || !symbolPrices.Any())
                return false;

            // Validate all prices are positive
            if (symbolPrices.Values.Any(price => price <= 0))
                return false;

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var portfolioStocks = await _context.PortfolioStocks
                    .Include(ps => ps.Portfolio)
                    .Where(ps => symbolPrices.Keys.Contains(ps.Symbol))
                    .ToListAsync();

                if (!portfolioStocks.Any())
                {
                    await transaction.RollbackAsync();
                    return false;
                }

                var affectedUsers = new HashSet<string>();
                var affectedPortfolios = new HashSet<int>();

                foreach (var portfolioStock in portfolioStocks)
                {
                    if (symbolPrices.TryGetValue(portfolioStock.Symbol, out decimal newPrice))
                    {
                        portfolioStock.PreviousClose = portfolioStock.CurrentPrice;
                        portfolioStock.CurrentPrice = (decimal?)(double)newPrice;

                        affectedUsers.Add(portfolioStock.Portfolio.AppUserId);
                        affectedPortfolios.Add(portfolioStock.PortfolioId);
                    }
                }

                _context.PortfolioStocks.UpdateRange(portfolioStocks);
                var result = await _context.SaveChangesAsync() > 0;

                if (result)
                {
                    // Invalidate caches for affected users and portfolios
                    var tasks = new List<Task>();
                    foreach (var userId in affectedUsers)
                    {
                        tasks.Add(_cacheService.RemoveAsync($"portfolios:{userId}"));
                    }
                    foreach (var portfolioId in affectedPortfolios)
                    {
                        tasks.Add(_cacheService.RemoveAsync($"portfolio:{portfolioId}"));
                    }
                    await Task.WhenAll(tasks);
                }

                await transaction.CommitAsync();
                return result;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // Helper methods
        private async Task InvalidatePortfolioCaches(string userId, int portfolioId)
        {
            await Task.WhenAll(
                _cacheService.RemoveAsync($"portfolios:{userId}"),
                _cacheService.RemoveAsync($"portfolio:{portfolioId}")
            );
        }

        private async Task PublishStockChangeEvent(string userId, int portfolioId, string symbol, string changeType)
        {
            await _eventPublisher.PublishPortfolioStockChange(new PortfolioStockChangeEvent
            {
                UserId = userId,
                PortfolioId = portfolioId,
                Symbol = symbol,
                ChangeType = changeType,
                Timestamp = DateTime.UtcNow
            });
        }

        // Legacy method - improved to reduce database calls
        public async Task<List<dynamic>> GetUserPortfolio(AppUser user)
        {
            var portfolios = await _context.Portfolios
                .Where(p => p.AppUserId == user.Id)
                .Include(p => p.PortfolioStocks)
                .ToListAsync();

            var result = new List<dynamic>();

            foreach (var portfolio in portfolios)
            {
                foreach (var stock in portfolio.PortfolioStocks.Where(ps => ps.Quantity > 0))
                {
                    dynamic stockItem = new System.Dynamic.ExpandoObject();
                    stockItem.Symbol = stock.Symbol;
                    stockItem.Quantity = stock.Quantity;
                    stockItem.PurchasePrice = stock.PurchasePrice;
                    stockItem.CurrentPrice = (decimal)stock.CurrentPrice;
                    stockItem.Value = (decimal)(stock.Quantity * stock.CurrentPrice);

                    result.Add(stockItem);
                }
            }

            return result;
        }
    }
}
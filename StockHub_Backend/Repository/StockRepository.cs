// using Microsoft.EntityFrameworkCore;
// using StockHub_Backend.Data;
// using StockHub_Backend.Dtos.Stock;
// using StockHub_Backend.DTOs.Portfolio;
// using StockHub_Backend.Interfaces;
// using StockHub_Backend.Models;
// using StockHub_Backend.Services;

// namespace StockHub_Backend.Repository
// {
//     public class StockRepository : IStockRepository
//     {
//         private readonly ApplicationDBContext _context;
//         // private readonly ApplicationDbContext _context;
//         private readonly ICacheService _cacheService;
//         private readonly IEventPublisher _eventPublisher;
//         private readonly ILogger<StockRepository> _logger;
//         public StockRepository(ApplicationDBContext context, ICacheService cacheService,
//             IEventPublisher eventPublisher,
//             ILogger<StockRepository> logger)
//         {
//             _context = context;
//             _cacheService = cacheService;
//             _eventPublisher = eventPublisher;
//             _logger = logger;
//         }

//         public async Task<List<Stock>> GetAllAsync()
//         {
//             return await _context.Stock.Include(c => c.Comments).ToListAsync();
//         }

//         public async Task<Stock?> GetByIdAsync(int id)
//         {
//             return await _context.Stock.Include(c => c.Comments).FirstOrDefaultAsync(x => x.Id == id);
//         }

//         public async Task<Stock> CreateAsync(Stock stockModel)
//         {
//             await _context.Stock.AddAsync(stockModel);
//             await _context.SaveChangesAsync();
//             return stockModel;
//         }

//         public async Task<bool> UpdateAsync(int id, StockUpdateDto updateStock)
//         {
//             var stockModel = await _context.Stock.FirstOrDefaultAsync(x => x.Id == id);
//             if (stockModel == null)
//             {
//                 return false;
//             }

//             stockModel.Symbol = updateStock.Symbol;
//             stockModel.CompanyName = updateStock.CompanyName;
//             stockModel.Purchase = updateStock.Purchase;
//             stockModel.LastDiv = updateStock.LastDiv;
//             stockModel.Industry = updateStock.Industry;
//             stockModel.MarketCap = updateStock.MarketCap;

//             await _context.SaveChangesAsync();
//             return true;
//         }

//         public async Task<bool> DeleteAsync(int id)
//         {
//             var stockModel = await _context.Stock.FirstOrDefaultAsync(x => x.Id == id);
//             if (stockModel == null)
//             {
//                 return false;
//             }

//             _context.Stock.Remove(stockModel);
//             await _context.SaveChangesAsync();
//             return true;
//         }

//         public Task<bool> stockExist(int Id)
//         {
//             return _context.Stock.AnyAsync(s => s.Id == Id);
//         }

//         public async Task<Stock?> GetBySymbolAsync(string symbol)
//         {
//             return await _context.Stock.FirstOrDefaultAsync(s => s.Symbol == symbol);
//         }

//             public async Task<Stock> GetByIdAsync(int id)
//         {
//             // Try to get from cache first
//             string cacheKey = $"stock:{id}";
//             var cachedStock = await _cacheService.GetAsync<Stock>(cacheKey);

//             if (cachedStock != null)
//             {
//                 return cachedStock;
//             }

//             // If not in cache, fetch from database
//             var stock = await _context.Stocks.FindAsync(id);

//             if (stock != null)
//             {
//                 // Cache the result
//                 await _cacheService.SetAsync(cacheKey, stock, 5); // Cache for 5 minutes
//             }

//             return stock;
//         }

//         public async Task<Stock> GetBySymbolAsync(string symbol)
//         {
//             // Normalize symbol
//             symbol = symbol.ToUpper();

//             // Try to get from cache first
//             string cacheKey = $"stock:symbol:{symbol}";
//             var cachedStock = await _cacheService.GetAsync<Stock>(cacheKey);

//             if (cachedStock != null)
//             {
//                 return cachedStock;
//             }

//             // If not in cache, fetch from database
//             var stock = await _context.Stocks
//                 .FirstOrDefaultAsync(s => s.Symbol.ToUpper() == symbol);

//             if (stock != null)
//             {
//                 // Cache the result
//                 await _cacheService.SetAsync(cacheKey, stock, 5); // Cache for 5 minutes
//             }

//             return stock;
//         }

//         public async Task<List<Stock>> SearchStocksAsync(string query)
//         {
//             if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
//             {
//                 return new List<Stock>();
//             }

//             query = query.ToUpper();

//             // Try to get from cache first
//             string cacheKey = $"stock:search:{query}";
//             var cachedResults = await _cacheService.GetAsync<List<Stock>>(cacheKey);

//             if (cachedResults != null)
//             {
//                 return cachedResults;
//             }

//             // If not in cache, fetch from database
//             var stocks = await _context.Stock
//                 .Where(s => s.Symbol.ToUpper().Contains(query) || s.Name.ToUpper().Contains(query))
//                 .OrderBy(s => s.Symbol)
//                 .Take(10)
//                 .ToListAsync();

//             // Cache the result
//             await _cacheService.SetAsync(cacheKey, stocks, 5); // Cache for 5 minutes

//             return stocks;
//         }

//         public async Task<Stock> UpdateStockPriceAsync(string symbol, decimal currentPrice, decimal previousClose)
//         {
//             symbol = symbol.ToUpper();

//             var stock = await _context.Stock
//                 .FirstOrDefaultAsync(s => s.Symbol.ToUpper() == symbol);

//             if (stock == null)
//             {
//                 _logger.LogWarning("Attempted to update price for non-existent stock: {Symbol}", symbol);
//                 return null;
//             }

//             // Update the stock price
//             stock.CurrentPrice = currentPrice;
//             stock.PreviousClose = previousClose;
//             stock.LastUpdated = DateTime.UtcNow;

//             await _context.SaveChangesAsync();

//             // Invalidate cache for this stock
//             await _cacheService.RemoveAsync($"stock:{stock.Id}");
//             await _cacheService.RemoveAsync($"stock:symbol:{symbol}");

//             // Also invalidate any portfolio caches that might contain this stock
//             // This is a simplified approach - in a production environment, you might 
//             // want to use a more targeted approach to invalidate only affected portfolios
//             var portfolioStocks = await _context.PortfolioStocks
//                 .Where(ps => ps.StockId == stock.Id)
//                 .Include(ps => ps.Portfolio)
//                 .ToListAsync();

//             foreach (var portfolioStock in portfolioStocks)
//             {
//                 await _cacheService.RemoveAsync($"portfolio:{portfolioStock.PortfolioId}");
//                 await _cacheService.RemoveAsync($"portfolios:{portfolioStock.Portfolio.AppUserId}");
//             }

//             // Publish the stock price update event to Kafka
//             await _eventPublisher.PublishStockPriceUpdate(new StockPriceUpdateEvent
//             {
//                 Symbol = symbol,
//                 Price = currentPrice,
//                 PreviousClose = previousClose,
//                 Timestamp = DateTime.UtcNow
//             });

//             return stock;
//         }

//         public async Task<bool> StockExists(string symbol)
//         {
//             symbol = symbol.ToUpper();

//             // Check cache first
//             string cacheKey = $"stock:exists:{symbol}";
//             var exists = await _cacheService.GetAsync<bool?>(cacheKey);

//             if (exists.HasValue)
//             {
//                 return exists.Value;
//             }

//             // If not in cache, check database
//             var stockExists = await _context.Stock.AnyAsync(s => s.Symbol.ToUpper() == symbol);

//             // Cache the result
//             await _cacheService.SetAsync(cacheKey, stockExists, 30); // Cache for 30 minutes

//             return stockExists;
//         }
//     }
// }

using Microsoft.EntityFrameworkCore;
using StockHub_Backend.Data;
using StockHub_Backend.Dtos.Stock;
using StockHub_Backend.DTOs.Portfolio;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Models;
using StockHub_Backend.Services;

namespace StockHub_Backend.Repository
{
    public class StockRepository : IStockRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly ICacheService _cacheService;
        private readonly IEventPublisher _eventPublisher;
        private readonly ILogger<StockRepository> _logger;

        public StockRepository(ApplicationDBContext context, ICacheService cacheService,
            IEventPublisher eventPublisher,
            ILogger<StockRepository> logger)
        {
            _context = context;
            _cacheService = cacheService;
            _eventPublisher = eventPublisher;
            _logger = logger;
        }

        public async Task<List<Stock>> GetAllAsync()
        {
            return await _context.Stock.Include(c => c.Comments).ToListAsync();
        }

        public async Task<Stock?> GetByIdAsync(int id)
        {
            // Try to get from cache first
            string cacheKey = $"stock:{id}";
            var cachedStock = await _cacheService.GetAsync<Stock>(cacheKey);

            if (cachedStock != null)
            {
                return cachedStock;
            }

            // If not in cache, fetch from database
            var stock = await _context.Stock.Include(c => c.Comments)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (stock != null)
            {
                // Cache the result
                await _cacheService.SetAsync(cacheKey, stock, 5); // Cache for 5 minutes
            }

            return stock;
        }

        public async Task<Stock> CreateAsync(Stock stockModel)
        {
            await _context.Stock.AddAsync(stockModel);
            await _context.SaveChangesAsync();
            return stockModel;
        }

        public async Task<bool> UpdateAsync(int id, StockUpdateDto updateStock)
        {
            var stockModel = await _context.Stock.FirstOrDefaultAsync(x => x.Id == id);
            if (stockModel == null)
            {
                return false;
            }

            stockModel.Symbol = updateStock.Symbol;
            stockModel.CompanyName = updateStock.CompanyName;
            stockModel.Purchase = updateStock.Purchase;
            stockModel.LastDiv = updateStock.LastDiv;
            stockModel.Industry = updateStock.Industry;
            stockModel.MarketCap = updateStock.MarketCap;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var stockModel = await _context.Stock.FirstOrDefaultAsync(x => x.Id == id);
            if (stockModel == null)
            {
                return false;
            }

            _context.Stock.Remove(stockModel);
            await _context.SaveChangesAsync();
            return true;
        }

        // public Task<bool> StockExists(int id)
        // {
        //     return _context.Stock.AnyAsync(s => s.Id == id);
        // }

        public async Task<Stock?> GetBySymbolAsync(string symbol)
        {
            // Normalize symbol
            symbol = symbol.ToUpper();

            // Try to get from cache first
            string cacheKey = $"stock:symbol:{symbol}";
            var cachedStock = await _cacheService.GetAsync<Stock>(cacheKey);

            if (cachedStock != null)
            {
                return cachedStock;
            }

            // If not in cache, fetch from database
            var stock = await _context.Stock
                .FirstOrDefaultAsync(s => s.Symbol.ToUpper() == symbol);

            if (stock != null)
            {
                // Cache the result
                await _cacheService.SetAsync(cacheKey, stock, 5); // Cache for 5 minutes
            }

            return stock;
        }

        public async Task<List<Stock>> SearchStocksAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
            {
                return new List<Stock>();
            }

            query = query.ToUpper();

            // Try to get from cache first
            string cacheKey = $"stock:search:{query}";
            var cachedResults = await _cacheService.GetAsync<List<Stock>>(cacheKey);

            if (cachedResults != null)
            {
                return cachedResults;
            }

            // If not in cache, fetch from database
            var stocks = await _context.Stock
                .Where(s => s.Symbol.ToUpper().Contains(query) || s.CompanyName.ToUpper().Contains(query))
                .OrderBy(s => s.Symbol)
                .Take(10)
                .ToListAsync();

            // Cache the result
            await _cacheService.SetAsync(cacheKey, stocks, 5); // Cache for 5 minutes

            return stocks;
        }

        public async Task<Stock> UpdateStockPriceAsync(string symbol, decimal currentPrice, decimal previousClose)
        {
            symbol = symbol.ToUpper();

            var stock = await _context.Stock
                .FirstOrDefaultAsync(s => s.Symbol.ToUpper() == symbol);

            if (stock == null)
            {
                _logger.LogWarning("Attempted to update price for non-existent stock: {Symbol}", symbol);
                return null;
            }

            // Update the stock price
            stock.CurrentPrice = currentPrice;
            stock.PreviousClose = previousClose;
            stock.LastUpdated = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Invalidate cache for this stock
            await _cacheService.RemoveAsync($"stock:{stock.Id}");
            await _cacheService.RemoveAsync($"stock:symbol:{symbol}");

            // Also invalidate any portfolio caches that might contain this stock
            if (_context.Model.FindEntityType(typeof(PortfolioStock)) != null)
            {
                // Check if the DbSet exists through the model metadata
                var portfolioStocks = await _context.Set<PortfolioStock>()
                    .Where(ps => ps.StockId == stock.Id)
                    .Include(ps => ps.Portfolio)
                    .ToListAsync();

                foreach (var portfolioStock in portfolioStocks)
                {
                    await _cacheService.RemoveAsync($"portfolio:{portfolioStock.PortfolioId}");

                    if (portfolioStock.Portfolio?.AppUserId != null)
                    {
                        await _cacheService.RemoveAsync($"portfolios:{portfolioStock.Portfolio.AppUserId}");
                    }
                }
            }

            // Check if event publisher method is accessible 
            try
            {
                // Publish the stock price update event
                await _eventPublisher.PublishStockPriceUpdate(new StockPriceUpdateEvent
                {
                    Symbol = symbol,
                    Price = currentPrice,
                    PreviousClose = previousClose,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to publish stock price update event");
            }

            return stock;
        }

        public async Task<bool> StockExists(string symbol)
        {
            symbol = symbol.ToUpper();

            // Check cache first
            string cacheKey = $"stock:exists:{symbol}";
            var exists = await _cacheService.GetAsync<bool?>(cacheKey);

            if (exists.HasValue)
            {
                return exists.Value;
            }

            // If not in cache, check database
            var stockExists = await _context.Stock.AnyAsync(s => s.Symbol.ToUpper() == symbol);

            // Cache the result
            await _cacheService.SetAsync(cacheKey, stockExists, 30); // Cache for 30 minutes

            return stockExists;
        }

        public async Task<bool> stockExists(int stockId)
        {
            // Check cache first
            string cacheKey = $"stock:exists:id:{stockId}";
            var exists = await _cacheService.GetAsync<bool?>(cacheKey);

            if (exists.HasValue)
            {
                return exists.Value;
            }

            // If not in cache, check database
            var stockExists = await _context.Stock.AnyAsync(s => s.Id == stockId);

            // Cache the result
            await _cacheService.SetAsync(cacheKey, stockExists, 30); // Cache for 30 minutes

            return stockExists;
        }
    }
}
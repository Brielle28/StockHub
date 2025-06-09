using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Dtos.StockData;
using StockHub_Backend.Mappers;
using System.ComponentModel.DataAnnotations;

namespace StockHub_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableRateLimiting("StockApiPolicy")]
    [Authorize] // Added authorization requirement
    public class StockDataController : ControllerBase
    {
        private readonly IStockDataService _stockDataService;
        private readonly ILogger<StockDataController> _logger;

        public StockDataController(
            IStockDataService stockDataService,
            ILogger<StockDataController> logger)
        {
            _stockDataService = stockDataService;
            _logger = logger;
        }


        [HttpGet("search")]
        public async Task<IActionResult> SearchStocks([FromQuery] StockSearchRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var results = await _stockDataService.SearchStocksAsync(request.Query, request.Limit);
                var dtos = results.Select(r => r.ToDto()).ToList();

                _logger.LogInformation("Search completed for query: {Query}, returned {Count} results",
                    request.Query, dtos.Count);

                return Ok(dtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching stocks for query: {Query}", request.Query);
                return StatusCode(500, new { message = "An error occurred while searching stocks" });
            }
        }


        // Get current prices for multiple stock symbols
        [HttpGet("prices")]
        public async Task<IActionResult> GetStockPrices([FromQuery, Required] string symbols)
        {
            if (string.IsNullOrWhiteSpace(symbols))
            {
                return BadRequest("Symbols parameter is required");
            }

            var symbolList = symbols.Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim().ToUpper())
                .Where(s => !string.IsNullOrEmpty(s))
                .ToList();

            if (!symbolList.Any())
            {
                return BadRequest("At least one valid symbol is required");
            }

            if (symbolList.Count > 10)
            {
                return BadRequest("Maximum 10 symbols allowed per request");
            }

            try
            {
                var quotes = await _stockDataService.GetStockPricesAsync(symbolList);
                var dtos = quotes.Select(q => q.ToDto()).ToList();

                _logger.LogInformation("Retrieved prices for {Count} symbols out of {Total} requested",
                    dtos.Count, symbolList.Count);

                return Ok(dtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting stock prices for symbols: {Symbols}", symbols);
                return StatusCode(500, new { message = "An error occurred while retrieving stock prices" });
            }
        }

        // Get historical data for a specific stock symbol
        [HttpGet("{symbol}/history")]
        public async Task<IActionResult> GetStockHistory(
            [FromRoute, Required] string symbol,
            [FromQuery] StockHistoryRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(symbol))
            {
                return BadRequest("Symbol is required");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var history = await _stockDataService.GetStockHistoryAsync(
                    symbol.ToUpper(),
                    request.Range,
                    request.Interval);

                if (history == null)
                {
                    return NotFound($"Historical data not found for symbol: {symbol}");
                }

                var dto = history.ToDto();

                _logger.LogInformation("Retrieved historical data for {Symbol}, range: {Range}, points: {Count}",
                    symbol, request.Range, dto.DataPoints?.Count ?? 0);

                return Ok(dto);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid parameters for historical data request: {Symbol}", symbol);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting historical data for symbol: {Symbol}", symbol);
                return StatusCode(500, new { message = "An error occurred while retrieving historical data" });
            }
        }

        // Get latest market news
        [HttpGet("news")]
        public async Task<IActionResult> GetMarketNews([FromQuery] StockNewsRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var news = await _stockDataService.GetStockNewsAsync(request.Symbol);
                var dtos = news.Select(n => n.ToDto()).ToList();

                _logger.LogInformation("Retrieved {Count} news articles for symbol: {Symbol}",
                    dtos.Count, request.Symbol);

                return Ok(dtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting market news for symbol: {Symbol}", request.Symbol);
                return StatusCode(500, new { message = "An error occurred while retrieving market news" });
            }
        }

        // Get detailed quote information for a single stock
        [HttpGet("{symbol}")]
        public async Task<IActionResult> GetStockQuote([FromRoute, Required] string symbol)
        {
            if (string.IsNullOrWhiteSpace(symbol))
            {
                return BadRequest("Symbol is required");
            }

            try
            {
                var quote = await _stockDataService.GetStockQuoteAsync(symbol.ToUpper());

                if (quote == null)
                {
                    return NotFound($"Stock quote not found for symbol: {symbol}");
                }

                var dto = quote.ToDto();

                _logger.LogInformation("Retrieved quote for symbol: {Symbol}, price: {Price}",
                    symbol, dto.CurrentPrice);

                return Ok(dto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting stock quote for symbol: {Symbol}", symbol);
                return StatusCode(500, new { message = "An error occurred while retrieving stock quote" });
            }
        }

        // Health check endpoint for the stock data service
        [HttpGet("health")]
        
        public async Task<IActionResult> HealthCheck()
        {
            try
            {
                // Test a simple API call to verify service health
                var testQuote = await _stockDataService.GetStockQuoteAsync("AAPL");

                return Ok(new
                {
                    status = "healthy",
                    timestamp = DateTime.UtcNow,
                    services = new
                    {
                        api = testQuote != null ? "operational" : "degraded",
                        cache = "operational" // You can add actual Redis health check here
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Health check failed");
                return StatusCode(503, new
                {
                    status = "unhealthy",
                    timestamp = DateTime.UtcNow,
                    error = "Service temporarily unavailable"
                });
            }
        }
    }
}
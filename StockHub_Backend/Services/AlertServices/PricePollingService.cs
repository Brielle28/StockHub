// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text.Json;
// using System.Threading.Tasks;
// using Microsoft.Extensions.Caching.Distributed;
// using Microsoft.Extensions.DependencyInjection;
// using Microsoft.Extensions.Logging;
// using StockHub_Backend.Dtos.Alert;
// using StockHub_Backend.Interfaces;
// using StockHub_Backend.Models;
// using AlertModel = StockHub_Backend.Models.Alert;

// namespace StockHub_Backend.Services.Alert
// {
//     public class PricePollingService : IPricePollingService
//     {
//         private readonly IServiceProvider _serviceProvider;
//         private readonly ILogger<PricePollingService> _logger;
//         private readonly HttpClient _httpClient;
//         private readonly IDistributedCache _cache;

//         public PricePollingService(
//             IServiceProvider serviceProvider,
//             ILogger<PricePollingService> logger,
//             HttpClient httpClient,
//             IDistributedCache cache)
//         {
//             _serviceProvider = serviceProvider;
//             _logger = logger;
//             _httpClient = httpClient;
//             _cache = cache;
//         }

//         public async Task CheckPricesAndTriggerAlertsAsync()
//         {
//             try
//             {
//                 using var scope = _serviceProvider.CreateScope();
//                 var alertRepository = scope.ServiceProvider.GetRequiredService<IAlertRepository>();
//                 var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

//                 var activeAlerts = await alertRepository.GetActiveAlertsAsync();
//                 var symbols = activeAlerts.Select(a => a.Symbol).Distinct().ToList();

//                 if (!symbols.Any())
//                 {
//                     _logger.LogDebug("No active alerts found");
//                     return;
//                 }

//                 _logger.LogDebug("Checking prices for {SymbolCount} symbols with {AlertCount} active alerts", 
//                     symbols.Count, activeAlerts.Count());

//                 // Fetch current prices for all symbols
//                 var priceResults = await Task.WhenAll(
//                     symbols.Select(async symbol => new
//                     {
//                         Symbol = symbol,
//                         Price = await GetCurrentPriceAsync(symbol)
//                     })
//                 );

//                 var prices = priceResults
//                     .Where(p => p.Price.HasValue)
//                     .ToDictionary(p => p.Symbol, p => p.Price!.Value);

//                 var triggeredAlerts = new List<AlertModel>();

//                 foreach (var alert in activeAlerts)
//                 {
//                     if (!prices.TryGetValue(alert.Symbol, out var currentPrice))
//                     {
//                         _logger.LogWarning("No price found for symbol {Symbol}", alert.Symbol);
//                         continue;
//                     }

//                     if (ShouldTriggerAlert(alert, currentPrice))
//                     {
//                         alert.IsActive = false;
//                         alert.TriggeredAt = DateTime.UtcNow;
//                         triggeredAlerts.Add(alert);

//                         // Update alert in database
//                         await alertRepository.UpdateAlertAsync(alert);

//                         // Send notification
//                         var alertTriggered = new AlertTriggeredDTO
//                         {
//                             AlertId = alert.Id,
//                             UserId = alert.UserId,
//                             Symbol = alert.Symbol,
//                             CurrentPrice = currentPrice,
//                             TargetPrice = alert.TargetPrice,
//                             Message = GenerateAlertMessage(alert, currentPrice)
//                         };

//                         await notificationService.ProcessTriggeredAlertAsync(alertTriggered);
//                     }
//                 }

//                 if (triggeredAlerts.Any())
//                 {
//                     _logger.LogInformation("Triggered {Count} alerts", triggeredAlerts.Count);
                    
//                     // Clear cache for affected users
//                     var affectedUsers = triggeredAlerts.Select(a => a.UserId).Distinct();
//                     foreach (var userId in affectedUsers)
//                     {
//                         await _cache.RemoveAsync($"alerts:user:{userId}");
//                     }
//                 }
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error checking prices and triggering alerts");
//             }
//         }

//         public async Task<decimal?> GetCurrentPriceAsync(string symbol)
//         {
//             try
//             {
//                 var cacheKey = $"price:{symbol}";
//                 var cachedPrice = await _cache.GetStringAsync(cacheKey);

//                 if (!string.IsNullOrEmpty(cachedPrice) && decimal.TryParse(cachedPrice, out var price))
//                 {
//                     return price;
//                 }

//                 // Yahoo Finance API call
//                 var url = $"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}";
//                 var response = await _httpClient.GetAsync(url);

//                 if (!response.IsSuccessStatusCode)
//                 {
//                     _logger.LogWarning("Failed to fetch price for {Symbol}: {StatusCode}", symbol, response.StatusCode);
//                     return null;
//                 }

//                 var content = await response.Content.ReadAsStringAsync();
//                 var jsonDoc = JsonDocument.Parse(content);

//                 var chartResult = jsonDoc.RootElement
//                     .GetProperty("chart");

//                 if (!chartResult.GetProperty("result").EnumerateArray().Any())
//                 {
//                     _logger.LogWarning("No chart data found for symbol {Symbol}", symbol);
//                     return null;
//                 }

//                 var result = chartResult.GetProperty("result")[0];
//                 var meta = result.GetProperty("meta");

//                 if (!meta.TryGetProperty("regularMarketPrice", out var priceElement))
//                 {
//                     _logger.LogWarning("No regular market price found for symbol {Symbol}", symbol);
//                     return null;
//                 }

//                 var currentPrice = priceElement.GetDecimal();

//                 // Cache for 30 seconds
//                 await _cache.SetStringAsync(cacheKey, currentPrice.ToString(),
//                     new DistributedCacheEntryOptions
//                     {
//                         AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30)
//                     });

//                 return currentPrice;
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error fetching price for symbol {Symbol}", symbol);
//                 return null;
//             }
//         }

//         private static bool ShouldTriggerAlert(AlertModel alert, decimal currentPrice)
//         {
//             return alert.Condition switch
//             {
//                 AlertCondition.GREATER_THAN => currentPrice >= alert.TargetPrice,
//                 AlertCondition.LESS_THAN => currentPrice <= alert.TargetPrice,
//                 AlertCondition.EQUALS => Math.Abs(currentPrice - alert.TargetPrice) < 0.01m,
//                 _ => false
//             };
//         }

//         private static string GenerateAlertMessage(AlertModel alert, decimal currentPrice)
//         {
//             var conditionText = alert.Condition switch
//             {
//                 AlertCondition.GREATER_THAN => "has exceeded",
//                 AlertCondition.LESS_THAN => "has dropped below",
//                 AlertCondition.EQUALS => "has reached",
//                 _ => "has reached"
//             };

//             return $"{alert.Symbol} {conditionText} ${alert.TargetPrice:F2} (current: ${currentPrice:F2})";
//         }
//     }
// }
using Microsoft.Extensions.Caching.Distributed;
using StockHub_Backend.Dtos.Alert;
using StockHub_Backend.DTOs;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Models;
using System.Text.Json;
using AlertModel = StockHub_Backend.Models.Alert;

namespace StockHub_Backend.Services
{
    public class PricePollingService : IPricePollingService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<PricePollingService> _logger;
        private readonly IYahooFinanceApiService _yahooFinanceService;
        private readonly IDistributedCache _cache;

        public PricePollingService(
            IServiceProvider serviceProvider,
            ILogger<PricePollingService> logger,
            IYahooFinanceApiService yahooFinanceService,
            IDistributedCache cache)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _yahooFinanceService = yahooFinanceService;
            _cache = cache;
        }

        public async Task CheckPricesAndTriggerAlertsAsync()
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var alertRepository = scope.ServiceProvider.GetRequiredService<IAlertRepository>();
                var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

                var activeAlerts = await alertRepository.GetActiveAlertsAsync();
                var symbols = activeAlerts.Select(a => a.Symbol).Distinct().ToList();

                if (!symbols.Any())
                {
                    _logger.LogDebug("No active alerts found");
                    return;
                }

                _logger.LogDebug("Checking prices for {SymbolCount} symbols with {AlertCount} active alerts", 
                    symbols.Count, activeAlerts.Count());

                // Fetch current prices for all symbols using Yahoo Finance service
                var prices = await GetCurrentPricesAsync(symbols);

                if (!prices.Any())
                {
                    _logger.LogWarning("No prices retrieved for any symbols");
                    return;
                }

                var triggeredAlerts = new List<AlertModel>();

                foreach (var alert in activeAlerts)
                {
                    if (!prices.TryGetValue(alert.Symbol, out var currentPrice))
                    {
                        _logger.LogWarning("No price found for symbol {Symbol}", alert.Symbol);
                        continue;
                    }

                    if (ShouldTriggerAlert(alert, currentPrice))
                    {
                        alert.IsActive = false;
                        alert.TriggeredAt = DateTime.UtcNow;
                        triggeredAlerts.Add(alert);

                        // Update alert in database
                        await alertRepository.UpdateAlertAsync(alert);

                        // Send notification
                        var alertTriggered = new AlertTriggeredDTO
                        {
                            AlertId = alert.Id,
                            UserId = alert.UserId,
                            Symbol = alert.Symbol,
                            CurrentPrice = currentPrice,
                            TargetPrice = alert.TargetPrice,
                            Message = GenerateAlertMessage(alert, currentPrice)
                        };

                        await notificationService.ProcessTriggeredAlertAsync(alertTriggered);
                    }
                }

                if (triggeredAlerts.Any())
                {
                    _logger.LogInformation("Triggered {Count} alerts", triggeredAlerts.Count);
                    
                    // Clear cache for affected users
                    var affectedUsers = triggeredAlerts.Select(a => a.UserId).Distinct();
                    foreach (var userId in affectedUsers)
                    {
                        await _cache.RemoveAsync($"alerts:user:{userId}");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking prices and triggering alerts");
            }
        }

        public async Task<decimal?> GetCurrentPriceAsync(string symbol)
        {
            try
            {
                var cacheKey = $"price:{symbol}";
                var cachedPrice = await _cache.GetStringAsync(cacheKey);

                if (!string.IsNullOrEmpty(cachedPrice) && decimal.TryParse(cachedPrice, out var price))
                {
                    return price;
                }

                // Use Yahoo Finance service to get single quote
                var quoteResponse = await _yahooFinanceService.GetQuoteAsync(symbol);
                
                if (quoteResponse?.QuoteResponse?.Result?.Any() == true)
                {
                    var quote = quoteResponse.QuoteResponse.Result.First();
                    var currentPrice = (decimal)(quote.RegularMarketPrice ?? 0);

                    if (currentPrice > 0)
                    {
                        // Cache for 30 seconds
                        await _cache.SetStringAsync(cacheKey, currentPrice.ToString(),
                            new DistributedCacheEntryOptions
                            {
                                AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30)
                            });

                        return currentPrice;
                    }
                }

                _logger.LogWarning("No valid price found for symbol {Symbol}", symbol);
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching price for symbol {Symbol}", symbol);
                return null;
            }
        }

        /// <summary>
        /// Gets current prices for multiple symbols in a single API call (more efficient)
        /// </summary>
        private async Task<Dictionary<string, decimal>> GetCurrentPricesAsync(List<string> symbols)
        {
            var prices = new Dictionary<string, decimal>();

            try
            {
                // Check cache first for all symbols
                var uncachedSymbols = new List<string>();
                
                foreach (var symbol in symbols)
                {
                    var cacheKey = $"price:{symbol}";
                    var cachedPrice = await _cache.GetStringAsync(cacheKey);
                    
                    if (!string.IsNullOrEmpty(cachedPrice) && decimal.TryParse(cachedPrice, out var price))
                    {
                        prices[symbol] = price;
                    }
                    else
                    {
                        uncachedSymbols.Add(symbol);
                    }
                }

                // If all prices are cached, return them
                if (!uncachedSymbols.Any())
                {
                    _logger.LogDebug("All {Count} symbol prices found in cache", symbols.Count);
                    return prices;
                }

                _logger.LogDebug("Fetching prices for {Count} uncached symbols: {Symbols}", 
                    uncachedSymbols.Count, string.Join(", ", uncachedSymbols));

                // Fetch uncached symbols using batch API call
                var quotesResponse = await _yahooFinanceService.GetQuotesAsync(uncachedSymbols);

                if (quotesResponse?.QuoteResponse?.Result?.Any() == true)
                {
                    foreach (var quote in quotesResponse.QuoteResponse.Result)
                    {
                        if (!string.IsNullOrEmpty(quote.Symbol))
                        {
                            var currentPrice = (decimal)(quote.RegularMarketPrice ?? 0);
                            
                            if (currentPrice > 0)
                            {
                                prices[quote.Symbol] = currentPrice;

                                // Cache the price for 30 seconds
                                var cacheKey = $"price:{quote.Symbol}";
                                await _cache.SetStringAsync(cacheKey, currentPrice.ToString(),
                                    new DistributedCacheEntryOptions
                                    {
                                        AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30)
                                    });
                            }
                            else
                            {
                                _logger.LogWarning("Invalid price (0 or negative) for symbol {Symbol}", quote.Symbol);
                            }
                        }
                    }
                }

                _logger.LogInformation("Successfully retrieved prices for {Count}/{Total} symbols", 
                    prices.Count, symbols.Count);

                return prices;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching prices for symbols: {Symbols}", string.Join(", ", symbols));
                return prices; // Return whatever prices we managed to get
            }
        }

        private static bool ShouldTriggerAlert(AlertModel alert, decimal currentPrice)
        {
            return alert.Condition switch
            {
                AlertCondition.GREATER_THAN => currentPrice >= alert.TargetPrice,
                AlertCondition.LESS_THAN => currentPrice <= alert.TargetPrice,
                AlertCondition.EQUALS => Math.Abs(currentPrice - alert.TargetPrice) < 0.01m,
                _ => false
            };
        }

        private static string GenerateAlertMessage(AlertModel alert, decimal currentPrice)
        {
            var conditionText = alert.Condition switch
            {
                AlertCondition.GREATER_THAN => "has exceeded",
                AlertCondition.LESS_THAN => "has dropped below",
                AlertCondition.EQUALS => "has reached",
                _ => "has reached"
            };

            return $"{alert.Symbol} {conditionText} ${alert.TargetPrice:F2} (current: ${currentPrice:F2})";
        }
    }
}
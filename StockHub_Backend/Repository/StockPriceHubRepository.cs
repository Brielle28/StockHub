using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Models;
using Polly;

namespace StockHub_Backend.Repository
{
    public class StockPriceHubRepository : Hub, IStockPriceHub
    {
        private static readonly ConcurrentDictionary<string, HashSet<string>> _symbolSubscriptions = new();
        private static readonly ConcurrentDictionary<string, string> _connectionSymbols = new();
        private readonly ILogger<StockPriceHubRepository> _logger;

        public StockPriceHubRepository(ILogger<StockPriceHubRepository> logger)
        {
            _logger = logger;
        }

        // Interface implementation methods
        public async Task SendStockPriceUpdate(string symbol, decimal price, decimal change, decimal changePercent)
        {
            try
            {
                var upperSymbol = symbol.ToUpper();
                var priceData = new
                {
                    symbol = upperSymbol,
                    price,
                    change,
                    changePercent,
                    timestamp = DateTime.UtcNow
                };

                await Clients.Group($"stock_{upperSymbol}").SendAsync("PriceUpdate", priceData);

                _logger.LogDebug("Sent price update for {Symbol}: {Price} ({Change:+0.00;-0.00})",
                    upperSymbol, price, change);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending price update for symbol {Symbol}", symbol);
            }
        }

        public async Task SendStockPriceUpdates(List<KafkaStockMessage> updates)
        {
            try
            {
                var tasks = updates.Select(update =>
                    SendStockPriceUpdate(update.Symbol, update.Price, update.Change, update.ChangePercent));

                await Task.WhenAll(tasks);

                _logger.LogDebug("Sent batch price updates for {Count} symbols", updates.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending batch price updates");
            }
        }

        /// <summary>
        /// Client subscribes to price updates for specific symbols
        /// </summary>
        /// <param name="symbols">Array of stock symbols to subscribe to</param>
        public async Task SubscribeToSymbols(string[] symbols)
        {
            var connectionId = Context.ConnectionId;

            try
            {
                // Remove from previous subscriptions
                await UnsubscribeFromAllSymbols();

                // Add to new subscriptions
                foreach (var symbol in symbols.Where(s => !string.IsNullOrWhiteSpace(s)))
                {
                    var upperSymbol = symbol.ToUpper();

                    _symbolSubscriptions.AddOrUpdate(
                        upperSymbol,
                        new HashSet<string> { connectionId },
                        (key, existing) =>
                        {
                            existing.Add(connectionId);
                            return existing;
                        });

                    await Groups.AddToGroupAsync(connectionId, $"stock_{upperSymbol}");
                }

                // Track symbols for this connection
                _connectionSymbols[connectionId] = string.Join(",", symbols);

                _logger.LogInformation("Connection {ConnectionId} subscribed to symbols: {Symbols}",
                    connectionId, string.Join(", ", symbols));

                await Clients.Caller.SendAsync("SubscriptionConfirmed", symbols);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error subscribing to symbols for connection {ConnectionId}", connectionId);
                await Clients.Caller.SendAsync("Error", "Failed to subscribe to symbols");
            }
        }

        /// <summary>
        /// Client unsubscribes from specific symbols
        /// </summary>
        /// <param name="symbols">Array of stock symbols to unsubscribe from</param>
        public async Task UnsubscribeFromSymbols(string[] symbols)
        {
            var connectionId = Context.ConnectionId;

            try
            {
                foreach (var symbol in symbols.Where(s => !string.IsNullOrWhiteSpace(s)))
                {
                    var upperSymbol = symbol.ToUpper();

                    if (_symbolSubscriptions.TryGetValue(upperSymbol, out var connections))
                    {
                        connections.Remove(connectionId);
                        if (connections.Count == 0)
                        {
                            _symbolSubscriptions.TryRemove(upperSymbol, out _);
                        }
                    }

                    await Groups.RemoveFromGroupAsync(connectionId, $"stock_{upperSymbol}");
                }

                _logger.LogInformation("Connection {ConnectionId} unsubscribed from symbols: {Symbols}",
                    connectionId, string.Join(", ", symbols));

                await Clients.Caller.SendAsync("UnsubscriptionConfirmed", symbols);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error unsubscribing from symbols for connection {ConnectionId}", connectionId);
                await Clients.Caller.SendAsync("Error", "Failed to unsubscribe from symbols");
            }
        }

        /// <summary>
        /// Client unsubscribes from all symbols
        /// </summary>
        public async Task UnsubscribeFromAllSymbols()
        {
            var connectionId = Context.ConnectionId;

            try
            {
                if (_connectionSymbols.TryGetValue(connectionId, out var symbolsString) &&
                    !string.IsNullOrEmpty(symbolsString))
                {
                    var symbols = symbolsString.Split(',');
                    await UnsubscribeFromSymbols(symbols);
                }

                _connectionSymbols.TryRemove(connectionId, out _);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error unsubscribing from all symbols for connection {ConnectionId}", connectionId);
            }
        }

        /// <summary>
        /// Get list of currently subscribed symbols for the connection
        /// </summary>
        public async Task GetSubscribedSymbols()
        {
            var connectionId = Context.ConnectionId;

            try
            {
                if (_connectionSymbols.TryGetValue(connectionId, out var symbolsString) &&
                    !string.IsNullOrEmpty(symbolsString))
                {
                    var symbols = symbolsString.Split(',');
                    await Clients.Caller.SendAsync("SubscribedSymbols", symbols);
                }
                else
                {
                    await Clients.Caller.SendAsync("SubscribedSymbols", Array.Empty<string>());
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting subscribed symbols for connection {ConnectionId}", connectionId);
                await Clients.Caller.SendAsync("Error", "Failed to get subscribed symbols");
            }
        }

        /// <summary>
        /// Broadcast price update to all subscribers of a symbol (legacy method for backward compatibility)
        /// </summary>
        /// <param name="symbol">Stock symbol</param>
        /// <param name="priceData">Price update data</param>
        public async Task BroadcastPriceUpdate(string symbol, object priceData)
        {
            try
            {
                var upperSymbol = symbol.ToUpper();
                await Clients.Group($"stock_{upperSymbol}").SendAsync("PriceUpdate", new
                {
                    symbol = upperSymbol,
                    data = priceData,
                    timestamp = DateTime.UtcNow
                });

                _logger.LogDebug("Broadcasted price update for {Symbol} to group stock_{Symbol}",
                    upperSymbol, upperSymbol);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error broadcasting price update for symbol {Symbol}", symbol);
            }
        }

        /// <summary>
        /// Send market status updates
        /// </summary>
        /// <param name="status">Market status information</param>
        public async Task BroadcastMarketStatus(object status)
        {
            try
            {
                await Clients.All.SendAsync("MarketStatus", new
                {
                    status,
                    timestamp = DateTime.UtcNow
                });

                _logger.LogDebug("Broadcasted market status update");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error broadcasting market status");
            }
        }

        public override async Task OnConnectedAsync()
        {
            var connectionId = Context.ConnectionId;
            _logger.LogInformation("Client connected: {ConnectionId}", connectionId);

            await Clients.Caller.SendAsync("Connected", new
            {
                connectionId,
                timestamp = DateTime.UtcNow,
                message = "Successfully connected to StockHub"
            });

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var connectionId = Context.ConnectionId;

            try
            {
                // Clean up subscriptions
                await UnsubscribeFromAllSymbols();

                _logger.LogInformation("Client disconnected: {ConnectionId}", connectionId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during disconnection cleanup for {ConnectionId}", connectionId);
            }

            await base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// Get current connection statistics
        /// </summary>
        public static ConnectionStats GetConnectionStats()
        {
            return new ConnectionStats
            {
                TotalConnections = _connectionSymbols.Count,
                UniqueSymbolsTracked = _symbolSubscriptions.Keys.Count,
                SymbolSubscriptions = _symbolSubscriptions.ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value.Count)
            };
        }
    }

    public class ConnectionStats
    {
        public int TotalConnections { get; set; }
        public int UniqueSymbolsTracked { get; set; }
        public Dictionary<string, int> SymbolSubscriptions { get; set; } = new();
    }
}
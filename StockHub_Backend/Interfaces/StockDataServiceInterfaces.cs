using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using StockHub_Backend.Models;
using StockHub_Backend.Dtos.StockData;

namespace StockHub_Backend.Interfaces
{
    public interface IStockDataService
    {
        Task<List<StockSearchResult>> SearchStocksAsync(string query, int limit = 10);
        Task<List<StockQuote>> GetStockPricesAsync(List<string> symbols);
        Task<StockQuote?> GetStockQuoteAsync(string symbol);
        Task<StockHistory?> GetStockHistoryAsync(string symbol, string range, string interval = "1d");
        Task<List<StockNews>> GetStockNewsAsync(string symbol);
    }

    public interface IStockDataCacheService
    {
        Task<T?> GetAsync<T>(string key) where T : class;
        Task SetAsync<T>(string key, T value, TimeSpan? expiry = null) where T : class;
        Task RemoveAsync(string key);
        Task<bool> ExistsAsync(string key);
        Task SetStringAsync(string key, string value, TimeSpan? expiry = null);
        Task<string?> GetStringAsync(string key);
    }

    public interface IKafkaProducerService
    {
        Task PublishStockPriceUpdateAsync(KafkaStockMessage message);
        Task PublishStockPriceUpdatesAsync(List<KafkaStockMessage> messages);
    }

    public interface IYahooFinanceApiService
    {
        Task<YahooQuoteResponseDto?> GetQuoteAsync(string symbol);
        Task<YahooQuoteResponseDto?> GetQuotesAsync(List<string> symbols);
        Task<YahooHistoryResponseDto?> GetHistoricalDataAsync(string symbol, string range, string interval);
        Task<List<StockSearchResult>> SearchStocksAsync(string query, int limit);
        Task<List<StockNews>> GetNewsAsync(string symbol);
    }

    public interface IStockPriceHub
    {
        Task SendStockPriceUpdate(string symbol, decimal price, decimal change, decimal changePercent);
        Task SendStockPriceUpdates(List<KafkaStockMessage> updates);
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Models;
using StockHub_Backend.Extensions;
using StockHub_Backend.Mappers;

namespace StockHub_Backend.Repository
{
    public class StockDataServiceRepository : IStockDataService
    {
        private readonly IYahooFinanceApiService _yahooApiService;
        private readonly IStockDataCacheService _cacheService;
        private readonly IKafkaProducerService _kafkaProducer;
        private readonly ILogger<StockDataServiceRepository> _logger;

        public StockDataServiceRepository(
            IYahooFinanceApiService yahooApiService,
            IStockDataCacheService cacheService,
            IKafkaProducerService kafkaProducer,
            ILogger<StockDataServiceRepository> logger)
        {
            _yahooApiService = yahooApiService;
            _cacheService = cacheService;
            _kafkaProducer = kafkaProducer;
            _logger = logger;
        }

        public async Task<List<StockSearchResult>> SearchStocksAsync(string query, int limit = 10)
        {
            var cacheKey = RedisExtensions.CacheKeys.StockSearch(query);
            
            // Try to get from cache first
            var cachedResults = await _cacheService.GetAsync<List<StockSearchResult>>(cacheKey);
            if (cachedResults != null)
            {
                _logger.LogInformation("Retrieved search results from cache for query: {Query}", query);
                return cachedResults.Take(limit).ToList();
            }

            try
            {
                // Get from API
                var results = await _yahooApiService.SearchStocksAsync(query, limit);
                
                // Cache the results
                await _cacheService.SetAsync(cacheKey, results, RedisExtensions.CacheTTL.StockSearch);
                
                return results;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching stocks for query: {Query}", query);
                return new List<StockSearchResult>();
            }
        }

        public async Task<List<StockQuote>> GetStockPricesAsync(List<string> symbols)
        {
            var quotes = new List<StockQuote>();
            var symbolsToFetch = new List<string>();

            // Check cache for each symbol
            foreach (var symbol in symbols)
            {
                var cacheKey = RedisExtensions.CacheKeys.StockPrice(symbol);
                var cachedQuote = await _cacheService.GetAsync<StockQuote>(cacheKey);
                
                if (cachedQuote != null)
                {
                    quotes.Add(cachedQuote);
                    _logger.LogInformation("Retrieved quote from cache for symbol: {Symbol}", symbol);
                }
                else
                {
                    symbolsToFetch.Add(symbol);
                }
            }

            // Fetch missing quotes from API
            if (symbolsToFetch.Any())
            {
                try
                {
                    var response = await _yahooApiService.GetQuotesAsync(symbolsToFetch);
                    
                    if (response?.QuoteResponse?.Result != null)
                    {
                        var fetchedQuotes = response.QuoteResponse.Result
                            .Select(q => q.FromYahooQuote())
                            .ToList();

                        // Cache and add to results
                        foreach (var quote in fetchedQuotes)
                        {
                            var cacheKey = RedisExtensions.CacheKeys.StockPrice(quote.Symbol);
                            await _cacheService.SetAsync(cacheKey, quote, RedisExtensions.CacheTTL.StockPrice);
                            quotes.Add(quote);
                        }

                        // Publish to Kafka
                        var kafkaMessages = fetchedQuotes.Select(q => q.ToKafkaMessage()).ToList();
                        await _kafkaProducer.PublishStockPriceUpdatesAsync(kafkaMessages);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error fetching quotes for symbols: {Symbols}", string.Join(",", symbolsToFetch));
                }
            }

            return quotes;
        }

        public async Task<StockQuote?> GetStockQuoteAsync(string symbol)
        {
            var cacheKey = RedisExtensions.CacheKeys.StockQuote(symbol);
            
            // Try cache first
            var cachedQuote = await _cacheService.GetAsync<StockQuote>(cacheKey);
            if (cachedQuote != null)
            {
                _logger.LogInformation("Retrieved quote from cache for symbol: {Symbol}", symbol);
                return cachedQuote;
            }

            try
            {
                // Get from API
                var response = await _yahooApiService.GetQuoteAsync(symbol);
                
                if (response?.QuoteResponse?.Result?.FirstOrDefault() != null)
                {
                    var quote = response.QuoteResponse.Result.First().FromYahooQuote();
                    
                    // Cache the quote
                    await _cacheService.SetAsync(cacheKey, quote, RedisExtensions.CacheTTL.StockQuote);
                    
                    // Publish to Kafka
                    await _kafkaProducer.PublishStockPriceUpdateAsync(quote.ToKafkaMessage());
                    
                    return quote;
                }
                
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting quote for symbol: {Symbol}", symbol);
                return null;
            }
        }

        public async Task<StockHistory?> GetStockHistoryAsync(string symbol, string range, string interval = "1d")
        {
            var cacheKey = RedisExtensions.CacheKeys.StockHistory(symbol, range);
            
            // Try cache first
            var cachedHistory = await _cacheService.GetAsync<StockHistory>(cacheKey);
            if (cachedHistory != null)
            {
                _logger.LogInformation("Retrieved history from cache for symbol: {Symbol}, range: {Range}", symbol, range);
                return cachedHistory;
            }

            try
            {
                // Get from API
                var response = await _yahooApiService.GetHistoricalDataAsync(symbol, range, interval);
                
                if (response?.Chart?.Result?.FirstOrDefault() != null)
                {
                    var chartResult = response.Chart.Result.First();
                    var dataPoints = chartResult.FromYahooHistory();
                    
                    var history = new StockHistory
                    {
                        Symbol = symbol,
                        Range = range,
                        DataPoints = dataPoints,
                        RetrievedAt = DateTime.UtcNow
                    };
                    
                    // Cache the history
                    await _cacheService.SetAsync(cacheKey, history, RedisExtensions.CacheTTL.StockHistory);
                    
                    return history;
                }
                
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting history for symbol: {Symbol}, range: {Range}", symbol, range);
                return null;
            }
        }

        public async Task<List<StockNews>> GetStockNewsAsync(string? symbol = null, int limit = 20, int offset = 0)
        {
            var cacheKey = RedisExtensions.CacheKeys.StockNews(symbol);
            
            // Try cache first
            var cachedNews = await _cacheService.GetAsync<List<StockNews>>(cacheKey);
            if (cachedNews != null)
            {
                _logger.LogInformation("Retrieved news from cache for symbol: {Symbol}", symbol ?? "general");
                return cachedNews.Skip(offset).Take(limit).ToList();
            }

            try
            {
                // Get from API
                var news = await _yahooApiService.GetNewsAsync(symbol, limit + offset, 0);
                
                // Cache the news
                await _cacheService.SetAsync(cacheKey, news, RedisExtensions.CacheTTL.StockNews);
                
                return news.Skip(offset).Take(limit).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting news for symbol: {Symbol}", symbol ?? "general");
                return new List<StockNews>();
            }
        }
    }
}
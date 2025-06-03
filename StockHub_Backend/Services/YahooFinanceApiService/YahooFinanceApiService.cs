using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Models;
using StockHub_Backend.Dtos.StockData;
using System.Buffers.Text;

namespace StockHub_Backend.Services.YahooFinanceApiService
{
    public class YahooFinanceApiService : IYahooFinanceApiService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<YahooFinanceApiService> _logger;
        // private readonly string _rapidApiKey;
        // private readonly string _rapidApiHost;
        private readonly JsonSerializerOptions _jsonOptions;

        public string baseUrl;


        // var 

        public YahooFinanceApiService(
            HttpClient httpClient,
            IConfiguration configuration,
            ILogger<YahooFinanceApiService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;

            var rapidApiKey = configuration["YahooFinanceAPI:RapidApiKey"] ??
                         throw new InvalidOperationException("RapidAPI key is not configured");
            var rapidApiHost = configuration["YahooFinanceAPI:RapidApiHost"] ??
                           throw new InvalidOperationException("RapidAPI host is not configured");

            baseUrl = configuration["YahooFinanceAPI:BaseUrl"] ??
                        throw new InvalidOperationException("BaseUrl is not configured");
            _httpClient.BaseAddress = new Uri(baseUrl);

            _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Key", rapidApiKey);
            _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Host", rapidApiHost);

            _httpClient.Timeout = TimeSpan.FromSeconds(30);

            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            };
        }

        public async Task<YahooQuoteResponseDto?> GetQuoteAsync(string symbol)
        {
            try
            {
                var response = await _httpClient.GetAsync($"/market/v2/get-quotes?symbols={symbol}&region=US");

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Failed to get quote for {Symbol}. Status: {Status}", symbol, response.StatusCode);
                    return null;
                }

                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<YahooQuoteResponseDto>(content, _jsonOptions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting quote for symbol: {Symbol}", symbol);
                return null;
            }
        }

        public async Task<YahooQuoteResponseDto?> GetQuotesAsync(List<string> symbols)
        {
            try
            {
                var symbolsQuery = string.Join(",", symbols);
                var response = await _httpClient.GetAsync($"/market/v2/get-quotes?symbols={symbolsQuery}&region=US");

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Failed to get quotes for symbols: {Symbols}. Status: {Status}", string.Join(",", symbols), response.StatusCode);
                    return null;
                }

                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<YahooQuoteResponseDto>(content, _jsonOptions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting quotes for symbols: {Symbols}", string.Join(",", symbols));
                return null;
            }
        }

        // public async Task<YahooHistoryResponseDto?> GetHistoricalDataAsync(string symbol, string range, string interval)
        // {
        //     try
        //     {
        //         var response = await _httpClient.GetAsync($"/stock/v3/get-historical-data?symbol={symbol}&region=US&range={range}&interval={interval}");

        //         if (!response.IsSuccessStatusCode)
        //         {
        //             _logger.LogWarning("Failed to get history for {Symbol}. Status: {Status}", symbol, response.StatusCode);
        //             return null;
        //         }

        //         var content = await response.Content.ReadAsStringAsync();
        //         return JsonSerializer.Deserialize<YahooHistoryResponseDto>(content, _jsonOptions);
        //     }
        //     catch (Exception ex)
        //     {
        //         _logger.LogError(ex, "Error getting history for symbol: {Symbol}", symbol);
        //         return null;
        //     }
        // }

        public async Task<List<StockSearchResult>> SearchStocksAsync(string query, int limit)
        {
            try
            {
                Console.WriteLine(_httpClient.BaseAddress);
                Console.WriteLine("hello");
                // Console.WriteLine(_httpClient.);
                // var response = await _httpClient.GetAsync($"/auto-complet?q={query}&region=US"
                // );
                // var url = baseUrl + ${/auto-complete?q={query}&region=US}`;
                var url = $"{baseUrl}/auto-complete?q={query}&region=US";
                var response = await _httpClient.GetAsync(url);
                Console.WriteLine(query);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Failed to search stocks for query: {Query}. Status: {Status}", query, response.StatusCode);
                    return new List<StockSearchResult>();
                }

                var content = await response.Content.ReadAsStringAsync();
                var searchResponse = JsonSerializer.Deserialize<YahooSearchResponseDto>(content, _jsonOptions);

                return searchResponse?.Quotes?.Select(quote => new StockSearchResult
                {
                    Symbol = quote.Symbol ?? "",
                    CompanyName = quote.LongName ?? quote.ShortName ?? "",
                    Exchange = quote.Exchange ?? "",
                    Type = quote.QuoteType ?? "",
                    Region = quote.Region ?? ""
                }).ToList() ?? new List<StockSearchResult>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching stocks for query: {Query}", query);
                return new List<StockSearchResult>();
            }
        }

        // public async Task<List<StockNews>> GetNewsAsync(string? symbol, int limit, int offset)
        // {
        //     try
        //     {
        //         var endpoint = string.IsNullOrEmpty(symbol)
        //             ? $"/news/list?category=generalnews&region=US"
        //             : $"/news/list?category={symbol}-news&region=US";

        //         var response = await _httpClient.GetAsync(endpoint);

        //         if (!response.IsSuccessStatusCode)
        //         {
        //             _logger.LogWarning("Failed to get news. Status: {Status}", response.StatusCode);
        //             return new List<StockNews>();
        //         }

        //         var content = await response.Content.ReadAsStringAsync();
        //         var newsResponse = JsonSerializer.Deserialize<YahooNewsResponseDto>(content, _jsonOptions);

        //         return newsResponse?.Items?.Select(item => new StockNews
        //         {
        //             Title = item.Title ?? "",
        //             Summary = item.Summary ?? "",
        //             Url = item.Link ?? "",
        //             Source = item.Publisher ?? "",
        //             PublishedAt = DateTimeOffset.FromUnixTimeSeconds(item.ProviderPublishTime ?? 0).DateTime,
        //             ImageUrl = item.Thumbnail?.Resolutions?.FirstOrDefault()?.Url ?? "",
        //             RelatedSymbols = item.RelatedTickers ?? new List<string>()
        //         }).ToList() ?? new List<StockNews>();
        //     }
        //     catch (Exception ex)
        //     {
        //         _logger.LogError(ex, "Error getting news for symbol: {Symbol}", symbol);
        //         return new List<StockNews>();
        //     }
        // }
        public async Task<YahooHistoryResponseDto?> GetHistoricalDataAsync(string symbol, string range, string interval)
        {
            try
            {
                // Build the new URL with query parameters
                var url = $"https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/history?symbol={symbol}&interval={interval}&diffandsplits=false";

                // Create HttpRequestMessage with manual headers
                using var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Add("x-rapidapi-key", "01207e2cb8msh4b75aa4c2667ea4p1f2a3djsn30f71919bb7a");
                request.Headers.Add("x-rapidapi-host", "yahoo-finance15.p.rapidapi.com");

                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Failed to get history for {Symbol}. Status: {Status}", symbol, response.StatusCode);
                    return null;
                }

                var content = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<YahooHistoryResponseDto>(content, _jsonOptions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting history for symbol: {Symbol}", symbol);
                return null;
            }
        }

        public async Task<List<StockNews>> GetNewsAsync(string? symbol, int limit, int offset)
        {
            try
            {
                // Build the new URL with query parameters - symbol is required, not optional
                var url = $"https://yahoo-finance15.p.rapidapi.com/api/v2/markets/news?tickers={symbol}&type=ALL";

                // Create HttpRequestMessage with manual headers
                using var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Add("x-rapidapi-key", "01207e2cb8msh4b75aa4c2667ea4p1f2a3djsn30f71919bb7a");
                request.Headers.Add("x-rapidapi-host", "yahoo-finance15.p.rapidapi.com");

                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Failed to get news. Status: {Status}", response.StatusCode);
                    return new List<StockNews>();
                }

                var content = await response.Content.ReadAsStringAsync();
                var newsResponse = JsonSerializer.Deserialize<YahooNewsResponseDto>(content, _jsonOptions);

                return newsResponse?.Items?.Select(item => new StockNews
                {
                    Title = item.Title ?? "",
                    Summary = item.Summary ?? "",
                    Url = item.Link ?? "",
                    Source = item.Publisher ?? "",
                    PublishedAt = DateTimeOffset.FromUnixTimeSeconds(item.ProviderPublishTime ?? 0).DateTime,
                    ImageUrl = item.Thumbnail?.Resolutions?.FirstOrDefault()?.Url ?? "",
                    RelatedSymbols = item.RelatedTickers ?? new List<string>()
                }).ToList() ?? new List<StockNews>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting news for symbol: {Symbol}", symbol);
                return new List<StockNews>();
            }
        }
    }

    public class YahooSearchResponseDto
    {
        public List<YahooSearchQuoteDto> Quotes { get; set; } = new();
    }

    public class YahooSearchQuoteDto
    {
        public string? Symbol { get; set; }
        public string? ShortName { get; set; }
        public string? LongName { get; set; }
        public string? Exchange { get; set; }
        public string? QuoteType { get; set; }
        public string? Region { get; set; }
    }

    public class YahooNewsResponseDto
    {
        public List<YahooNewsItemDto> Items { get; set; } = new();
    }

    public class YahooNewsItemDto
    {
        public string? Title { get; set; }
        public string? Summary { get; set; }
        public string? Link { get; set; }
        public string? Publisher { get; set; }
        public long? ProviderPublishTime { get; set; }
        public YahooNewsThumbnailDto? Thumbnail { get; set; }
        public List<string> RelatedTickers { get; set; } = new();
    }

    public class YahooNewsThumbnailDto
    {
        public List<YahooNewsImageDto> Resolutions { get; set; } = new();
    }

    public class YahooNewsImageDto
    {
        public string? Url { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
    }
}

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
        public async Task<List<StockNews>> GetNewsAsync(string symbol)
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

                // Map from new DTO structure to StockNews
                return newsResponse?.Body?.Select(item => new StockNews
                {
                    Title = item.Title ?? "",
                    Summary = item.Text ?? "",
                    Url = item.Url ?? "",
                    Source = item.Source ?? "",
                    PublishedAt = ParseTimeToDateTime(item.Time, item.Ago),
                    ImageUrl = item.Img ?? "",
                    RelatedSymbols = item.Tickers ?? new List<string>()
                }).ToList() ?? new List<StockNews>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting news for symbol: {Symbol}", symbol);
                return new List<StockNews>();
            }
        }

        private DateTime ParseTimeToDateTime(string? time, string? ago)
        {
            // Handle the time parsing based on the format you receive
            // This is a basic implementation - you may need to adjust based on actual format
            if (!string.IsNullOrEmpty(time))
            {
                // Try to parse the time string directly
                if (DateTime.TryParse(time, out var parsedTime))
                {
                    return parsedTime;
                }
            }

            // If time parsing fails, try to use 'ago' field to calculate approximate time
            if (!string.IsNullOrEmpty(ago))
            {
                // Parse strings like "2 hours ago", "1 day ago", etc.
                // This is a simplified implementation - adjust based on actual format
                var now = DateTime.UtcNow;
                if (ago.Contains("hour"))
                {
                    var hours = ExtractNumber(ago);
                    return now.AddHours(-hours);
                }
                if (ago.Contains("day"))
                {
                    var days = ExtractNumber(ago);
                    return now.AddDays(-days);
                }
                if (ago.Contains("minute"))
                {
                    var minutes = ExtractNumber(ago);
                    return now.AddMinutes(-minutes);
                }
            }

            // Default to current time if parsing fails
            return DateTime.UtcNow;
        }

        private int ExtractNumber(string text)
        {
            var match = System.Text.RegularExpressions.Regex.Match(text, @"\d+");
            return match.Success ? int.Parse(match.Value) : 0;
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
        public MetaData? Meta { get; set; }
        public List<NewsItem>? Body { get; set; }
    }

    public class MetaData
    {
        public string? Version { get; set; }
        public int Status { get; set; }
        public string? Copywrite { get; set; }
        public int Total { get; set; }
    }

    public class NewsItem
    {
        public string? Url { get; set; }
        public string? Img { get; set; }
        public string? Title { get; set; }
        public string? Text { get; set; }
        public string? Source { get; set; }
        public string? Type { get; set; }
        public List<string>? Tickers { get; set; }
        public string? Time { get; set; }
        public string? Ago { get; set; }
    }
}

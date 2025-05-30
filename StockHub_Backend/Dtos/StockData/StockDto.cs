using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using System.ComponentModel.DataAnnotations;

namespace StockHub_Backend.Dtos.StockData
{
    public class StockQuoteDto
    {
        public string Symbol { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public decimal CurrentPrice { get; set; }
        public decimal Change { get; set; }
        public decimal ChangePercent { get; set; }
        public DateTime LastUpdated { get; set; }
        public string Currency { get; set; } = "USD";
        public long Volume { get; set; }
        public decimal DayHigh { get; set; }
        public decimal DayLow { get; set; }
        public decimal Open { get; set; }
        public decimal PreviousClose { get; set; }
        public decimal MarketCap { get; set; }
        public decimal PeRatio { get; set; }
    }

    public class StockHistoryDto
    {
        public string Symbol { get; set; } = string.Empty;
        public List<StockDataPointDto> DataPoints { get; set; } = new();
        public string Range { get; set; } = string.Empty;
    }

    public class StockDataPointDto
    {
        public DateTime Date { get; set; }
        public decimal Open { get; set; }
        public decimal High { get; set; }
        public decimal Low { get; set; }
        public decimal Close { get; set; }
        public decimal AdjustedClose { get; set; }
        public long Volume { get; set; }
    }

    public class StockNewsDto
    {
        public string Title { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
        public DateTime PublishedAt { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public List<string> RelatedSymbols { get; set; } = new();
    }

    public class StockSearchResultDto
    {
        public string Symbol { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string Exchange { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
    }

    public class StockSearchRequestDto
    {
        [Required]
        [MinLength(1)]
        public string Query { get; set; } = string.Empty;
        public int Limit { get; set; } = 10;
    }

    public class StockPricesRequestDto
    {
        [Required]
        public List<string> Symbols { get; set; } = new();
    }

    public class StockHistoryRequestDto
    {
        [Required]
        public string Symbol { get; set; } = string.Empty;
        
        [Required]
        public string Range { get; set; } = "1mo"; // 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
        
        public string Interval { get; set; } = "1d"; // 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo
    }

    public class StockNewsRequestDto
    {
        public string? Symbol { get; set; }
        public int Limit { get; set; } = 20;
        public int Offset { get; set; } = 0;
    }

    // Yahoo Finance API Response DTOs
    public class YahooQuoteResponseDto
    {
        public QuoteResponseData QuoteResponse { get; set; } = new();
    }

    public class QuoteResponseData
    {
        public List<YahooQuoteResultDto> Result { get; set; } = new();
        public object? Error { get; set; }
    }

    public class YahooQuoteResultDto
    {
        public string Symbol { get; set; } = string.Empty;
        public string ShortName { get; set; } = string.Empty;
        public decimal? RegularMarketPrice { get; set; }
        public decimal? RegularMarketChange { get; set; }
        public decimal? RegularMarketChangePercent { get; set; }
        public long? RegularMarketTime { get; set; }
        public string Currency { get; set; } = "USD";
        public long? RegularMarketVolume { get; set; }
        public decimal? RegularMarketDayHigh { get; set; }
        public decimal? RegularMarketDayLow { get; set; }
        public decimal? RegularMarketOpen { get; set; }
        public decimal? RegularMarketPreviousClose { get; set; }
        public long? MarketCap { get; set; }
        public decimal? TrailingPE { get; set; }
    }

    public class YahooHistoryResponseDto
    {
        public ChartData Chart { get; set; } = new();
    }

    public class ChartData
    {
        public List<ChartResult> Result { get; set; } = new();
        public object? Error { get; set; }
    }

    public class ChartResult
    {
        public List<long> Timestamp { get; set; } = new();
        public IndicatorsData Indicators { get; set; } = new();
    }

    public class IndicatorsData
    {
        public List<QuoteData> Quote { get; set; } = new();
        public List<AdjCloseData> Adjclose { get; set; } = new();
    }

    public class QuoteData
    {
        public List<decimal?> Open { get; set; } = new();
        public List<decimal?> High { get; set; } = new();
        public List<decimal?> Low { get; set; } = new();
        public List<decimal?> Close { get; set; } = new();
        public List<long?> Volume { get; set; } = new();
    }

    public class AdjCloseData
    {
        public List<decimal?> Adjclose { get; set; } = new();
    }
}
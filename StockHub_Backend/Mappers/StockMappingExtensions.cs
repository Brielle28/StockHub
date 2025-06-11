using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using StockHub_Backend.Models;
using StockHub_Backend.Dtos.StockData;

namespace StockHub_Backend.Mappers
{
    public static class StockMappingExtensions
    {
        public static StockQuoteDto ToDto(this StockQuote stockQuote)
        {
            return new StockQuoteDto
            {
                Symbol = stockQuote.Symbol,
                CompanyName = stockQuote.CompanyName,
                CurrentPrice = stockQuote.CurrentPrice,
                Change = stockQuote.Change,
                ChangePercent = stockQuote.ChangePercent,
                LastUpdated = stockQuote.LastUpdated,
                Currency = stockQuote.Currency,
                Volume = stockQuote.Volume,
                DayHigh = stockQuote.DayHigh,
                DayLow = stockQuote.DayLow,
                Open = stockQuote.Open,
                PreviousClose = stockQuote.PreviousClose,
                MarketCap = stockQuote.MarketCap,
                PeRatio = stockQuote.PeRatio
            };
        }

        public static StockHistoryDto ToDto(this StockHistory stockHistory)
        {
            return new StockHistoryDto
            {
                Symbol = stockHistory.Symbol,
                Range = stockHistory.Range,
                DataPoints = stockHistory.DataPoints.Select(dp => dp.ToDto()).ToList()
            };
        }

        public static StockDataPointDto ToDto(this StockDataPoint dataPoint)
        {
            return new StockDataPointDto
            {
                Date = dataPoint.Date,
                Open = dataPoint.Open,
                High = dataPoint.High,
                Low = dataPoint.Low,
                Close = dataPoint.Close,
                AdjustedClose = dataPoint.AdjustedClose,
                Volume = dataPoint.Volume
            };
        }

        public static StockNewsDto ToDto(this StockNews stockNews)
        {
            return new StockNewsDto
            {
                Title = stockNews.Title,
                Summary = stockNews.Summary,
                Url = stockNews.Url,
                Source = stockNews.Source,
                PublishedAt = stockNews.PublishedAt,
                ImageUrl = stockNews.ImageUrl,
                RelatedSymbols = stockNews.RelatedSymbols
            };
        }

        public static StockSearchResultDto ToDto(this StockSearchResult searchResult)
        {
            return new StockSearchResultDto
            {
                Symbol = searchResult.Symbol,
                CompanyName = searchResult.CompanyName,
                Exchange = searchResult.Exchange,
                Type = searchResult.Type,
                Region = searchResult.Region
            };
        }

        public static StockQuote FromYahooQuote(this YahooQuoteResultDto yahooQuote)
        {
            return new StockQuote
            {
                Symbol = yahooQuote.Symbol,
                CompanyName = yahooQuote.ShortName,
                CurrentPrice = yahooQuote.RegularMarketPrice ?? 0,
                Change = yahooQuote.RegularMarketChange ?? 0,
                ChangePercent = yahooQuote.RegularMarketChangePercent ?? 0,
                LastUpdated = yahooQuote.RegularMarketTime.HasValue
                    ? DateTimeOffset.FromUnixTimeSeconds(yahooQuote.RegularMarketTime.Value).DateTime
                    : DateTime.UtcNow,
                Currency = yahooQuote.Currency,
                Volume = yahooQuote.RegularMarketVolume ?? 0,
                DayHigh = yahooQuote.RegularMarketDayHigh ?? 0,
                DayLow = yahooQuote.RegularMarketDayLow ?? 0,
                Open = yahooQuote.RegularMarketOpen ?? 0,
                PreviousClose = yahooQuote.RegularMarketPreviousClose ?? 0,
                MarketCap = yahooQuote.MarketCap ?? 0,
                PeRatio = yahooQuote.TrailingPE ?? 0
            };
        }

        public static KafkaStockMessage ToKafkaMessage(this StockQuote stockQuote)
        {
            return new KafkaStockMessage
            {
                Symbol = stockQuote.Symbol,
                Price = stockQuote.CurrentPrice,
                Change = stockQuote.Change,
                ChangePercent = stockQuote.ChangePercent,
                Timestamp = stockQuote.LastUpdated,
                Volume = stockQuote.Volume
            };
        }

        public static List<StockDataPoint> FromYahooHistory(this YahooHistoryResponseDto yahooResponse)
        {
            var dataPoints = new List<StockDataPoint>();

            if (yahooResponse?.Body == null || !yahooResponse.Body.Any())
                return dataPoints;

            foreach (var kvp in yahooResponse.Body)
            {
                var dataPoint = kvp.Value;

                // Parse the date string - assuming it's in a standard format
                if (!DateTime.TryParse(dataPoint.Date, out var parsedDate))
                {
                    // Fallback to UTC timestamp if date string parsing fails
                    parsedDate = DateTimeOffset.FromUnixTimeSeconds(dataPoint.Date_Utc).DateTime;
                }

                var stockDataPoint = new StockDataPoint
                {
                    Date = parsedDate,
                    Open = dataPoint.Open,
                    High = dataPoint.High,
                    Low = dataPoint.Low,
                    Close = dataPoint.Close,
                    Volume = dataPoint.Volume,
                    AdjustedClose = dataPoint.Adjclose
                };

                dataPoints.Add(stockDataPoint);
            }

            // Sort by date to ensure chronological order
            return dataPoints.OrderBy(dp => dp.Date).ToList();
        }

        // Alternative method if you want to access the metadata as well
        public static (List<StockDataPoint> DataPoints, YahooHistoryMeta Metadata) FromYahooHistoryWithMeta(this YahooHistoryResponseDto yahooResponse)
        {
            var dataPoints = yahooResponse.FromYahooHistory();
            return (dataPoints, yahooResponse?.Meta ?? new YahooHistoryMeta());
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Mappers;
using StockHub_Backend.Models;

namespace StockHub_Backend.Services.PortfolioStockPriceUpdateService
{
    public class PortfolioStockPriceUpdateService : IPortfolioStockPriceUpdateService
    {
        private readonly IPortfolioRepository _portfolioRepository;
        private readonly IYahooFinanceApiService _yahooApiService;
        private readonly IKafkaProducerService _kafkaProducer;
        private readonly ILogger<PortfolioStockPriceUpdateService> _logger;

        public PortfolioStockPriceUpdateService(
            IPortfolioRepository portfolioRepository,
            IYahooFinanceApiService yahooApiService,
            IKafkaProducerService kafkaProducer,
            ILogger<PortfolioStockPriceUpdateService> logger)
        {
            _portfolioRepository = portfolioRepository;
            _yahooApiService = yahooApiService;
            _kafkaProducer = kafkaProducer;
            _logger = logger;
        }

        public async Task UpdateAllPortfolioStockPricesAsync()
        {
            try
            {
                // Step 1: Get all unique stock symbols from all portfolios
                var symbols = await _portfolioRepository.GetAllPortfolioStockSymbolsAsync();
                
                if (!symbols.Any())
                {
                    _logger.LogInformation("No portfolio stocks found to update");
                    return;
                }

                _logger.LogInformation("Updating prices for {Count} unique symbols", symbols.Count);

                // Step 2: Fetch latest quotes from Yahoo Finance
                var response = await _yahooApiService.GetQuotesAsync(symbols);
                
                if (response?.QuoteResponse?.Result == null || !response.QuoteResponse.Result.Any())
                {
                    _logger.LogWarning("No quote data received from Yahoo Finance API");
                    return;
                }

                // Step 3: Convert to stock quotes
                var stockQuotes = response.QuoteResponse.Result
                    .Select(q => q.FromYahooQuote())
                    .ToList();

                // Step 4: Get all portfolio stocks to update
                var portfolioStocks = await _portfolioRepository.GetAllPortfolioStocksAsync();

                // Step 5: Create price updates
                var priceUpdates = new List<PortfolioStockPriceUpdate>();
                var kafkaMessages = new List<KafkaStockMessage>();

                foreach (var portfolioStock in portfolioStocks)
                {
                    var quote = stockQuotes.FirstOrDefault(q => q.Symbol == portfolioStock.Symbol);
                    if (quote != null)
                    {
                        priceUpdates.Add(new PortfolioStockPriceUpdate
                        {
                            PortfolioStockId = portfolioStock.Id,
                            Symbol = quote.Symbol,
                            CurrentPrice = quote.CurrentPrice,
                            Change = quote.Change,
                            ChangePercent = quote.ChangePercent,
                            LastUpdated = DateTime.UtcNow
                        });

                        kafkaMessages.Add(quote.ToKafkaMessage());
                    }
                }

                // Step 6: Update database
                if (priceUpdates.Any())
                {
                    await _portfolioRepository.UpdatePortfolioStockPricesAsync(priceUpdates);
                    _logger.LogInformation("Updated {Count} portfolio stock prices in database", priceUpdates.Count);

                    // Step 7: Publish to Kafka for real-time updates
                    await _kafkaProducer.PublishStockPriceUpdatesAsync(kafkaMessages);
                    _logger.LogInformation("Published {Count} price updates to Kafka", kafkaMessages.Count);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating portfolio stock prices");
                throw;
            }
        }
    }
}
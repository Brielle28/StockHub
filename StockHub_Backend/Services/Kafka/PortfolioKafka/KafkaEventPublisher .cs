// using System;
// using System.Text.Json;
// using System.Threading;
// using System.Threading.Tasks;
// using Confluent.Kafka;
// using Microsoft.Extensions.Configuration;
// using Microsoft.Extensions.Hosting;
// using Microsoft.Extensions.Logging;
// using StockHub_Backend.DTOs;
// using StockHub_Backend.DTOs.Portfolio;
// using StockHub_Backend.Interfaces;

// namespace StockHub_Backend.Services
// {
//     public class KafkaEventPublisher : IEventPublisher
//     {
//         private readonly IProducer<string, string> _producer;
//         private readonly ILogger<KafkaEventPublisher> _logger;
//         private readonly string _stockPricesTopic;
//         private readonly string _portfolioChangesTopic;
//         private readonly string _portfolioStockChangesTopic;

//         public KafkaEventPublisher(IConfiguration configuration, ILogger<KafkaEventPublisher> logger)
//         {
//             _logger = logger;

//             var producerConfig = new ProducerConfig
//             {
//                 BootstrapServers = configuration["Kafka:BootstrapServers"],
//                 ClientId = configuration["Kafka:ClientId"]
//             };

//             _producer = new ProducerBuilder<string, string>(producerConfig).Build();

//             _stockPricesTopic = configuration["Kafka:Topics:StockPrices"];
//             _portfolioChangesTopic = configuration["Kafka:Topics:PortfolioChanges"];
//             _portfolioStockChangesTopic = configuration["Kafka:Topics:PortfolioStockChanges"];
//         }

//         public async Task PublishStockPriceUpdate(StockPriceUpdateEvent eventData)
//         {
//             try
//             {
//                 string key = eventData.Symbol;
//                 string value = JsonSerializer.Serialize(eventData);

//                 await _producer.ProduceAsync(_stockPricesTopic, new Message<string, string>
//                 {
//                     Key = key,
//                     Value = value
//                 });

//                 _logger.LogInformation("Published stock price update for {Symbol} to Kafka", eventData.Symbol);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error publishing stock price update to Kafka for {Symbol}", eventData.Symbol);
//             }
//         }

//         public async Task PublishPortfolioChange(PortfolioChangeEvent eventData)
//         {
//             try
//             {
//                 string key = $"{eventData.UserId}:{eventData.PortfolioId}";
//                 string value = JsonSerializer.Serialize(eventData);

//                 await _producer.ProduceAsync(_portfolioChangesTopic, new Message<string, string>
//                 {
//                     Key = key,
//                     Value = value
//                 });

//                 _logger.LogInformation("Published portfolio change event for portfolio {PortfolioId} to Kafka", eventData.PortfolioId);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error publishing portfolio change event to Kafka for portfolio {PortfolioId}", eventData.PortfolioId);
//             }
//         }

//         public async Task PublishPortfolioStockChange(PortfolioStockChangeEvent eventData)
//         {
//             try
//             {
//                 string key = $"{eventData.UserId}:{eventData.PortfolioId}:{eventData.StockId}";
//                 string value = JsonSerializer.Serialize(eventData);

//                 await _producer.ProduceAsync(_portfolioStockChangesTopic, new Message<string, string>
//                 {
//                     Key = key,
//                     Value = value
//                 });

//                 _logger.LogInformation("Published portfolio stock change event for {Symbol} in portfolio {PortfolioId} to Kafka",
//                     eventData.Symbol, eventData.PortfolioId);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error publishing portfolio stock change event to Kafka for {Symbol} in portfolio {PortfolioId}",
//                     eventData.Symbol, eventData.PortfolioId);
//             }
//         }
//     }

//     // Background service to consume stock price updates from Kafka
//     public class StockPriceConsumerService : BackgroundService
//     {
//         private readonly IConsumer<string, string> _consumer;
//         private readonly IStockRepository _stockRepository;
//         private readonly ILogger<StockPriceConsumerService> _logger;
//         private readonly string _stockPricesTopic;

//         public StockPriceConsumerService(
//             IConfiguration configuration,
//             IStockRepository stockRepository,
//             ILogger<StockPriceConsumerService> logger)
//         {
//             _logger = logger;
//             _stockRepository = stockRepository;

//             var consumerConfig = new ConsumerConfig
//             {
//                 BootstrapServers = configuration["Kafka:BootstrapServers"],
//                 GroupId = configuration["Kafka:ConsumerGroups:StockPrices"],
//                 AutoOffsetReset = AutoOffsetReset.Latest,
//                 EnableAutoCommit = true
//             };

//             _consumer = new ConsumerBuilder<string, string>(consumerConfig).Build();
//             _stockPricesTopic = configuration["Kafka:Topics:StockPrices"];
//         }

//         protected override async Task ExecuteAsync(CancellationToken stoppingToken)
//         {
//             _consumer.Subscribe(_stockPricesTopic);

//             _logger.LogInformation("Stock price consumer started, listening on topic: {Topic}", _stockPricesTopic);

//             try
//             {
//                 while (!stoppingToken.IsCancellationRequested)
//                 {
//                     try
//                     {
//                         var consumeResult = _consumer.Consume(stoppingToken);

//                         if (consumeResult != null)
//                         {
//                             var priceUpdate = JsonSerializer.Deserialize<StockPriceUpdateEvent>(consumeResult.Message.Value);

//                             _logger.LogInformation("Received stock price update for {Symbol}: {Price}",
//                                 priceUpdate.Symbol, priceUpdate.Price);

//                             // Update the stock price in the database
//                             await _stockRepository.UpdateStockPriceAsync(
//                                 priceUpdate.Symbol,
//                                 priceUpdate.Price,
//                                 priceUpdate.PreviousClose);
//                         }
//                     }
//                     catch (ConsumeException ex)
//                     {
//                         _logger.LogError(ex, "Error consuming stock price update from Kafka");
//                     }
//                 }
//             }
//             catch (OperationCanceledException)
//             {
//                 // Graceful shutdown
//                 _logger.LogInformation("Stock price consumer stopping");
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Unexpected error in stock price consumer");
//             }
//             finally
//             {
//                 _consumer.Close();
//             }
//         }

//         public override void Dispose()
//         {
//             _consumer?.Dispose();
//             base.Dispose();
//         }
//     }
// }
using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Confluent.Kafka;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StockHub_Backend.DTOs;
using StockHub_Backend.DTOs.Portfolio;
using StockHub_Backend.Interfaces;

namespace StockHub_Backend.Services.Kafka.PortfolioKafka
{
    public class KafkaEventPublisher : IEventPublisher
    {
        private readonly IProducer<string, string> _producer;
        private readonly ILogger<KafkaEventPublisher> _logger;
        private readonly string _stockPricesTopic;
        private readonly string _portfolioChangesTopic;
        private readonly string _portfolioStockChangesTopic;

        public KafkaEventPublisher(IConfiguration configuration, ILogger<KafkaEventPublisher> logger)
        {
            _logger = logger;

            var producerConfig = new ProducerConfig
            {
                BootstrapServers = configuration["Kafka:BootstrapServers"] ?? "localhost:9092",
                ClientId = configuration["Kafka:ClientId"] ?? "stockhub-producer"
            };

            _producer = new ProducerBuilder<string, string>(producerConfig).Build();

            _stockPricesTopic = configuration["Kafka:Topics:StockPrices"] ?? "stock-prices";
            _portfolioChangesTopic = configuration["Kafka:Topics:PortfolioChanges"] ?? "portfolio-changes";
            _portfolioStockChangesTopic = configuration["Kafka:Topics:PortfolioStockChanges"] ?? "portfolio-stock-changes";
        }

        public async Task PublishStockPriceUpdate(StockPriceUpdateEvent eventData)
        {
            try
            {
                string key = eventData.Symbol;
                string value = JsonSerializer.Serialize(eventData);

                await _producer.ProduceAsync(_stockPricesTopic, new Message<string, string>
                {
                    Key = key,
                    Value = value
                });

                _logger.LogInformation("Published stock price update for {Symbol} to Kafka", eventData.Symbol);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error publishing stock price update to Kafka for {Symbol}", eventData.Symbol);
            }
        }

        public async Task PublishPortfolioChange(PortfolioChangeEvent eventData)
        {
            try
            {
                string key = $"{eventData.UserId}:{eventData.PortfolioId}";
                string value = JsonSerializer.Serialize(eventData);

                await _producer.ProduceAsync(_portfolioChangesTopic, new Message<string, string>
                {
                    Key = key,
                    Value = value
                });

                _logger.LogInformation("Published portfolio change event for portfolio {PortfolioId} to Kafka", eventData.PortfolioId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error publishing portfolio change event to Kafka for portfolio {PortfolioId}", eventData.PortfolioId);
            }
        }

        public async Task PublishPortfolioStockChange(PortfolioStockChangeEvent eventData)
        {
            try
            {
                string key = $"{eventData.UserId}:{eventData.PortfolioId}:{eventData.Symbol}";
                string value = JsonSerializer.Serialize(eventData);

                await _producer.ProduceAsync(_portfolioStockChangesTopic, new Message<string, string>
                {
                    Key = key,
                    Value = value
                });

                _logger.LogInformation("Published portfolio stock change event for {Symbol} in portfolio {PortfolioId} to Kafka",
                    eventData.Symbol, eventData.PortfolioId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error publishing portfolio stock change event to Kafka for {Symbol} in portfolio {PortfolioId}",
                    eventData.Symbol, eventData.PortfolioId);
            }
        }

        public void Dispose()
        {
            _producer?.Dispose();
        }
    }

    // Background service to consume stock price updates from Kafka
    public class StockPriceConsumerService : BackgroundService
    {
        private readonly IConsumer<string, string> _consumer;
        private readonly IStockRepository _stockRepository;
        private readonly ILogger<StockPriceConsumerService> _logger;
        private readonly string _stockPricesTopic;

        public StockPriceConsumerService(
            IConfiguration configuration,
            IStockRepository stockRepository,
            ILogger<StockPriceConsumerService> logger)
        {
            _logger = logger;
            _stockRepository = stockRepository;

            var consumerConfig = new ConsumerConfig
            {
                BootstrapServers = configuration["Kafka:BootstrapServers"] ?? "localhost:9092",
                GroupId = configuration["Kafka:ConsumerGroups:StockPrices"] ?? "stock-price-consumers",
                AutoOffsetReset = AutoOffsetReset.Latest,
                EnableAutoCommit = true
            };

            _consumer = new ConsumerBuilder<string, string>(consumerConfig).Build();
            _stockPricesTopic = configuration["Kafka:Topics:StockPrices"] ?? "stock-prices";
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _consumer.Subscribe(_stockPricesTopic);

            _logger.LogInformation("Stock price consumer started, listening on topic: {Topic}", _stockPricesTopic);

            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    try
                    {
                        var consumeResult = _consumer.Consume(stoppingToken);

                        if (consumeResult != null)
                        {
                            var priceUpdate = JsonSerializer.Deserialize<StockPriceUpdateEvent>(consumeResult.Message.Value);

                            if (priceUpdate != null)
                            {
                                _logger.LogInformation("Received stock price update for {Symbol}: {Price}",
                                    priceUpdate.Symbol, priceUpdate.Price);

                                // Update the stock price in the database
                                await _stockRepository.UpdateStockPriceAsync(
                                    priceUpdate.Symbol,
                                    priceUpdate.Price,
                                    priceUpdate.PreviousClose);
                            }
                        }
                    }
                    catch (ConsumeException ex)
                    {
                        _logger.LogError(ex, "Error consuming stock price update from Kafka");
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Error deserializing stock price update message");
                    }
                }
            }
            catch (OperationCanceledException)
            {
                // Graceful shutdown
                _logger.LogInformation("Stock price consumer stopping");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in stock price consumer");
            }
            finally
            {
                _consumer.Close();
            }
        }

        public override void Dispose()
        {
            _consumer?.Dispose();
            base.Dispose();
        }
    }
}
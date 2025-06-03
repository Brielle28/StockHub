using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Confluent.Kafka;
using System.Text.Json;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Models;

namespace StockHub_Backend.Services.Kafka.YahooStockData
{ 
    public class KafkaProducerService : IKafkaProducerService, IDisposable
    {
        private readonly IProducer<string, string> _producer;
        private readonly ILogger<KafkaProducerService> _logger;
        private readonly string _topicName;
        private readonly JsonSerializerOptions _jsonOptions;

        public KafkaProducerService(IConfiguration configuration, ILogger<KafkaProducerService> logger)
        {
            _logger = logger;
            _topicName = configuration["Kafka:Topics:YahooStockPrices"] ?? "yahoo-stock-prices";

            var config = new ProducerConfig
            {
                BootstrapServers = configuration["Kafka:BootstrapServers"] ?? "localhost:9092",
                ClientId = configuration["Kafka:ClientId"] ?? "StockHub",
                EnableIdempotence = true,
                MessageSendMaxRetries = 3,
                RetryBackoffMs = 1000,
                RequestTimeoutMs = 30000,
                MessageTimeoutMs = 60000
            };

            _producer = new ProducerBuilder<string, string>(config)
                .SetErrorHandler((_, e) => _logger.LogError("Kafka producer error: {Error}", e.Reason))
                .Build();

            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
        }

        public async Task PublishStockPriceUpdateAsync(KafkaStockMessage message)
        {
            try
            {
                var jsonMessage = JsonSerializer.Serialize(message, _jsonOptions);
                var kafkaMessage = new Message<string, string>
                {
                    Key = message.Symbol,
                    Value = jsonMessage,
                    Timestamp = new Timestamp(message.Timestamp)
                };

                var deliveryResult = await _producer.ProduceAsync(_topicName, kafkaMessage);
                
                _logger.LogInformation("Message delivered to {Topic} partition {Partition} at offset {Offset} for symbol {Symbol}",
                    deliveryResult.Topic, deliveryResult.Partition, deliveryResult.Offset, message.Symbol);
            }
            catch (ProduceException<string, string> ex)
            {
                _logger.LogError(ex, "Failed to deliver message for symbol {Symbol}: {Error}", 
                    message.Symbol, ex.Error.Reason);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error publishing message for symbol {Symbol}", message.Symbol);
                throw;
            }
        }

        public async Task PublishStockPriceUpdatesAsync(List<KafkaStockMessage> messages)
        {
            if (!messages.Any())
                return;

            var tasks = messages.Select(PublishStockPriceUpdateAsync);
            
            try
            {
                await Task.WhenAll(tasks);
                _logger.LogInformation("Successfully published {Count} stock price updates", messages.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error publishing batch of {Count} stock price updates", messages.Count);
                throw;
            }
        }

        public void Dispose()
        {
            try
            {
                _producer?.Flush(TimeSpan.FromSeconds(10));
                _producer?.Dispose();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error disposing Kafka producer");
            }
        }
    }
}
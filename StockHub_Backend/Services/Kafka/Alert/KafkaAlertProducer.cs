using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Confluent.Kafka;
using System.Text.Json;
using StockHub_Backend.Dtos.Alert;
namespace StockHub_Backend.Services.Kafka.Alert
{
    // Kafka/KafkaProducer.cs
    public class KafkaAlertProducer : IKafkaAlertProducer, IDisposable
    {
        private readonly IProducer<string, string> _producer;
        private readonly ILogger<KafkaProducer> _logger;
        private readonly string _alertsTopic;

        public KafkaAlertProducer(IConfiguration configuration, ILogger<KafkaProducer> logger)
        {
            _logger = logger;
            _alertsTopic = configuration.GetValue<string>("Kafka:Topics:AlertsTriggeredTopic") ?? "alerts-triggered";
            // _alertsTopic = configuration.GetValue<string>("Kafka:AlertsTriggeredTopic", "alerts-triggered") ?? "alerts-triggered";

            var config = new ProducerConfig
            {
                BootstrapServers = configuration.GetValue<string>("Kafka:BootstrapServers", "localhost:9092"),
                ClientId = "stockhub-alerts-producer"
            };

            _producer = new ProducerBuilder<string, string>(config).Build();
        }

        public async Task PublishAlertTriggeredAsync(AlertTriggeredDTO alertTriggered)
        {
            try
            {
                var message = JsonSerializer.Serialize(alertTriggered);
                var kafkaMessage = new Message<string, string>
                {
                    Key = alertTriggered.UserId,
                    Value = message
                };

                var result = await _producer.ProduceAsync(_alertsTopic, kafkaMessage);
                _logger.LogDebug("Alert triggered message published to Kafka: {Topic}, {Partition}, {Offset}",
                    result.Topic, result.Partition, result.Offset);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to publish alert triggered message for alert {AlertId}", alertTriggered.AlertId);
                throw;
            }
        }

        public void Dispose()
        {
            _producer?.Dispose();
        }
    }
}
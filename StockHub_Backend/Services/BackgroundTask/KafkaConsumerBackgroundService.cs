using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockHub_Backend.Services.Kafka.Alert;

namespace StockHub_Backend.Services.BackgroundTask
{
    public class KafkaConsumerBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<KafkaConsumerBackgroundService> _logger;
        private readonly IConfiguration _configuration;

        public KafkaConsumerBackgroundService(
            IServiceProvider serviceProvider,
            ILogger<KafkaConsumerBackgroundService> logger,
            IConfiguration configuration)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _configuration = configuration;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var enableKafkaConsumer = _configuration.GetValue<bool>("Kafka:EnableConsumer", true);

            if (!enableKafkaConsumer)
            {
                _logger.LogInformation("Kafka Consumer Background Service is disabled via configuration");
                return;
            }

            _logger.LogInformation("Kafka Consumer Background Service started");

            try
            {
                using var scope = _serviceProvider.CreateScope();
                var kafkaConsumer = scope.ServiceProvider.GetRequiredService<IKafkaAlertConsumer>();
                await kafkaConsumer.StartConsumingAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Kafka Consumer Background Service");
            }
        }
    }
}
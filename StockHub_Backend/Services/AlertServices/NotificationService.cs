using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using StockHub_Backend.Dtos.Alert;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Services.HubSignalR;
using StockHub_Backend.Services.Kafka.Alert;
namespace StockHub_Backend.Services.Alert
{
        public class NotificationService : INotificationService
    {
        private readonly IHubContext<AlertsHub> _hubContext;
        private readonly IKafkaAlertProducer _kafkaProducer;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(
            IHubContext<AlertsHub> hubContext,
            IKafkaAlertProducer kafkaProducer,
            ILogger<NotificationService> logger)
        {
            _hubContext = hubContext;
            _kafkaProducer = kafkaProducer;
            _logger = logger;
        }

        public async Task SendAlertNotificationAsync(AlertTriggeredDTO alertTriggered)
        {
            try
            {
                // Send SignalR notification to the specific user
                await _hubContext.Clients.Group($"User_{alertTriggered.UserId}")
                    .SendAsync("AlertTriggered", alertTriggered);

                _logger.LogInformation("Alert notification sent to user {UserId} for symbol {Symbol}",
                    alertTriggered.UserId, alertTriggered.Symbol);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending alert notification to user {UserId}", alertTriggered.UserId);
            }
        }

        public async Task ProcessTriggeredAlertAsync(AlertTriggeredDTO alertTriggered)
        {
            try
            {
                // Publish to Kafka for further processing
                await _kafkaProducer.PublishAlertTriggeredAsync(alertTriggered);

                _logger.LogInformation("Alert triggered and published to Kafka for user {UserId}, symbol {Symbol}",
                    alertTriggered.UserId, alertTriggered.Symbol);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing triggered alert for user {UserId}", alertTriggered.UserId);
                
                // Fallback: Send notification directly if Kafka fails
                await SendAlertNotificationAsync(alertTriggered);
            }
        }
    }

}
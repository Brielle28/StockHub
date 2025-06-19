// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text.Json;
// using System.Threading.Tasks;
// using Confluent.Kafka;
// using StockHub_Backend.DTOs;
// using StockHub_Backend.Interfaces;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.SignalR;
// using StockHub_Backend.Dtos.Alert;

// namespace StockHub_Backend.Services.Kafka.Alert
// {
//     public class KafkaAlertConsumer : IKafkaAlertConsumer, IDisposable
//     {
//         private readonly IConsumer<string, string> _consumer;
//         private readonly IServiceProvider _serviceProvider;
//         private readonly ILogger<KafkaAlertConsumer> _logger;
//         private readonly string _alertsTopic;

//         public KafkaAlertConsumer(IConfiguration configuration, IServiceProvider serviceProvider, ILogger<KafkaAlertConsumer> logger)
//         {
//             _serviceProvider = serviceProvider;
//             _logger = logger;

//             // Use the correct configuration path for alerts topic
//             _alertsTopic = configuration.GetValue<string>("Kafka:Topics:AlertsTriggeredTopic") ?? "alerts-triggered";

//             var config = new ConsumerConfig
//             {
//                 // Use the correct configuration path for consumer group
//                 GroupId = configuration.GetValue<string>("Kafka:ConsumerGroups:AlertsTriggeredTopic") ?? "alerts-triggered-consumer",
//                 BootstrapServers = configuration.GetValue<string>("Kafka:BootstrapServers") ?? "localhost:9092",
//                 ClientId = configuration.GetValue<string>("Kafka:ClientId") ?? "StockHub",
//                 AutoOffsetReset = AutoOffsetReset.Earliest,
//                 EnableAutoCommit = false, // Manual commit for better control
//                 SessionTimeoutMs = 30000,
//                 HeartbeatIntervalMs = 10000,
//                 MaxPollIntervalMs = 300000
//             };

//             _consumer = new ConsumerBuilder<string, string>(config)
//                 .SetErrorHandler((_, e) => _logger.LogError("Kafka consumer error: {Error}", e.Reason))
//                 .SetPartitionsAssignedHandler((c, partitions) =>
//                 {
//                     _logger.LogInformation("Assigned partitions: [{Partitions}]",
//                         string.Join(", ", partitions.Select(p => $"{p.Topic}:[{p.Partition}]")));
//                 })
//                 .SetPartitionsRevokedHandler((c, partitions) =>
//                 {
//                     _logger.LogInformation("Revoked partitions: [{Partitions}]",
//                         string.Join(", ", partitions.Select(p => $"{p.Topic}:[{p.Partition}]")));
//                 })
//                 .Build();
//         }

//         public async Task StartConsumingAsync(CancellationToken cancellationToken)
//         {
//             _consumer.Subscribe(_alertsTopic);
//             _logger.LogInformation("Started consuming messages from topic: {Topic}", _alertsTopic);

//             try
//             {
//                 while (!cancellationToken.IsCancellationRequested)
//                 {
//                     try
//                     {
//                         // Use timeout to prevent indefinite blocking
//                         var consumeResult = _consumer.Consume(TimeSpan.FromSeconds(1));

//                         if (consumeResult != null && !consumeResult.IsPartitionEOF)
//                         {
//                             await ProcessMessageAsync(consumeResult, cancellationToken);

//                             // Commit the offset after successful processing
//                             _consumer.Commit(consumeResult);
//                         }

//                         // Small delay to prevent CPU spinning
//                         await Task.Delay(10, cancellationToken);
//                     }
//                     catch (ConsumeException ex)
//                     {
//                         _logger.LogError(ex, "Error consuming message: {Error}", ex.Error.Reason);

//                         // Wait before retrying on consume errors
//                         await Task.Delay(1000, cancellationToken);
//                     }
//                     catch (OperationCanceledException)
//                     {
//                         _logger.LogInformation("Kafka consumer cancellation requested");
//                         break;
//                     }
//                     catch (Exception ex)
//                     {
//                         _logger.LogError(ex, "Unexpected error in Kafka alert consumer");

//                         // Wait before retrying to avoid tight loop on persistent errors
//                         await Task.Delay(5000, cancellationToken);
//                     }
//                 }
//             }
//             finally
//             {
//                 try
//                 {
//                     _consumer.Close();
//                     _logger.LogInformation("Kafka consumer closed");
//                 }
//                 catch (Exception ex)
//                 {
//                     _logger.LogError(ex, "Error closing Kafka consumer");
//                 }
//             }
//         }

//         private async Task ProcessMessageAsync(ConsumeResult<string, string> consumeResult, CancellationToken cancellationToken)
//         {
//             try
//             {
//                 _logger.LogDebug("Processing alert message from partition {Partition}, offset {Offset}",
//                     consumeResult.Partition, consumeResult.Offset);

//                 // Deserialize the alert message using your existing DTO
//                 var alertTriggered = JsonSerializer.Deserialize<AlertTriggeredDTO>(consumeResult.Message.Value);
//                 if (alertTriggered == null)
//                 {
//                     _logger.LogWarning("Failed to deserialize alert message from offset {Offset}", consumeResult.Offset);
//                     return;
//                 }

//                 // Create a scope for scoped services (important for database contexts)
//                 using var scope = _serviceProvider.CreateScope();

//                 // Get required services from the scope using your existing service
//                 var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

//                 // Process the alert using your existing method
//                 await notificationService.SendAlertNotificationAsync(alertTriggered);

//                 _logger.LogDebug("Successfully processed alert message from offset {Offset}", consumeResult.Offset);
//             }
//             catch (JsonException ex)
//             {
//                 _logger.LogError(ex, "Error deserializing alert message from offset {Offset}: {Message}",
//                     consumeResult.Offset, ex.Message);
//                 // Don't rethrow for deserialization errors - message is invalid
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error processing alert message from offset {Offset}: {Message}",
//                     consumeResult.Offset, ex.Message);
//                 throw; // Re-throw to handle at consumer level
//             }
//         }

//         public void Dispose()
//         {
//             _consumer?.Dispose();
//         }
//     }
// }
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Confluent.Kafka;
using StockHub_Backend.DTOs;
using StockHub_Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using StockHub_Backend.Dtos.Alert;

namespace StockHub_Backend.Services.Kafka.Alert
{
    public class KafkaAlertConsumer : IKafkaAlertConsumer, IDisposable
    {
        private readonly IConsumer<string, string> _consumer;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<KafkaAlertConsumer> _logger;
        private readonly string _alertsTopic;

        public KafkaAlertConsumer(IConfiguration configuration, IServiceProvider serviceProvider, ILogger<KafkaAlertConsumer> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;

            // Use the correct configuration path for alerts topic
            _alertsTopic = configuration.GetValue<string>("Kafka:Topics:AlertsTriggeredTopic") ?? "alerts-triggered";

            var config = new ConsumerConfig
            {
                // Use the correct configuration path for consumer group
                GroupId = configuration.GetValue<string>("Kafka:ConsumerGroups:AlertsTriggeredTopic") ?? "alerts-triggered-consumer",
                BootstrapServers = configuration.GetValue<string>("Kafka:BootstrapServers") ?? "localhost:9092",
                ClientId = configuration.GetValue<string>("Kafka:ClientId") ?? "StockHub",
                AutoOffsetReset = AutoOffsetReset.Earliest,
                EnableAutoCommit = false, // Manual commit for better control
                SessionTimeoutMs = 30000,
                HeartbeatIntervalMs = 10000,
                MaxPollIntervalMs = 300000
            };

            _consumer = new ConsumerBuilder<string, string>(config)
                .SetErrorHandler((_, e) => _logger.LogError("Kafka consumer error: {Error}", e.Reason))
                .SetPartitionsAssignedHandler((c, partitions) =>
                {
                    _logger.LogInformation("Assigned partitions: [{Partitions}]",
                        string.Join(", ", partitions.Select(p => $"{p.Topic}:[{p.Partition}]")));
                })
                .SetPartitionsRevokedHandler((c, partitions) =>
                {
                    _logger.LogInformation("Revoked partitions: [{Partitions}]",
                        string.Join(", ", partitions.Select(p => $"{p.Topic}:[{p.Partition}]")));
                })
                .Build();
        }

        public async Task StartConsumingAsync(CancellationToken cancellationToken)
        {
            _consumer.Subscribe(_alertsTopic);
            _logger.LogInformation("Started consuming messages from topic: {Topic}", _alertsTopic);

            // ADD THIS DEBUG LOG
            _logger.LogInformation("Kafka Consumer Configuration: BootstrapServers={BootstrapServers}, GroupId={GroupId}, Topic={Topic}",
                _consumer.Name, _consumer.Assignment, _alertsTopic);

            try
            {
                while (!cancellationToken.IsCancellationRequested)
                {
                    try
                    {
                        // Use timeout to prevent indefinite blocking
                        var consumeResult = _consumer.Consume(TimeSpan.FromSeconds(1));

                        if (consumeResult != null && !consumeResult.IsPartitionEOF)
                        {
                            // ADD THIS DEBUG LOG
                            _logger.LogInformation("📨 Received Kafka message: Topic={Topic}, Partition={Partition}, Offset={Offset}, Key={Key}",
                                consumeResult.Topic, consumeResult.Partition, consumeResult.Offset, consumeResult.Message.Key);

                            await ProcessMessageAsync(consumeResult, cancellationToken);

                            // Commit the offset after successful processing
                            _consumer.Commit(consumeResult);

                            // ADD THIS DEBUG LOG
                            _logger.LogInformation("✅ Successfully committed offset {Offset}", consumeResult.Offset);
                        }
                        else if (consumeResult?.IsPartitionEOF == true)
                        {
                            // ADD THIS DEBUG LOG
                            _logger.LogDebug("Reached end of partition {Partition}", consumeResult.Partition);
                        }

                        // Small delay to prevent CPU spinning
                        await Task.Delay(10, cancellationToken);
                    }
                    catch (ConsumeException ex)
                    {
                        _logger.LogError(ex, "❌ Error consuming message: {Error}", ex.Error.Reason);

                        // Wait before retrying on consume errors
                        await Task.Delay(1000, cancellationToken);
                    }
                    catch (OperationCanceledException)
                    {
                        _logger.LogInformation("Kafka consumer cancellation requested");
                        break;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "❌ Unexpected error in Kafka alert consumer");

                        // Wait before retrying to avoid tight loop on persistent errors
                        await Task.Delay(5000, cancellationToken);
                    }
                }
            }
            finally
            {
                try
                {
                    _consumer.Close();
                    _logger.LogInformation("Kafka consumer closed");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error closing Kafka consumer");
                }
            }
        }

        private async Task ProcessMessageAsync(ConsumeResult<string, string> consumeResult, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation("🔄 Processing alert message from partition {Partition}, offset {Offset}",
                    consumeResult.Partition, consumeResult.Offset);

                // Deserialize the alert message using your existing DTO
                var alertTriggered = JsonSerializer.Deserialize<AlertTriggeredDTO>(consumeResult.Message.Value);
                if (alertTriggered == null)
                {
                    _logger.LogWarning("❌ Failed to deserialize alert message from offset {Offset}", consumeResult.Offset);
                    return;
                }

                // ADD THIS DEBUG LOG
                _logger.LogInformation("📤 About to send SignalR notification for user {UserId}, symbol {Symbol}",
                    alertTriggered.UserId, alertTriggered.Symbol);

                // Create a scope for scoped services (important for database contexts)
                using var scope = _serviceProvider.CreateScope();

                // Get required services from the scope using your existing service
                var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

                // Process the alert using your existing method
                await notificationService.SendAlertNotificationAsync(alertTriggered);

                _logger.LogInformation("✅ Successfully processed alert message from offset {Offset}", consumeResult.Offset);
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "❌ Error deserializing alert message from offset {Offset}: {Message}",
                    consumeResult.Offset, ex.Message);
                // Don't rethrow for deserialization errors - message is invalid
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error processing alert message from offset {Offset}: {Message}",
                    consumeResult.Offset, ex.Message);
                throw; // Re-throw to handle at consumer level
            }
        }

        public void Dispose()
        {
            _consumer?.Dispose();
        }
    }
}
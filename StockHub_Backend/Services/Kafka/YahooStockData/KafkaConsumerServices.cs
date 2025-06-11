using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Confluent.Kafka;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;
using StockHub_Backend.Models;
using StockHub_Backend.Interfaces;

namespace StockHub_Backend.Services.Kafka.YahooStockData
{
    public class KafkaConsumerService : BackgroundService
    {
        private readonly IConsumer<string, string> _consumer;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<KafkaConsumerService> _logger;
        private readonly JsonSerializerOptions _jsonOptions;

        public KafkaConsumerService(
            IConfiguration configuration,
            IServiceProvider serviceProvider,
            ILogger<KafkaConsumerService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;

            var config = new ConsumerConfig
            {
                BootstrapServers = configuration["Kafka:BootstrapServers"] ?? "localhost:9092",
                GroupId = configuration["Kafka:ConsumerGroups:YahooStockPrices"] ?? "yahoo-stock-prices-consumer",
                ClientId = configuration["Kafka:ClientId"] ?? "StockHub",
                AutoOffsetReset = AutoOffsetReset.Latest,
                EnableAutoCommit = true,
                AutoCommitIntervalMs = 5000,
                SessionTimeoutMs = 30000,
                HeartbeatIntervalMs = 3000
            };

            _consumer = new ConsumerBuilder<string, string>(config)
                .SetErrorHandler((_, e) => _logger.LogError("Kafka consumer error: {Error}", e.Reason))
                .SetPartitionsAssignedHandler((c, partitions) =>
                {
                    _logger.LogInformation("Assigned partitions: [{Partitions}]",
                        string.Join(", ", partitions.Select(p => $"{p.Topic}:{p.Partition}")));
                })
                .SetPartitionsRevokedHandler((c, partitions) =>
                {
                    _logger.LogInformation("Revoked partitions: [{Partitions}]",
                        string.Join(", ", partitions.Select(p => $"{p.Topic}:{p.Partition}")));
                })
                .Build();

            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            };
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var topics = new[] { "yahoo-stock-prices" };
            _consumer.Subscribe(topics);

            _logger.LogInformation("Kafka consumer started. Subscribed to topics: {Topics}", string.Join(", ", topics));

            await Task.Run(async () =>
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    try
                    {
                        ConsumeResult<string, string>? consumeResult = null;

                        // Poll Kafka on a background thread to prevent blocking
                        await Task.Run(() =>
                        {
                            try
                            {
                                consumeResult = _consumer.Consume(stoppingToken);
                            }
                            catch (ConsumeException ex)
                            {
                                _logger.LogError(ex, "Kafka consume error: {Error}", ex.Error.Reason);
                            }
                        }, stoppingToken);

                        if (consumeResult?.Message?.Value != null)
                        {
                            await ProcessMessageAsync(consumeResult.Message);
                        }
                    }
                    catch (OperationCanceledException)
                    {
                        _logger.LogInformation("Kafka consumer cancellation requested.");
                        break;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Unexpected error in Kafka consumer loop.");
                        await Task.Delay(5000, stoppingToken); // Pause briefly before retry
                    }
                }

                _consumer.Close();
                _logger.LogInformation("Kafka consumer closed.");
            }, stoppingToken);
        }


        private async Task ProcessMessageAsync(Message<string, string> message)
        {
            try
            {
                var stockMessage = JsonSerializer.Deserialize<KafkaStockMessage>(message.Value, _jsonOptions);

                if (stockMessage != null)
                {
                    _logger.LogDebug("Processing stock price update for {Symbol}: {Price}",
                        stockMessage.Symbol, stockMessage.Price);

                    // Broadcast to WebSocket clients
                    using var scope = _serviceProvider.CreateScope();
                    var hubContext = scope.ServiceProvider.GetService<IHubContext<StockPriceHub, IStockPriceHub>>();

                    if (hubContext != null)
                    {
                        await hubContext.Clients.All.SendStockPriceUpdate(
                            stockMessage.Symbol,
                            stockMessage.Price,
                            stockMessage.Change,
                            stockMessage.ChangePercent);
                    }

                    // You can add additional processing here, such as:
                    // - Updating a database
                    // - Triggering alerts
                    // - Updating other caches
                }
                else
                {
                    _logger.LogWarning("Failed to deserialize stock message: {Message}", message.Value);
                }
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Error deserializing stock message: {Message}", message.Value);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing stock message for key: {Key}", message.Key);
            }
        }

        public override void Dispose()
        {
            try
            {
                _consumer?.Dispose();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error disposing Kafka consumer");
            }
            base.Dispose();
        }
    }


    // SignalR Hub for real-time updates
        public class StockPriceHub : Hub<IStockPriceHub>
        {
            private readonly ILogger<StockPriceHub> _logger;

            public StockPriceHub(ILogger<StockPriceHub> logger)
            {
                _logger = logger;
            }

            public async Task JoinGroup(string groupName)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                _logger.LogInformation("Client {ConnectionId} joined group {GroupName}", Context.ConnectionId, groupName);
            }

            public async Task LeaveGroup(string groupName)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
                _logger.LogInformation("Client {ConnectionId} left group {GroupName}", Context.ConnectionId, groupName);
            }

            public override async Task OnConnectedAsync()
            {
                _logger.LogInformation("Client connected: {ConnectionId}", Context.ConnectionId);
                await base.OnConnectedAsync();
            }

            public override async Task OnDisconnectedAsync(Exception? exception)
            {
                _logger.LogInformation("Client disconnected: {ConnectionId}", Context.ConnectionId);
                await base.OnDisconnectedAsync(exception);
            }
        }
}
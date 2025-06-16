using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockHub_Backend.Interfaces;

namespace StockHub_Backend.Services.BackgroundTask
{
      public class AlertPricePollingBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<AlertPricePollingBackgroundService> _logger;
        private readonly IConfiguration _configuration;
        private readonly TimeSpan _updateInterval;

        public AlertPricePollingBackgroundService(
            IServiceProvider serviceProvider,
            IConfiguration configuration,
            ILogger<AlertPricePollingBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _configuration = configuration;
            _logger = logger;

            // Configure update interval (default: 5 minute)
            var intervalMinutes = configuration.GetValue<int>("AlertPricePolling:IntervalMinutes", 5);
            _updateInterval = TimeSpan.FromMinutes(intervalMinutes);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var enableAlertPolling = _configuration.GetValue<bool>("AlertPricePolling:EnableAlertPolling", true);

            if (!enableAlertPolling)
            {
                _logger.LogInformation("Alert Price Polling Background Service is disabled via configuration");
                return;
            }

            _logger.LogInformation("Alert Price Polling Background Service started with {Interval} minute intervals",
                _updateInterval.TotalMinutes);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var pricePollingService = scope.ServiceProvider.GetRequiredService<IPricePollingService>();

                    await pricePollingService.CheckPricesAndTriggerAlertsAsync();

                    _logger.LogDebug("Alert price polling completed successfully");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during alert price polling");
                }

                await Task.Delay(_updateInterval, stoppingToken);
            }
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockHub_Backend.Interfaces;
namespace StockHub_Backend.Services.BackgroundTask

{
    public class PortfolioStockPriceBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<PortfolioStockPriceBackgroundService> _logger;
        private readonly TimeSpan _updateInterval;

        public PortfolioStockPriceBackgroundService(
            IServiceProvider serviceProvider,
            IConfiguration configuration,
            ILogger<PortfolioStockPriceBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            
            // Configure update interval (default: 5 minutes)
            var intervalMinutes = configuration.GetValue<int>("PortfolioStockUpdate:IntervalMinutes", 5);
            _updateInterval = TimeSpan.FromMinutes(intervalMinutes);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Portfolio Stock Price Background Service started with {Interval} minute intervals", 
                _updateInterval.TotalMinutes);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var updateService = scope.ServiceProvider.GetRequiredService<IPortfolioStockPriceUpdateService>();
                    
                    await updateService.UpdateAllPortfolioStockPricesAsync();
                    
                    _logger.LogInformation("Portfolio stock price update completed successfully");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during portfolio stock price update");
                }

                // Wait for next update cycle
                await Task.Delay(_updateInterval, stoppingToken);
            }
        }
    }
}
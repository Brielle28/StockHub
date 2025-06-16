using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using StockHub_Backend.Dtos.Alert;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Models;
using AlertModel = StockHub_Backend.Models.Alert;

namespace StockHub_Backend.Services.Alert
{
    public class AlertService : IAlertService
    {
        private readonly IAlertRepository _alertRepository;
        private readonly IDistributedCache _cache;
        private readonly ILogger<AlertService> _logger;
        private readonly IPricePollingService _pricePollingService;

        public AlertService(
            IAlertRepository alertRepository,
            IDistributedCache cache,
            ILogger<AlertService> logger,
            IPricePollingService pricePollingService)
        {
            _alertRepository = alertRepository;
            _cache = cache;
            _logger = logger;
            _pricePollingService = pricePollingService;
        }

        public async Task<AlertResponseDTO> CreateAlertAsync(string userId, CreateAlertRequestDTO request)
        {
            // Validate symbol exists
            if (!await ValidateSymbolAsync(request.Symbol))
            {
                throw new ArgumentException($"Invalid symbol: {request.Symbol}");
            }

            var alert = new AlertModel
            {
                UserId = userId,
                Symbol = request.Symbol.ToUpper(),
                TargetPrice = request.TargetPrice,
                Condition = request.Condition
            };

            var createdAlert = await _alertRepository.CreateAlertAsync(alert);

            // Cache the alert
            await CacheUserAlertsAsync(userId);

            _logger.LogInformation("Alert created for user {UserId}, symbol {Symbol}", userId, request.Symbol);

            return MapToResponseDTO(createdAlert);
        }

        public async Task<IEnumerable<AlertResponseDTO>> GetUserAlertsAsync(string userId)
        {
            var cacheKey = $"alerts:user:{userId}";
            var cachedAlerts = await _cache.GetStringAsync(cacheKey);

            if (!string.IsNullOrEmpty(cachedAlerts))
            {
                return JsonSerializer.Deserialize<IEnumerable<AlertResponseDTO>>(cachedAlerts) ?? Enumerable.Empty<AlertResponseDTO>();
            }

            var alerts = await _alertRepository.GetUserAlertsAsync(userId);
            var alertDTOs = alerts.Select(alert => MapToResponseDTO(alert));

            // Cache for 5 minutes
            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(alertDTOs),
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
                });

            return alertDTOs;
        }

        public async Task<IEnumerable<AlertResponseDTO>> GetTriggeredAlertsAsync(string userId)
        {
            var alerts = await _alertRepository.GetTriggeredAlertsAsync(userId);
            return alerts.Select(alert => MapToResponseDTO(alert));
        }

        public async Task<bool> DeleteAlertAsync(Guid alertId, string userId)
        {
            var alert = await _alertRepository.GetAlertByIdAsync(alertId);
            if (alert == null || alert.UserId != userId)
            {
                return false;
            }

            var result = await _alertRepository.DeleteAlertAsync(alertId);
            if (result)
            {
                await CacheUserAlertsAsync(userId);
                _logger.LogInformation("Alert {AlertId} deleted for user {UserId}", alertId, userId);
            }

            return result;
        }

        public async Task<bool> ValidateSymbolAsync(string symbol)
        {
            try
            {
                var price = await _pricePollingService.GetCurrentPriceAsync(symbol);
                return price.HasValue;
            }
            catch
            {
                return false;
            }
        }

        private async Task CacheUserAlertsAsync(string userId)
        {
            var alerts = await _alertRepository.GetUserAlertsAsync(userId);
            var alertDTOs = alerts.Select(alert => MapToResponseDTO(alert));
            var cacheKey = $"alerts:user:{userId}";

            await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(alertDTOs),
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
                });
        }

        private static AlertResponseDTO MapToResponseDTO(AlertModel alert)
        {
            return new AlertResponseDTO
            {
                Id = alert.Id,
                Symbol = alert.Symbol,
                TargetPrice = alert.TargetPrice,
                Condition = alert.Condition,
                IsActive = alert.IsActive,
                CreatedAt = alert.CreatedAt,
                TriggeredAt = alert.TriggeredAt
            };
        }
    }
}
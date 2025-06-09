using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using StockHub_Backend.Interfaces;

namespace StockHub_Backend.Services.redis
{
    public class RedisCacheService : IPortfolioCacheService
    {
        private readonly IDistributedCache _distributedCache;
        private readonly ILogger<RedisCacheService> _logger;

        public RedisCacheService(IDistributedCache distributedCache, ILogger<RedisCacheService> logger)
        {
            _distributedCache = distributedCache;
            _logger = logger;
        }

        public async Task<T> GetAsync<T>(string key)
        {
            try
            {
                var cachedData = await _distributedCache.GetStringAsync(key);

                if (string.IsNullOrEmpty(cachedData))
                {
                    return default;
                }

                return JsonSerializer.Deserialize<T>(cachedData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving data from Redis cache for key: {Key}", key);
                return default;
            }
        }

        public async Task SetAsync<T>(string key, T value, int expirationMinutes = 30)
        {
            try
            {
                var options = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(expirationMinutes)
                };

                var serializedData = JsonSerializer.Serialize(value);
                await _distributedCache.SetStringAsync(key, serializedData, options);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting data in Redis cache for key: {Key}", key);
            }
        }

        public async Task RemoveAsync(string key)
        {
            try
            {
                await _distributedCache.RemoveAsync(key);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing data from Redis cache for key: {Key}", key);
            }
        }

        public async Task<bool> ExistsAsync(string key)
        {
            try
            {
                var cachedData = await _distributedCache.GetStringAsync(key);
                return !string.IsNullOrEmpty(cachedData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking existence in Redis cache for key: {Key}", key);
                return false;
            }
        }
    }
}
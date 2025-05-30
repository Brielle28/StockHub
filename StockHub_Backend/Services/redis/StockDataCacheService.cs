using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StackExchange.Redis;
using System.Text.Json;
using StockHub_Backend.Interfaces;

namespace StockHub_Backend.Services.redis

{
    public class CacheService : IStockDataCacheService
    {
        private readonly IDatabase _database;
        private readonly ILogger<CacheService> _logger;
        private readonly JsonSerializerOptions _jsonOptions;

        public CacheService(IConnectionMultiplexer redis, ILogger<CacheService> logger)
        {
            _database = redis.GetDatabase();
            _logger = logger;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false
            };
        }

        public async Task<T?> GetAsync<T>(string key) where T : class
        {
            try
            {
                var value = await _database.StringGetAsync(key);
                if (!value.HasValue)
                    return null;

                return JsonSerializer.Deserialize<T>(value!, _jsonOptions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting cache key: {Key}", key);
                return null;
            }
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null) where T : class
        {
            try
            {
                var serializedValue = JsonSerializer.Serialize(value, _jsonOptions);
                await _database.StringSetAsync(key, serializedValue, expiry);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting cache key: {Key}", key);
            }
        }

        public async Task RemoveAsync(string key)
        {
            try
            {
                await _database.KeyDeleteAsync(key);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing cache key: {Key}", key);
            }
        }

        public async Task<bool> ExistsAsync(string key)
        {
            try
            {
                return await _database.KeyExistsAsync(key);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking cache key existence: {Key}", key);
                return false;
            }
        }

        public async Task SetStringAsync(string key, string value, TimeSpan? expiry = null)
        {
            try
            {
                await _database.StringSetAsync(key, value, expiry);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting string cache key: {Key}", key);
            }
        }

        public async Task<string?> GetStringAsync(string key)
        {
            try
            {
                return await _database.StringGetAsync(key);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting string cache key: {Key}", key);
                return null;
            }
        }
    }
}

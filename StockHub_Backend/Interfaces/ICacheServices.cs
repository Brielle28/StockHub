using System;
using System.Threading.Tasks;

namespace StockHub_Backend.Services
{
    // public interface ICacheService
    // {
    //     Task SetAsync(string key, string value, TimeSpan? expiry = null);
    //     Task<string?> GetAsync(string key);
    //     Task RemoveAsync(string key);
    // }
    public interface ICacheService
    {
        Task<T> GetAsync<T>(string key);
        Task SetAsync<T>(string key, T value, int expirationMinutes = 30);
        Task RemoveAsync(string key);
        Task<bool> ExistsAsync(string key);
    }
}

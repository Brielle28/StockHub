using System;
using System.Threading.Tasks;

namespace StockHub_Backend.Interfaces
{
    public interface IPortfolioCacheService
    {
        Task<T> GetAsync<T>(string key);
        Task SetAsync<T>(string key, T value, int expirationMinutes = 30);
        Task RemoveAsync(string key);
        Task<bool> ExistsAsync(string key);
    }
}

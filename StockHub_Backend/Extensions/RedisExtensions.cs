using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using StackExchange.Redis;

namespace StockHub_Backend.Extensions
{
    public static class RedisExtensions
    {
        public static IServiceCollection AddRedisServices(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("Redis") ?? 
                                 configuration["Redis:ConnectionString"];

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Redis connection string is not configured");
            }

            services.AddSingleton<IConnectionMultiplexer>(provider =>
            {
                return ConnectionMultiplexer.Connect(connectionString);
            });

            return services;
        }

        // Cache key generators
        public static class CacheKeys
        {
            public static string StockPrice(string symbol) => $"stock:{symbol.ToUpper()}:price";
            public static string StockSearch(string query) => $"stock:search:{query.ToLower()}";
            public static string StockHistory(string symbol, string range) => $"stock:{symbol.ToUpper()}:history:{range}";
            public static string StockNews(string? symbol = null) => 
                string.IsNullOrEmpty(symbol) ? "stock:news" : $"stock:{symbol.ToUpper()}:news";
            public static string StockQuote(string symbol) => $"stock:{symbol.ToUpper()}:quote";
        }

        // Cache TTL configurations
        public static class CacheTTL
        {
            public static TimeSpan StockPrice => TimeSpan.FromMinutes(2);
            public static TimeSpan StockSearch => TimeSpan.FromMinutes(30);
            public static TimeSpan StockHistory => TimeSpan.FromHours(8);
            public static TimeSpan StockNews => TimeSpan.FromHours(1);
            public static TimeSpan StockQuote => TimeSpan.FromMinutes(3);
        }
    }
}
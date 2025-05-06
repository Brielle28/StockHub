using System.Collections.Generic;
using System.Threading.Tasks;
using StockHub_Backend.Dtos.Stock;
using StockHub_Backend.Models;

namespace StockHub_Backend.Interfaces
{
    public interface IStockRepository
    {
        Task<List<Stock>> GetAllAsync();
        Task<Stock?> GetByIdAsync(int id);
        Task<Stock?> GetBySymbolAsync (string symbol);
        Task<Stock> CreateAsync(Stock stockModel);
        Task<bool> UpdateAsync(int id, StockUpdateDto updateStock);
        Task<bool> DeleteAsync(int id);
        Task<List<Stock>> SearchStocksAsync(string query);
        Task<Stock> UpdateStockPriceAsync(string symbol, decimal currentPrice, decimal previousClose);
        Task<bool> StockExists(string symbol);        
        Task<bool> stockExists(int StockId);        
    }
}

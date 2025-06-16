using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockHub_Backend.Dtos.Alert;

namespace StockHub_Backend.Interfaces
{
     public interface IAlertService
    {
        Task<AlertResponseDTO> CreateAlertAsync(string userId, CreateAlertRequestDTO request);
        Task<IEnumerable<AlertResponseDTO>> GetUserAlertsAsync(string userId);
        Task<IEnumerable<AlertResponseDTO>> GetTriggeredAlertsAsync(string userId);
        Task<bool> DeleteAlertAsync(Guid alertId, string userId);
        Task<bool> ValidateSymbolAsync(string symbol);
    }
}
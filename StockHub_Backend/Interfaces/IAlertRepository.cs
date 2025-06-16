using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockHub_Backend.Models;

namespace StockHub_Backend.Interfaces
{
     public interface IAlertRepository
    {
        Task<Alert> CreateAlertAsync(Alert alert);
        Task<IEnumerable<Alert>> GetUserAlertsAsync(string userId);
        Task<IEnumerable<Alert>> GetActiveAlertsAsync();
        Task<IEnumerable<Alert>> GetTriggeredAlertsAsync(string userId);
        Task<bool> DeleteAlertAsync(Guid alertId);
        Task<Alert?> UpdateAlertAsync(Alert alert);
        Task<Alert?> GetAlertByIdAsync(Guid alertId);
    }
}
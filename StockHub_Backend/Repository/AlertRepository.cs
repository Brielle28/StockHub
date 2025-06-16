using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StockHub_Backend.Data;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Models;

namespace StockHub_Backend.Repository
{
       public class AlertRepository : IAlertRepository
    {
        private readonly ApplicationDBContext _context;

        public AlertRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Alert> CreateAlertAsync(Alert alert)
        {
            _context.Alerts.Add(alert);
            await _context.SaveChangesAsync();
            return alert;
        }

        public async Task<IEnumerable<Alert>> GetUserAlertsAsync(string userId)
        {
            return await _context.Alerts
                .Where(a => a.UserId == userId && a.IsActive)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Alert>> GetActiveAlertsAsync()
        {
            return await _context.Alerts
                .Where(a => a.IsActive)
                .ToListAsync();
        }

        public async Task<IEnumerable<Alert>> GetTriggeredAlertsAsync(string userId)
        {
            return await _context.Alerts
                .Where(a => a.UserId == userId && a.TriggeredAt.HasValue)
                .OrderByDescending(a => a.TriggeredAt)
                .ToListAsync();
        }

        public async Task<bool> DeleteAlertAsync(Guid alertId)
        {
            var alert = await _context.Alerts.FindAsync(alertId);
            if (alert == null) return false;

            _context.Alerts.Remove(alert);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Alert?> UpdateAlertAsync(Alert alert)
        {
            _context.Alerts.Update(alert);
            await _context.SaveChangesAsync();
            return alert;
        }

        public async Task<Alert?> GetAlertByIdAsync(Guid alertId)
        {
            return await _context.Alerts.FindAsync(alertId);
        }
    }
}

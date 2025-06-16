using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockHub_Backend.Dtos.Alert;

namespace StockHub_Backend.Interfaces
{
    public interface INotificationService
    {
        Task SendAlertNotificationAsync(AlertTriggeredDTO alertTriggered);
        Task ProcessTriggeredAlertAsync(AlertTriggeredDTO alertTriggered);
    }
}
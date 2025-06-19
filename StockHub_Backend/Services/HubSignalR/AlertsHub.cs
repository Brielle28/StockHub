using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace StockHub_Backend.Services.HubSignalR
{
    [Authorize]
     public class AlertsHub : Hub
    {
        private readonly ILogger<AlertsHub> _logger;

        public AlertsHub(ILogger<AlertsHub> logger)
        {
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
                _logger.LogDebug("User {UserId} connected to alerts hub", userId);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"User_{userId}");
                _logger.LogDebug("User {UserId} disconnected from alerts hub", userId);
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}
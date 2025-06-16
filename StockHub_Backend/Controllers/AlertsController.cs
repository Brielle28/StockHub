// using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockHub_Backend.Dtos;
using StockHub_Backend.Dtos.Alert;
using StockHub_Backend.Interfaces;
using System.Security.Claims;

namespace StockHub_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AlertsController : ControllerBase
    {
        private readonly IAlertService _alertService;
        private readonly ILogger<AlertsController> _logger;

        public AlertsController(IAlertService alertService, ILogger<AlertsController> logger)
        {
            _alertService = alertService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<AlertResponseDTO>> CreateAlert([FromBody] CreateAlertRequestDTO request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var alert = await _alertService.CreateAlertAsync(userId, request);
                return CreatedAtAction(nameof(GetUserAlerts), new { id = alert.Id }, alert);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating alert");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AlertResponseDTO>>> GetUserAlerts()
        {
            try
            {
                var userId = GetCurrentUserId();
                var alerts = await _alertService.GetUserAlertsAsync(userId);
                return Ok(alerts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user alerts");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("triggered")]
        public async Task<ActionResult<IEnumerable<AlertResponseDTO>>> GetTriggeredAlerts()
        {
            try
            {
                var userId = GetCurrentUserId();
                var alerts = await _alertService.GetTriggeredAlertsAsync(userId);
                return Ok(alerts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting triggered alerts");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlert(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _alertService.DeleteAlertAsync(id, userId);
                
                if (!result)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting alert");
                return StatusCode(500, "Internal server error");
            }
        }

        private string GetCurrentUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                   throw new UnauthorizedAccessException("User ID not found");
        }
    }
}

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StockHub_Backend.Dtos.Portfolio;
using StockHub_Backend.DTOs;
using StockHub_Backend.Extensions;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Models;

namespace StockHub_Backend.Controllers
{
    [Route("api/portfolios")]
    [ApiController]
    [Authorize]
    public class PortfoliosController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IPortfolioRepository _portfolioRepository;
        private readonly IPortfolioStockPriceUpdateService _priceUpdateService;
        private readonly ILogger<PortfoliosController> _logger;

        public PortfoliosController(
            UserManager<AppUser> userManager,
            IPortfolioRepository portfolioRepository,
            IPortfolioStockPriceUpdateService priceUpdateService,
            ILogger<PortfoliosController> logger)
        {
            _userManager = userManager;
            _portfolioRepository = portfolioRepository;
            _priceUpdateService = priceUpdateService;
            _logger = logger;
        }

        // GET: api/portfolios
        [HttpGet]
        public async Task<IActionResult> GetUserPortfolios()
        {
            var username = User.GetUsername();
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return Unauthorized();
            }

            var portfolios = await _portfolioRepository.GetUserPortfolios(user);
            return Ok(portfolios);
        }

        // GET: api/portfolios/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPortfolio(int id)
        {
            var username = User.GetUsername();
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return Unauthorized();
            }

            var portfolio = await _portfolioRepository.GetPortfolioById(id, user.Id);

            if (portfolio == null)
            {
                return NotFound("Portfolio not found");
            }

            return Ok(portfolio);
        }

        // POST: api/portfolios
        [HttpPost]
        public async Task<IActionResult> CreatePortfolio(CreatePortfolioDto portfolioDto)
        {
            var username = User.GetUsername();
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return Unauthorized();
            }

            var portfolio = new Portfolio
            {
                Name = portfolioDto.Name,
                Description = portfolioDto.Description,
                AppUserId = user.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var createdPortfolio = await _portfolioRepository.CreatePortfolio(portfolio);

            if (createdPortfolio == null)
            {
                return StatusCode(500, "Failed to create portfolio");
            }

            return CreatedAtAction(nameof(GetPortfolio), new { id = createdPortfolio.Id }, null);
        }

        // PUT: api/portfolios/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePortfolio(int id, UpdatePortfolioDto portfolioDto)
        {
            var username = User.GetUsername();
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return Unauthorized();
            }

            var portfolio = await _portfolioRepository.GetPortfolioById(id, user.Id);

            if (portfolio == null)
            {
                return NotFound("Portfolio not found");
            }

            // Get the entity from the database to update
            var portfolioToUpdate = new Portfolio
            {
                Id = id,
                Name = portfolioDto.Name,
                Description = portfolioDto.Description,
                AppUserId = user.Id
                // UpdatedAt will be set in the repository
            };

            var result = await _portfolioRepository.UpdatePortfolio(portfolioToUpdate);

            if (!result)
            {
                return StatusCode(500, "Failed to update portfolio");
            }

            return NoContent();
        }

        // DELETE: api/portfolios/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePortfolio(int id)
        {
            var username = User.GetUsername();
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return Unauthorized();
            }

            var result = await _portfolioRepository.DeletePortfolio(id, user.Id);

            if (!result)
            {
                return NotFound("Portfolio not found");
            }

            return NoContent();
        }

        [HttpPost("{id}/stocks")]
        public async Task<IActionResult> AddStockToPortfolio(int id, AddStockToPortfolioDto stockDto)
        {
            try
            {
                var username = User.GetUsername();
                Console.WriteLine($"Username: {username}");

                var user = await _userManager.FindByNameAsync(username);
                Console.WriteLine($"User found: {user != null}");

                if (user == null)
                {
                    return Unauthorized();
                }

                Console.WriteLine($"Checking portfolio ownership for ID: {id}");
                if (!await _portfolioRepository.UserOwnsPortfolio(id, user.Id))
                {
                    return NotFound("Portfolio not found");
                }

                Console.WriteLine($"Adding stock: {stockDto.Symbol}, Quantity: {stockDto.Quantity}");
                var addedStock = await _portfolioRepository.AddStockToPortfolio(id, stockDto, user);

                if (addedStock == null)
                {
                    return StatusCode(500, "Failed to add stock to portfolio");
                }

                return CreatedAtAction(nameof(GetPortfolio), new { id }, addedStock);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AddStockToPortfolio: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        // DELETE: api/portfolios/{id}/stocks/{stockId}
        [HttpDelete("{id}/stocks/{stockId}")]
        public async Task<IActionResult> RemoveStockFromPortfolio(int id, int stockId)
        {
            var username = User.GetUsername();
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return Unauthorized();
            }

            var result = await _portfolioRepository.RemoveStockFromPortfolio(id, stockId, user.Id);

            if (!result)
            {
                return NotFound("Stock not found in portfolio");
            }

            return NoContent();
        }

        // GET: api/portfolios/{id}/stocks
        [HttpGet("{id}/stocks")]
        public async Task<IActionResult> GetPortfolioStocks(int id)
        {
            var username = User.GetUsername();
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return Unauthorized();
            }

            // Check if portfolio exists and belongs to the user
            if (!await _portfolioRepository.UserOwnsPortfolio(id, user.Id))
            {
                return NotFound("Portfolio not found");
            }

            var stocks = await _portfolioRepository.GetPortfolioStocks(id, user.Id);
            return Ok(stocks);
        }

        // Legacy endpoints for backward compatibility
        [HttpGet("legacy")]
        public async Task<IActionResult> GetUserPortfolio()
        {
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
            var userPortfolio = await _portfolioRepository.GetUserPortfolio(appUser);
            return Ok(userPortfolio);
        }

        // Manual trigger for price updates
        [HttpPost("trigger-price-update")]
        [Authorize]
        public async Task<IActionResult> TriggerPriceUpdate()
        {
            try
            {
                _logger.LogInformation("Manual price update triggered by user: {Username}", User.GetUsername());
                
                await _priceUpdateService.UpdateAllPortfolioStockPricesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Portfolio stock prices updated successfully",
                    timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Manual price update failed for user: {Username}", User.GetUsername());
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to update portfolio stock prices",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }

        // Optional: Get price update status
        [HttpGet("price-update-status")]
        [Authorize]
        public async Task<IActionResult> GetPriceUpdateStatus()
        {
            try
            {
                var username = User.GetUsername();
                var user = await _userManager.FindByNameAsync(username);

                if (user == null)
                {
                    return Unauthorized();
                }

                // Get user's portfolios and their stocks
                var portfolios = await _portfolioRepository.GetUserPortfolios(user);
                var totalStocks = 0;
                var uniqueSymbols = new HashSet<string>();

                foreach (var portfolio in portfolios)
                {
                    var stocks = await _portfolioRepository.GetPortfolioStocks(portfolio.Id, user.Id);
                    totalStocks += stocks.Count();
                    
                    // Collect unique symbols
                    foreach (var stock in stocks)
                    {
                        uniqueSymbols.Add(stock.Symbol);
                    }
                }

                return Ok(new
                {
                    totalStocks = totalStocks,
                    uniqueSymbols = uniqueSymbols.Count,
                    totalPortfolios = portfolios.Count(),
                    lastChecked = DateTime.UtcNow,
                    nextScheduledUpdate = DateTime.UtcNow.AddMinutes(5), // Based on your background service interval
                    backgroundServiceActive = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting price update status for user: {Username}", User.GetUsername());
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
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
        private readonly IStockRepository _stockRepository;
        private readonly IPortfolioRepository _portfolioRepository;

        public PortfoliosController(
            UserManager<AppUser> userManager, 
            IStockRepository stockRepository, 
            IPortfolioRepository portfolioRepository)
        {
            _userManager = userManager;
            _stockRepository = stockRepository;
            _portfolioRepository = portfolioRepository;
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

        // POST: api/portfolios/{id}/stocks
        [HttpPost("{id}/stocks")]
        public async Task<IActionResult> AddStockToPortfolio(int id, AddStockToPortfolioDto stockDto)
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

            // Check if stock exists
            var stockExists = await _stockRepository.StockExists(stockDto.Symbol);
            
            if (!stockExists)
            {
                return NotFound($"Stock with symbol {stockDto.Symbol} not found");
            }

            var addedStock = await _portfolioRepository.AddStockToPortfolio(id, stockDto, user);
            
            if (addedStock == null)
            {
                return StatusCode(500, "Failed to add stock to portfolio");
            }
            
            return CreatedAtAction(nameof(GetPortfolio), new { id }, addedStock);
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
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StockHub_Backend.Extensions;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Models;

namespace StockHub_Backend.Controllers
{
    [Route("StockHub/Portfolio")]
    [ApiController]
    public class PortfolioController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IStockRepository _stockRepository;
        private readonly IPortfolioRepository _portfolioRepository;
        public PortfolioController(UserManager<AppUser> userManager, IStockRepository stockRepository, IPortfolioRepository portfolioRepository)
        {
            _stockRepository = stockRepository;
            _userManager = userManager;
            _portfolioRepository = portfolioRepository;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserPortfolio()
        {
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
            var UserPortfolio = await _portfolioRepository.GetUserPortfolio(appUser);
            return Ok(UserPortfolio);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddPortfolio(string symbol)
        {
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
            var stock = await _stockRepository.GetBySymbolAsync(symbol);

            if (stock == null)
            {
                return NotFound("Stock not found");
            }

            var UserPortfolio = await _portfolioRepository.GetUserPortfolio(appUser);

            if (UserPortfolio.Any(e => e.Symbol.ToLower() == symbol.ToLower())) return BadRequest("this stock exist: cannot add existing symbol");

            var portfolio = new Portfolio
            {
                AppUserId = appUser.Id,
                StockId = stock.Id
            };

            await _portfolioRepository.CreateAsync(portfolio);
            if (portfolio == null)
            {
                return StatusCode(500, "could not create portfolio");
            }
            else
            {
                return Created();

            }
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> CreatePortfolio(string symbol)
        {
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);

            var UserPortfolio = await _portfolioRepository.GetUserPortfolio(appUser);
            var FilteredStock = UserPortfolio.Where(s => s.Symbol.ToLower() == symbol.ToLower()).ToList();

            if (FilteredStock.Count() == 1)
            {
                await _portfolioRepository.DeletePortfolio(appUser, symbol);
            }
            else
            {
                return BadRequest("Stock not found in the portfolio");
            };

            return Ok();
        }

    }
}
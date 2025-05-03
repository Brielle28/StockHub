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
        public PortfolioController(UserManager<AppUser> userManager, IStockRepository stockRepository, IPortfolioRepository portfolioRepository )
        {
            _stockRepository = stockRepository;
            _userManager = userManager;
            _portfolioRepository = portfolioRepository;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserPortfolio ()
        {
            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);
            var UserPortfolio = await _portfolioRepository.GetUserPortfolio(appUser);
            return Ok(UserPortfolio);
        }
    }
}
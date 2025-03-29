using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using StockHub_Backend.Data;
using StockHub_Backend.Dtos.Stock;
using StockHub_Backend.Mappers;

namespace StockHub_Backend.Controllers
{
    [Route("stockHub/stocks")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public StockController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]

        public IActionResult GetAll()
        {
            //method 1 - dto using mapper
            var stocks = _context.Stock.ToList()
            .Select(s => s.ToStockDto());
            return Ok (stocks);

            //method 2 - dto creating it manually
            // var stocks = _context.Stock;
            // var stockDto =stocks.Select (stocks =>new StockDto
            // {
            //     Id = stocks.Id,
            //     Symbol = stocks.Symbol,
            //     CompanyName = stocks.CompanyName,
            //     Purchase = stocks.Purchase,
            //     LastDiv = stocks.LastDiv,
            //     Industry = stocks.Industry,
            //     MarketCap = stocks.MarketCap
            // }).ToList();
            // return Ok(stockDto);

        }

        [HttpGet("{id}")]

        public IActionResult GetById([FromRoute] int id)
        {
            var stock = _context.Stock.Find(id);

            if (stock == null)
            {
                return NotFound();
            }
            return Ok(stock.ToStockDto());

        }
    }
}
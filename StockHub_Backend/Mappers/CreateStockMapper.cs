using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockHub_Backend.Dtos.Stock;
using StockHub_Backend.Models;

namespace StockHub_Backend.Mappers
{
    public static class CreateStockMapper
    {

        public static Stock ToCreateStockDto(this CreateStockRequest stockDto) // FIXED!
        {
            return new Stock
            {
                Symbol = stockDto.Symbol,
                CompanyName = stockDto.CompanyName,
                LastDiv = stockDto.LastDiv,
                Purchase = stockDto.Purchase,
                Industry = stockDto.Industry,
                MarketCap = stockDto.MarketCap
            };
        }
    }


}
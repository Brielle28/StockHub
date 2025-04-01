using System;
using StockHub_Backend.Dtos.Stock;
using StockHub_Backend.Models;

namespace StockHub_Backend.Mappers
{
    public static class StockMappers
    {
        public static StockDto ToStockDto(this Stock stockModel)
        {
            return new StockDto
            {
                Id = stockModel.Id,
                Symbol = stockModel.Symbol,
                CompanyName = stockModel.CompanyName,
                LastDiv = stockModel.LastDiv,
                Purchase = stockModel.Purchase,
                Industry = stockModel.Industry,
                MarketCap = stockModel.MarketCap,
                comments = stockModel.Comments.Select( c=>c.ToCommentDto()).ToList()
            };
        }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Dtos.Portfolio
{
   public class UpdatePortfolioDto
    {
        [StringLength(100, MinimumLength = 1)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Description { get; set; }
    }

}
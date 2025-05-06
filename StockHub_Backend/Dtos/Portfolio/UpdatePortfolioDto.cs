using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Dtos.Portfolio
{
    public class UpdatePortfolioDto
    {
        [Required]
        public string Name { get; set; }

        public string Description { get; set; }
    }
}
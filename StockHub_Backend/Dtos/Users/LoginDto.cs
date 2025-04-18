using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Dtos.Users
{
    public class LoginDto
    {
        [Required]
        public string userName { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
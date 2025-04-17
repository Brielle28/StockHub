using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Dtos.Users
{
    public class NewUserDto
    {
        public string Email { get; set; }

        public string UserName { get; set; }

        public string  Token { get; set; }
    }
}
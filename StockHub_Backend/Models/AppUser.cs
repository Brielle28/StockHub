using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace StockHub_Backend.Models
{
    [Table("AppUsers")]
    public class AppUser :IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        public List<Portfolio> Portfolios {get; set;} = new List<Portfolio>();
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockHub_Backend.Models;

namespace StockHub_Backend.Services.TokenServices
{
    public interface ITokenService
    {
        string createToken (AppUser user);
    }
}
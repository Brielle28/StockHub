using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using StockHub_Backend.Models;

namespace StockHub_Backend.Services.TokenServices
{
    public interface ITokenService
    {
        string createToken(AppUser user);
        // string createToken(AppUser user);
        string GenerateAccessToken(AppUser user);
        string GenerateRefreshToken();
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
        bool ValidateRefreshToken(string userId, string refreshToken);
        void StoreRefreshToken(string userId, string refreshToken);
        void RevokeRefreshToken(string userId);
    }
}
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
        // string createToken(AppUser user);
        // string GenerateAccessToken(AppUser user);
        // string GenerateRefreshToken();
        // ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
        // Task<bool> ValidateRefreshTokenAsync(string userId, string refreshToken);
        // Task StoreRefreshTokenAsync(string userId, string refreshToken);
        // Task RevokeRefreshTokenAsync(string userId);
        string createToken(AppUser user); // Keep for backward compatibility if needed
        string GenerateAccessToken(AppUser user);
        string GenerateRefreshToken();
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
        Task<bool> ValidateRefreshTokenAsync(string userId, string refreshToken);
        Task StoreRefreshTokenAsync(string userId, string refreshToken);
        Task RevokeRefreshTokenAsync(string userId);
    }

}
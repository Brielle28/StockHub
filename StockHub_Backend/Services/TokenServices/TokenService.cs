// using System;
// using System.Collections.Generic;
// using System.IdentityModel.Tokens.Jwt;
// using System.Security.Claims;
// using System.Text;
// using Microsoft.IdentityModel.Tokens;
// using StockHub_Backend.Models;

// namespace StockHub_Backend.Services.TokenServices
// {
//     public class TokenService : ITokenService
//     {
//         private readonly IConfiguration _config;
//         private readonly SymmetricSecurityKey _key;

//         public TokenService(IConfiguration config)
//         {
//             _config = config;
//             _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:SigningKey"]));
//         }

//         public string createToken(AppUser user)
//         {
//             var claims = new List<Claim>
//     {
//         new Claim(JwtRegisteredClaimNames.Email, user.Email),
//         new Claim(JwtRegisteredClaimNames.GivenName, user.UserName  ?? string.Empty)
//     };

//             var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

//             var tokenDescriptor = new SecurityTokenDescriptor
//             {
//                 Subject = new ClaimsIdentity(claims),
//                 Expires = DateTime.Now.AddDays(7),
//                 SigningCredentials = creds,
//                 Issuer = _config["JWT:Issuer"],
//                 Audience = _config["JWT:Audience"]
//             };

//             var tokenHandler = new JwtSecurityTokenHandler();
//             var token = tokenHandler.CreateToken(tokenDescriptor);

//             return tokenHandler.WriteToken(token);
//         }

//     }
// }

using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using StockHub_Backend.Models;

namespace StockHub_Backend.Services.TokenServices
{
    // public interface ITokenService
    // {
    //     string createToken(AppUser user);
    //     string GenerateAccessToken(AppUser user);
    //     string GenerateRefreshToken();
    //     ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    //     bool ValidateRefreshToken(string userId, string refreshToken);
    //     void StoreRefreshToken(string userId, string refreshToken);
    //     void RevokeRefreshToken(string userId);
    // }

    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly SymmetricSecurityKey _key;
        
        // Thread-safe in-memory storage for refresh tokens
        private static readonly ConcurrentDictionary<string, string> _refreshTokens = new();

        public TokenService(IConfiguration config)
        {
            _config = config;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:SigningKey"]));
        }

        public string createToken(AppUser user)
        {
            return GenerateAccessToken(user);
        }

        public string GenerateAccessToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id), // User ID
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.GivenName, user.FirstName ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.FamilyName, user.LastName ?? string.Empty),
                new Claim("username", user.UserName ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(15), // Short-lived access token
                SigningCredentials = creds,
                Issuer = _config["JWT:Issuer"],
                Audience = _config["JWT:Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = _key,
                ValidateLifetime = false, // Don't validate expiry
                ValidIssuer = _config["JWT:Issuer"],
                ValidAudience = _config["JWT:Audience"],
                ClockSkew = TimeSpan.Zero
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            
            if (securityToken is not JwtSecurityToken jwtSecurityToken || 
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha512Signature, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token");
            }

            return principal;
        }

        public bool ValidateRefreshToken(string userId, string refreshToken)
        {
            return _refreshTokens.TryGetValue(userId, out var storedToken) && storedToken == refreshToken;
        }

        public void StoreRefreshToken(string userId, string refreshToken)
        {
            _refreshTokens.AddOrUpdate(userId, refreshToken, (key, oldValue) => refreshToken);
        }

        public void RevokeRefreshToken(string userId)
        {
            _refreshTokens.TryRemove(userId, out _);
        }
    }
}
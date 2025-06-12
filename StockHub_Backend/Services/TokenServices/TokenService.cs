using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StockHub_Backend.Data;
using StockHub_Backend.Models;

namespace StockHub_Backend.Services.TokenServices
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly SymmetricSecurityKey _key;
        private readonly ApplicationDBContext _context;

        public TokenService(IConfiguration config, ApplicationDBContext context)
        {
            _config = config;
            _context = context;
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

            // var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512);
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
            try
            {
                Console.WriteLine($"Attempting to validate token: {token?.Substring(0, Math.Min(50, token?.Length ?? 0))}...");

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

                Console.WriteLine($"Token validation parameters:");
                Console.WriteLine($"  ValidIssuer: {_config["JWT:Issuer"]}");
                Console.WriteLine($"  ValidAudience: {_config["JWT:Audience"]}");
                Console.WriteLine($"  SigningKey length: {_key.Key.Length}");

                var tokenHandler = new JwtSecurityTokenHandler();

                // First, try to read the token without validation to see its contents
                var jsonToken = tokenHandler.ReadJwtToken(token);
                Console.WriteLine($"Token issuer: {jsonToken.Issuer}");
                Console.WriteLine($"Token audience: {string.Join(", ", jsonToken.Audiences)}");
                Console.WriteLine($"Token algorithm: {jsonToken.Header.Alg}");
                Console.WriteLine($"Token expiry: {jsonToken.ValidTo}");
                Console.WriteLine($"Token claims: {string.Join(", ", jsonToken.Claims.Select(c => $"{c.Type}:{c.Value}"))}");

                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

                // Fix: Check if securityToken is JwtSecurityToken before casting
                if (securityToken is not JwtSecurityToken jwtSecurityToken)
                {
                    Console.WriteLine("Token validation failed - Security token is not a JWT token");
                    throw new SecurityTokenException("Invalid token - not a JWT token");
                }

                // Now we can safely use jwtSecurityToken
                // if (!jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha512Signature, StringComparison.InvariantCultureIgnoreCase))
                if (!jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha512, StringComparison.InvariantCultureIgnoreCase))
                {
                    Console.WriteLine($"Token validation failed - Algorithm mismatch. Expected: {SecurityAlgorithms.HmacSha512Signature}, Got: {jwtSecurityToken.Header.Alg}");
                    throw new SecurityTokenException("Invalid token - algorithm mismatch");
                }

                Console.WriteLine("Token validation successful");
                return principal;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Token validation exception: {ex.Message}");
                Console.WriteLine($"Exception type: {ex.GetType().Name}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task<bool> ValidateRefreshTokenAsync(string userId, string refreshToken)
        {
            Console.WriteLine($"Validating refresh token for user: {userId}");
            Console.WriteLine($"Looking for refresh token: {refreshToken}");

            var storedToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.UserId == userId &&
                                          rt.Token == refreshToken &&
                                          !rt.IsRevoked &&
                                          rt.ExpiresAt > DateTime.UtcNow);

            Console.WriteLine($"Found stored token: {storedToken != null}");
            return storedToken != null;
        }

        public async Task StoreRefreshTokenAsync(string userId, string refreshToken)
        {
            Console.WriteLine($"Storing refresh token for user: {userId}");

            // Revoke existing tokens for this user
            var existingTokens = await _context.RefreshTokens
                .Where(rt => rt.UserId == userId && !rt.IsRevoked)
                .ToListAsync();

            Console.WriteLine($"Found {existingTokens.Count} existing tokens to revoke");

            foreach (var token in existingTokens)
            {
                token.IsRevoked = true;
            }

            // Add new token
            var newRefreshToken = new RefreshToken
            {
                Token = refreshToken,
                UserId = userId,
                ExpiresAt = DateTime.UtcNow.AddDays(7), // 7 days expiry
                CreatedAt = DateTime.UtcNow,
                IsRevoked = false
            };

            _context.RefreshTokens.Add(newRefreshToken);
            await _context.SaveChangesAsync();

            Console.WriteLine("Refresh token stored successfully");
        }

        public async Task RevokeRefreshTokenAsync(string userId)
        {
            var tokens = await _context.RefreshTokens
                .Where(rt => rt.UserId == userId && !rt.IsRevoked)
                .ToListAsync();

            foreach (var token in tokens)
            {
                token.IsRevoked = true;
            }

            await _context.SaveChangesAsync();
        }
    }
}
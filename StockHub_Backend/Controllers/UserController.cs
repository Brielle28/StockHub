// // using System;
// // using System.Threading.Tasks;
// // using Microsoft.AspNetCore.Identity;
// // using Microsoft.AspNetCore.Mvc;
// // using Microsoft.EntityFrameworkCore;
// // using StockHub_Backend.Dtos.Users;
// // using StockHub_Backend.Models;
// // using StockHub_Backend.Services.TokenServices;

// // namespace StockHub_Backend.Controllers
// // {
// //     [Route("StockHub/users")]
// //     [ApiController]
// //     public class UserController : ControllerBase
// //     {
// //         private readonly UserManager<AppUser> _userManager;
// //         private readonly ITokenService _tokenService;
// //         private readonly SignInManager<AppUser> _signInManager;

// //         public UserController(UserManager<AppUser> userManager, ITokenService tokenService, SignInManager<AppUser> signInManager)
// //         {
// //             _userManager = userManager;
// //             _tokenService = tokenService;
// //             _signInManager = signInManager;
// //         }
        
// //         [HttpPost("login")]
// //         public async Task<IActionResult> Login(LoginDto login)
// //         {
// //             if (!ModelState.IsValid)
// //                 return BadRequest(ModelState);

// //             var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == login.userName.ToLower());

// //             if (user == null)
// //                 return Unauthorized("Invalid username");

// //             var result = await _signInManager.CheckPasswordSignInAsync(user, login.Password, false);

// //             if (!result.Succeeded)
// //                 return Unauthorized("Username not found or invalid password");

// //             return Ok(new NewUserDto
// //             {
// //                 UserName = user.UserName,
// //                 Email = user.Email,
// //                 Token = _tokenService.createToken(user)
// //             });
// //         }

// //         [HttpPost("register")]
// //         public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDto registerUserDto)
// //         {
// //             try
// //             {
// //                 if (!ModelState.IsValid)
// //                     return BadRequest(ModelState);

// //                 // ✅ Check if email already exists
// //                 var emailExists = await _userManager.FindByEmailAsync(registerUserDto.Email);
// //                 if (emailExists != null)
// //                     return BadRequest(new { message = "Email is already taken. Please use a different one." });

// //                 // ✅ Check if username already exists
// //                 var userNameExists = await _userManager.FindByNameAsync(registerUserDto.UserName);
// //                 if (userNameExists != null)
// //                     return BadRequest(new { message = "Username is already taken. Please choose another one." });

// //                 var appUser = new AppUser
// //                 {
// //                     UserName = registerUserDto.UserName,
// //                     FirstName = registerUserDto.FirstName,
// //                     LastName = registerUserDto.LastName,
// //                     Email = registerUserDto.Email,
// //                 };

// //                 var createdUser = await _userManager.CreateAsync(appUser, registerUserDto.Password);

// //                 if (!createdUser.Succeeded)
// //                     return StatusCode(500, new { message = "Failed to create user", errors = createdUser.Errors });

// //                 var roleResult = await _userManager.AddToRoleAsync(appUser, "User");

// //                 if (!roleResult.Succeeded)
// //                     return StatusCode(500, new { message = "Failed to assign role", errors = roleResult.Errors });

// //                 return Ok(new NewUserDto
// //                 {
// //                     UserName = appUser.UserName,
// //                     Email = appUser.Email,
// //                     Token = _tokenService.createToken(appUser)
// //                 });
// //             }
// //             catch (Exception ex)
// //             {
// //                 return StatusCode(500, new { message = "An unexpected error occurred", details = ex.Message });
// //             }
// //         }
// //     }
// // }
// using System;
// using System.Linq;
// using System.Threading.Tasks;
// using Microsoft.AspNetCore.Identity;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using StockHub_Backend.Dtos.Users;
// using StockHub_Backend.Models;
// using StockHub_Backend.Services.TokenServices;

// namespace StockHub_Backend.Controllers
// {
//     [Route("StockHub/users")]
//     [ApiController]
//     public class UserController : ControllerBase
//     {
//         private readonly UserManager<AppUser> _userManager;
//         private readonly ITokenService _tokenService;
//         private readonly SignInManager<AppUser> _signInManager;

//         public UserController(UserManager<AppUser> userManager, ITokenService tokenService, SignInManager<AppUser> signInManager)
//         {
//             _userManager = userManager;
//             _tokenService = tokenService;
//             _signInManager = signInManager;
//         }

//         [HttpPost("login")]
//         public async Task<IActionResult> Login(LoginDto login)
//         {
//             if (!ModelState.IsValid)
//                 return BadRequest(ModelState);

//             var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == login.userName.ToLower());

//             if (user == null)
//                 return Unauthorized(new { message = "Invalid username" });

//             var result = await _signInManager.CheckPasswordSignInAsync(user, login.Password, false);

//             if (!result.Succeeded)
//                 return Unauthorized(new { message = "Username not found or invalid password" });

//             return Ok(new NewUserDto
//             {
//                 UserName = user.UserName,
//                 Email = user.Email,
//                 Token = _tokenService.createToken(user)
//             });
//         }

//         [HttpPost("register")]
//         public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDto registerUserDto)
//         {
//             try
//             {
//                 if (!ModelState.IsValid)
//                     return BadRequest(new { 
//                         message = "Invalid input data", 
//                         errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) 
//                     });

//                 // Check if email already exists
//                 var emailExists = await _userManager.FindByEmailAsync(registerUserDto.Email);
//                 if (emailExists != null)
//                     return BadRequest(new { message = "Email is already taken. Please use a different one." });

//                 // Check if username already exists
//                 var userNameExists = await _userManager.FindByNameAsync(registerUserDto.UserName);
//                 if (userNameExists != null)
//                     return BadRequest(new { message = "Username is already taken. Please choose another one." });

//                 var appUser = new AppUser
//                 {
//                     UserName = registerUserDto.UserName,
//                     FirstName = registerUserDto.FirstName,
//                     LastName = registerUserDto.LastName,
//                     Email = registerUserDto.Email,
//                 };

//                 var createdUser = await _userManager.CreateAsync(appUser, registerUserDto.Password);

//                 // ✅ Changed from 500 to 400 for validation errors
//                 if (!createdUser.Succeeded)
//                 {
//                     var errors = createdUser.Errors.Select(e => new { 
//                         code = e.Code, 
//                         description = e.Description 
//                     });
                    
//                     return BadRequest(new { 
//                         message = "Failed to create user. Please check the requirements below.", 
//                         errors = errors 
//                     });
//                 }

//                 var roleResult = await _userManager.AddToRoleAsync(appUser, "User");

//                 if (!roleResult.Succeeded)
//                 {
//                     // If role assignment fails, we should probably delete the user that was just created
//                     await _userManager.DeleteAsync(appUser);
//                     return StatusCode(500, new { 
//                         message = "Failed to assign user role. Please try again.", 
//                         errors = roleResult.Errors.Select(e => e.Description) 
//                     });
//                 }

//                 return Ok(new NewUserDto
//                 {
//                     UserName = appUser.UserName,
//                     Email = appUser.Email,
//                     Token = _tokenService.createToken(appUser)
//                 });
//             }
//             catch (Exception ex)
//             {
//                 // Log the exception here (use ILogger)
//                 return StatusCode(500, new { 
//                     message = "An unexpected error occurred. Please try again later.",
//                     // Don't expose internal details in production
//                     #if DEBUG
//                     details = ex.Message
//                     #endif
//                 });
//             }
//         }
//     }
// }
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockHub_Backend.Dtos.Users;
using StockHub_Backend.Models;
using StockHub_Backend.Services.TokenServices;

namespace StockHub_Backend.Controllers
{
    [Route("StockHub/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;

        public UserController(UserManager<AppUser> userManager, ITokenService tokenService, SignInManager<AppUser> signInManager)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto login)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == login.userName.ToLower());

            if (user == null)
                return Unauthorized(new { message = "Invalid username" });

            var result = await _signInManager.CheckPasswordSignInAsync(user, login.Password, false);

            if (!result.Succeeded)
                return Unauthorized(new { message = "Username not found or invalid password" });

            // Generate both access and refresh tokens
            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();
            
            // Store refresh token
            _tokenService.StoreRefreshToken(user.Id, refreshToken);

            return Ok(new AuthenticationResponseDto
            {
                UserName = user.UserName,
                Email = user.Email,
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15) // Match token expiry
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDto registerUserDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { 
                        message = "Invalid input data", 
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) 
                    });

                // Check if email already exists
                var emailExists = await _userManager.FindByEmailAsync(registerUserDto.Email);
                if (emailExists != null)
                    return BadRequest(new { message = "Email is already taken. Please use a different one." });

                // Check if username already exists
                var userNameExists = await _userManager.FindByNameAsync(registerUserDto.UserName);
                if (userNameExists != null)
                    return BadRequest(new { message = "Username is already taken. Please choose another one." });

                var appUser = new AppUser
                {
                    UserName = registerUserDto.UserName,
                    FirstName = registerUserDto.FirstName,
                    LastName = registerUserDto.LastName,
                    Email = registerUserDto.Email,
                };

                var createdUser = await _userManager.CreateAsync(appUser, registerUserDto.Password);

                if (!createdUser.Succeeded)
                {
                    var errors = createdUser.Errors.Select(e => new { 
                        code = e.Code, 
                        description = e.Description 
                    });
                    
                    return BadRequest(new { 
                        message = "Failed to create user. Please check the requirements below.", 
                        errors = errors 
                    });
                }

                var roleResult = await _userManager.AddToRoleAsync(appUser, "User");

                if (!roleResult.Succeeded)
                {
                    await _userManager.DeleteAsync(appUser);
                    return StatusCode(500, new { 
                        message = "Failed to assign user role. Please try again.", 
                        errors = roleResult.Errors.Select(e => e.Description) 
                    });
                }

                // Generate both access and refresh tokens for new user
                var accessToken = _tokenService.GenerateAccessToken(appUser);
                var refreshToken = _tokenService.GenerateRefreshToken();
                
                // Store refresh token
                _tokenService.StoreRefreshToken(appUser.Id, refreshToken);

                return Ok(new AuthenticationResponseDto
                {
                    UserName = appUser.UserName,
                    Email = appUser.Email,
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(15)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "An unexpected error occurred. Please try again later.",
                    #if DEBUG
                    details = ex.Message
                    #endif
                });
            }
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { 
                        message = "Invalid request", 
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) 
                    });

                // Extract claims from expired token without validating expiry
                var principal = _tokenService.GetPrincipalFromExpiredToken(request.AccessToken);
                var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                           ?? principal.FindFirst("sub")?.Value;

                if (string.IsNullOrEmpty(userId))
                    return BadRequest(new { message = "Invalid access token" });

                // Validate refresh token
                if (!_tokenService.ValidateRefreshToken(userId, request.RefreshToken))
                    return Unauthorized(new { message = "Invalid or expired refresh token" });

                // Get user from database
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                    return Unauthorized(new { message = "User not found" });

                // Generate new tokens
                var newAccessToken = _tokenService.GenerateAccessToken(user);
                var newRefreshToken = _tokenService.GenerateRefreshToken();

                // Update stored refresh token (invalidate old one)
                _tokenService.StoreRefreshToken(userId, newRefreshToken);

                return Ok(new TokenResponseDto
                {
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(15)
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    message = "Invalid token or token format",
                    #if DEBUG
                    details = ex.Message
                    #endif
                });
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                // Extract user ID from JWT claims
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                           ?? User.FindFirst("sub")?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { message = "Invalid token claims" });

                // Get user from database
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                    return NotFound(new { message = "User not found" });

                // Return user profile information
                return Ok(new UserProfileDto
                {
                    Id = user.Id,
                    UserName = user.UserName ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    FirstName = user.FirstName ?? string.Empty,
                    LastName = user.LastName ?? string.Empty
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "An error occurred while retrieving user information",
                    #if DEBUG
                    details = ex.Message
                    #endif
                });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            try
            {
                // Extract user ID from JWT claims
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                           ?? User.FindFirst("sub")?.Value;

                if (!string.IsNullOrEmpty(userId))
                {
                    // Revoke refresh token
                    _tokenService.RevokeRefreshToken(userId);
                }

                return Ok(new { message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "An error occurred during logout",
                    #if DEBUG
                    details = ex.Message
                    #endif
                });
            }
        }
    }
}
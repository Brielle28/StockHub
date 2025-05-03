using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StockHub_Backend.Dtos.Users;
using StockHub_Backend.Models;
using StockHub_Backend.Services.TokenServices;
using StockHub_Backend.Services.EmailServices;

namespace StockHub_Backend.Controllers
{
    [Route("StockHub/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;

        private readonly ITokenService _tokenService;

        private readonly SignInManager<AppUser> _signInManger;

        private readonly IEmailService _emailService;

        public UserController(UserManager<AppUser> userManager, ITokenService tokenService, SignInManager<AppUser> signInManager, IEmailService emailService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManger = signInManager;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto login)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == login.userName.ToLower());

            if (user == null)
                return Unauthorized("Invalid username");

            // Check if email is confirmed
            // if (!user.EmailConfirmed)
            //     return Unauthorized("Please confirm your email before logging in. Check your inbox for the confirmation link.");

            var result = await _signInManger.CheckPasswordSignInAsync(user, login.Password, false);

            if (!result.Succeeded)
                return Unauthorized("Invalid password");

            return Ok(new NewUserDto
            {
                UserName = user.UserName,
                Email = user.Email,
                Token = _tokenService.createToken(user)
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDto registerUserDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var AppUser = new AppUser
                {
                    UserName = registerUserDto.UserName,
                    FirstName = registerUserDto.FirstName,
                    LastName = registerUserDto.LastName,
                    Email = registerUserDto.Email,
                };

                var createdUser = await _userManager.CreateAsync(AppUser, registerUserDto.Password);

                if (createdUser.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(AppUser, "User");
                    if (roleResult.Succeeded)
                    {
                        // Generate email confirmation token
                        var token = await _userManager.GenerateEmailConfirmationTokenAsync(AppUser);

                        // Create confirmation link
                        var confirmationLink = Url.Action("ConfirmEmail", "User",
                            new { userId = AppUser.Id, token = WebUtility.UrlEncode(token) },
                            Request.Scheme);

                        // Send confirmation email
                        await _emailService.SendEmailAsync(
                            AppUser.Email,
                            "Confirm your StockHub account",
                            $"Please confirm your account by clicking this link: <a href='{confirmationLink}'>Confirm Email</a>");

                        return Ok(new
                        {
                            Message = "User created successfully! Please check your email to confirm your account.",
                            UserName = AppUser.UserName,
                            Email = AppUser.Email
                        });
                    }
                    else
                    {
                        return StatusCode(500, roleResult.Errors);
                    }
                }
                else
                {
                    return StatusCode(500, createdUser.Errors);
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        [HttpGet("confirmemail")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token))
                return BadRequest("Invalid email confirmation link");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return BadRequest("User not found");

            // Decode the token (it was URL-encoded when we created the link)
            token = WebUtility.UrlDecode(token);

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
            {
                // For API, you might want to redirect to a frontend page instead
                // return Redirect("https://your-frontend-app.com/email-confirmed");

                return Ok("Email confirmed successfully. You can now log in.");
            }

            return BadRequest("Email confirmation failed. The link may be invalid or expired.");
        }

        [HttpPost("resend-confirmation-email")]
        public async Task<IActionResult> ResendConfirmationEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return BadRequest("User not found");

            if (user.EmailConfirmed)
                return BadRequest("Email is already confirmed");

            // Generate email confirmation token
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            // Create confirmation link
            var confirmationLink = Url.Action("ConfirmEmail", "User",
                new { userId = user.Id, token = WebUtility.UrlEncode(token) },
                Request.Scheme);

            // Send confirmation email
            await _emailService.SendEmailAsync(
                user.Email,
                "Confirm your StockHub account",
                $"Please confirm your account by clicking this link: <a href='{confirmationLink}'>Confirm Email</a>");

            return Ok("Confirmation email has been resent. Please check your inbox.");
        }

    }
}
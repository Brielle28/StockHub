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

            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                return Unauthorized("Please confirm your email before logging in.");
            }

            var result = await _signInManger.CheckPasswordSignInAsync(user, login.Password, false);

            if (!result.Succeeded)
                return Unauthorized("Username not found or Invalid password");

            return Ok(new NewUserDto
            {
                UserName = user.UserName,
                Email = user.Email,
                Token = _tokenService.createToken(user)
            });
        }


        // [HttpPost("register")]
        // public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDto registerUserDto)
        // {
        //     try
        //     {
        //         if (!ModelState.IsValid)
        //         {
        //             return BadRequest(ModelState);
        //         }
        //         var AppUser = new AppUser
        //         {
        //             UserName = registerUserDto.UserName,
        //             FirstName = registerUserDto.FirstName,
        //             LastName = registerUserDto.LastName,
        //             Email = registerUserDto.Email,

        //         };

        //         var createdUser = await _userManager.CreateAsync(AppUser, registerUserDto.Password);

        //         if (createdUser.Succeeded)
        //         {
        //             var roleResult = await _userManager.AddToRoleAsync(AppUser, "User");
        //             if (roleResult.Succeeded)
        //             {
        //                 return Ok(
        //                     new NewUserDto
        //                     {
        //                         UserName = AppUser.UserName,
        //                         Email = AppUser.Email,
        //                         Token = _tokenService.createToken(AppUser)
        //                     }
        //                 );
        //             }
        //             else
        //             {
        //                 return StatusCode(500, roleResult.Errors);
        //             }
        //         }
        //         else
        //         {
        //             return StatusCode(500, createdUser.Errors);
        //         }
        //     }
        //     catch (Exception e)
        //     {
        //         return StatusCode(500, e);
        //     }
        // }
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDto registerUserDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var appUser = new AppUser
                {
                    UserName = registerUserDto.UserName,
                    FirstName = registerUserDto.FirstName,
                    LastName = registerUserDto.LastName,
                    Email = registerUserDto.Email
                };

                var createdUser = await _userManager.CreateAsync(appUser, registerUserDto.Password);

                if (!createdUser.Succeeded)
                {
                    return StatusCode(500, createdUser.Errors);
                }

                var roleResult = await _userManager.AddToRoleAsync(appUser, "User");
                if (!roleResult.Succeeded)
                {
                    return StatusCode(500, roleResult.Errors);
                }

                // ✅ Generate email confirmation token
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(appUser);

                // ✅ Create confirmation link
                var confirmationLink = Url.Action(
                    nameof(ConfirmEmail), // Action name
                    "User",               // Controller name
                    new { userId = appUser.Id, token = WebUtility.UrlEncode(token) },
                    Request.Scheme);      // e.g., https

                // ✅ Send the email
                await _emailService.SendEmailAsync(
                    appUser.Email,
                    "Confirm your email",
                    $"<p>Hello {appUser.FirstName},</p><p>Please confirm your email by clicking the link below:</p><p><a href='{confirmationLink}'>Confirm Email</a></p><p>This link expires in 24 hours.</p>");

                // ✅ Return minimal response, let user know to check email
                return Ok(new
                {
                    Message = "User created successfully. Please check your email to confirm your account."
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpGet("confirmemail")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return BadRequest("Invalid user");

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
                return Ok("Email confirmed successfully. You can now log in.");

            return BadRequest("Email confirmation failed.");
        }

    }
}
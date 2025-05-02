using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Options;
using StockHub_Backend.Models;
using StockHub_Backend.Services.EmailServices;

// namespace StockHub_Backend.Services.EmailServices
// {
//     public class EmailService : IEmailService
//     {
//         private readonly EmailSettings _settings;

//         public EmailService(IOptions<EmailSettings> settings)
//         {
//             _settings = settings.Value;
//         }
//         public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
//         {
//             var email = new MimeMessage();
//             email.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
//             email.To.Add(MailboxAddress.Parse(toEmail));
//             email.Subject = subject;

//             var builder = new BodyBuilder { HtmlBody = htmlMessage };
//             email.Body = builder.ToMessageBody();

//             using var smtp = new SmtpClient();
//             await smtp.ConnectAsync(_settings.SmtpServer, _settings.Port, MailKit.Security.SecureSocketOptions.StartTls);
//             await smtp.AuthenticateAsync(_settings.Username, _settings.Password);
//             await smtp.SendAsync(email);
//             await smtp.DisconnectAsync(true);
//         }
//     }

// }
// public class EmailService : IEmailService
// {
//     private readonly EmailSettings _emailSettings;
//     private readonly ILogger<EmailService> _logger;

//     public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
//     {
//         _emailSettings = emailSettings.Value;
//         _logger = logger;
//     }

//     public async Task SendEmailAsync(string to, string subject, string body)
//     {
//         try
//         {
//             var message = new MimeMessage();
//             message.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
//             message.To.Add(new MailboxAddress("", to));
//             message.Subject = subject;

//             var bodyBuilder = new BodyBuilder
//             {
//                 HtmlBody = body
//             };

//             message.Body = bodyBuilder.ToMessageBody();

//             using (var client = new SmtpClient())
//             {
//                 await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port, _emailSettings.UseSsl);
                
//                 if (!string.IsNullOrEmpty(_emailSettings.Username) && !string.IsNullOrEmpty(_emailSettings.Password))
//                 {
//                     await client.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
//                 }
                
//                 await client.SendAsync(message);
//                 await client.DisconnectAsync(true);
//             }
            
//             _logger.LogInformation($"Email sent successfully to {to}");
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError($"Failed to send email to {to}. Error: {ex.Message}");
//             throw;
//         }
//     }
// }
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using StockHub_Backend.Services.EmailServices;

namespace StockHub_Backend.Services.EmailServices
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
        {
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
                message.To.Add(new MailboxAddress("", to));
                message.Subject = subject;

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = body
                };

                message.Body = bodyBuilder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    // Connect to SMTP server with STARTTLS
                    await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
                    
                    // Authenticate if credentials are provided
                    if (!string.IsNullOrEmpty(_emailSettings.Username) && !string.IsNullOrEmpty(_emailSettings.Password))
                    {
                        await client.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
                    }
                    
                    // Send the email
                    await client.SendAsync(message);
                    
                    // Disconnect
                    await client.DisconnectAsync(true);
                }
                
                _logger.LogInformation($"Email sent successfully to {to}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to send email to {to}. Error: {ex.Message}");
                throw;
            }
        }
    }
}
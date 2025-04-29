using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Services.EmailServices
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string htmlMessage);
    }
}
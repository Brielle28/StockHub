// using System;
// using System.Collections.Generic;
// using System.ComponentModel.DataAnnotations;
// using System.ComponentModel.DataAnnotations.Schema;
// using Microsoft.AspNetCore.Identity;

// namespace StockHub_Backend.Models
// {
//     public class Portfolio
//     {
//         [Key]
//         public int Id { get; set; }
        
//         [Required]
//         public string Name { get; set; }
        
//         public string Description { get; set; }
        
//         [Required]
//         public string AppUserId { get; set; }
        
//         [ForeignKey("AppUserId")]
//         public AppUser AppUser { get; set; }
        
//         public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
//         public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
//         // Navigation property for stocks in this portfolio
//         public ICollection<PortfolioStock> PortfolioStocks { get; set; }
//     }
// }
// Portfolio.cs - Completely independent of Stock entity
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace StockHub_Backend.Models
{
    public class Portfolio
    {
        [Key]
        public int Id { get; set; }
       
        [Required]
        public string Name { get; set; }
       
        public string Description { get; set; }
       
        [Required]
        public string AppUserId { get; set; }
       
        [ForeignKey("AppUserId")]
        public AppUser AppUser { get; set; }
       
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
       
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
       
        // Navigation property for stocks in this portfolio
        public ICollection<PortfolioStock> PortfolioStocks { get; set; }
    }
}


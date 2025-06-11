using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StockHub_Backend.Models
{
    public class PortfolioStock
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PortfolioId { get; set; }

        [ForeignKey("PortfolioId")]
        public Portfolio Portfolio { get; set; }

        // Store stock information directly without foreign key relationship
        [Required]
        [MaxLength(10)]
        public string Symbol { get; set; }

        [Required]
        public decimal Quantity { get; set; }

        [Required]
        public decimal PurchasePrice { get; set; }

        [Required]
        public DateTime PurchaseDate { get; set; }

        // Optional: Store current price for caching (can be updated separately)
        public decimal? CurrentPrice { get; set; }
        public decimal? Change { get; set; }          // Absolute change
        public decimal? ChangePercent { get; set; }   // Percentage change
        public DateTime? LastUpdated { get; set; }

        // Optional: Store additional stock metadata
        public string? Exchange { get; set; }
        public string Currency { get; set; } = "USD";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public decimal? PreviousClose { get; set; }

    }
}
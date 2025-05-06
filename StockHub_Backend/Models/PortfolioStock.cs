using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Models
{
     // New join entity to represent stocks in a portfolio with purchase details
    public class PortfolioStock
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int PortfolioId { get; set; }
        
        [ForeignKey("PortfolioId")]
        public Portfolio Portfolio { get; set; }
        
        [Required]
        public int StockId { get; set; }
        
        [ForeignKey("StockId")]
        public Stock Stock { get; set; }
        
        [Required]
        public decimal Quantity { get; set; }
        
        [Required]
        public decimal PurchasePrice { get; set; }
        
        [Required]
        public DateTime PurchaseDate { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
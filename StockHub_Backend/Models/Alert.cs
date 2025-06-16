using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Models
{
     public class Alert
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        [Required]
        [StringLength(10)]
        public string Symbol { get; set; } = string.Empty;
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TargetPrice { get; set; }
        
        [Required]
        public AlertCondition Condition { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? TriggeredAt { get; set; }
    }

    public enum AlertCondition
    {
        GREATER_THAN,
        LESS_THAN,
        EQUALS
    }
}
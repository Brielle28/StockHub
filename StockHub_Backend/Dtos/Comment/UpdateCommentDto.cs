using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Dtos.Comment
{
    public class UpdateCommentDto
    {
        
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }
    
}
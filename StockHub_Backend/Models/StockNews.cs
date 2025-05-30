using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockHub_Backend.Models
{
     public class StockNews
    {
        public string Title { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
        public DateTime PublishedAt { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public List<string> RelatedSymbols { get; set; } = new();
    }
}
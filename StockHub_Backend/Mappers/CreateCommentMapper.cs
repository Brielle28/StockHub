using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockHub_Backend.Dtos.Comment;
using StockHub_Backend.Models;

namespace StockHub_Backend.Mappers
{
    public static class CreateCommentMapper
    {
        public static Comment ToCreateCommentDto(this  CreateCommentDto CreateComment, int stockId)
        {
            return new Comment
            {
                
                Title = CreateComment.Title,
                Content = CreateComment.Content,
                StockId = stockId
            };
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StockHub_Backend.Dtos.Comment;
using StockHub_Backend.Models;

namespace StockHub_Backend.Mappers
{
    public static class CommentMapper
    {
       public static CommentDto ToCommentDto(this Comment comment) 
       {
        return new CommentDto
        {
            StockId = comment.StockId,
            Id = comment.Id,
            Title = comment.Title,
            Content = comment.Content,
            CreatedOn = comment.CreatedOn
        };
       }
    }
}
using System.Collections.Generic;
using System.Threading.Tasks;
using StockHub_Backend.Dtos.Comment;
using StockHub_Backend.Models;

namespace StockHub_Backend.Interfaces
{
    public interface ICommentRepository
    {
        Task<List<Comment>> GetAllAsync();
        Task<Comment?> GetByIdAsync(int id);
        Task<Comment> CreateAsync(Comment commentModel);
        Task<Comment?> UpdateAsync(int id,  UpdateCommentDto updatedComment);
    }
}

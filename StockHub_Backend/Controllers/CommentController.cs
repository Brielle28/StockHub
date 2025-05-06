using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StockHub_Backend.Dtos.Comment;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Mappers;
using StockHub_Backend.Models;

namespace StockHub_Backend.Controllers
{
    [Route("StockHub/comment")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository _commentRepository;
        private readonly IStockRepository _stockRepository;

        public CommentController(ICommentRepository commentRepository, IStockRepository stockRepository)
        {
            _commentRepository = commentRepository;
            _stockRepository = stockRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var comments = await _commentRepository.GetAllAsync();
            var commentDtos = comments.Select(s => s.ToCommentDto());
            return Ok(commentDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var comment = await _commentRepository.GetByIdAsync(id);
            if (comment == null)
            {
                return NotFound();
            }
            return Ok(comment.ToCommentDto());
        }

        [HttpPost("{stockId}")]
        public async Task<IActionResult> Create([FromRoute] int stockId, [FromBody] CreateCommentDto commentDto)
        {
            if (!await _stockRepository.stockExists(stockId))
            {
                return BadRequest("Stock not found.");
            }

            var commentModel = new Comment
            {
                StockId = stockId,
                Title = commentDto.Title,
                Content = commentDto.Content,
                CreatedOn = DateTime.UtcNow
            };

            var createdComment = await _commentRepository.CreateAsync(commentModel);
            return CreatedAtAction(nameof(GetById), new { id = createdComment.Id }, createdComment.ToCommentDto());
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateCommentDto incomingUpdate)
        {
            var updatedComment = await _commentRepository.UpdateAsync(id, incomingUpdate);

            if (updatedComment == null)
            {
                return NotFound("Comment not found.");
            }

            return Ok(updatedComment.ToCommentDto());
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete ([FromRoute] int id)
        {
            var comment = await _commentRepository.DeleteAsync(id);
            if (comment == null)
            {
                return NotFound("comment not found");
            }
            return Ok(comment);
        }

    }
}

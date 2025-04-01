using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Mappers; 

namespace StockHub_Backend.Controllers
{
    [Route("api/comment")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository _Commentcontext;
        public CommentController(ICommentRepository context)
        {
            _Commentcontext = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var comments = await _Commentcontext.GetAllAsync();
            var CommentDto = comments.Select(s => s.ToCommentDto());
            return Ok(CommentDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById ([FromRoute] int id)
        {
            var comment = await _Commentcontext.GetByIdAsync(id);
            if (comment == null)
            {
                return NotFound();
            }
            return Ok(comment.ToCommentDto());
        }
    }
}
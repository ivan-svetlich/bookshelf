using Bookshelf.Configuration;
using Bookshelf.Data;
using Bookshelf.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Bookshelf.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly BookContext _context;
        private readonly UserManager<User> _userManager;
        private readonly LocalStorageConfig _localStorageConfig;

        public CommentsController(
            BookContext context, 
            UserManager<User> userManager,
            IOptionsMonitor<LocalStorageConfig> storageOptionsMonitor)
        {
            _context = context;
            _localStorageConfig = storageOptionsMonitor.CurrentValue;
            _userManager = userManager;
        }

        [HttpPost]
        [Route("{username}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> SubmitComment(string username, [FromBody] CommentRequest commentForm)
        {
            User user = await AuthenticateUser();

            if (user == null)
            {
                return Unauthorized("Unauthorized");
            }

            User profile = await _userManager.FindByNameAsync(username);

            if (profile == null)
            {
                return BadRequest("Invalid profile ");
            }

            Comment Comment = new Comment
            {
                SubmitterId = user.Id,
                ProfileId = profile.Id,
                Body = commentForm.Body,
                CreatedAt = DateTime.UtcNow,
                IsRead = user.Id == profile.Id ? true : false,
            };

            try
            {
                _context.Comments.Add(Comment);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("{username}")]
        [Route("GetAll")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetAllComments(string username)
        {
            User user = await AuthenticateUser();

            if (user == null)
            {
                return Unauthorized("Unauthorized");
            }

            User target = await _userManager.Users.FirstOrDefaultAsync(user => user.UserName == username);

            var query = _context.Comments
                .Where(x => x.ProfileId == target.Id)
                .Select(x => x);

            var comments = await query.ToListAsync();

            foreach(Comment comment in query)
            {
                comment.IsRead = true;
            }

            return await ToDTOAsync(comments);
        }

        private async Task<List<CommentDto>> ToDTOAsync(List<Comment> Comments)
        {
            List<CommentDto> commentList = new List<CommentDto>();
            foreach(Comment Comment in Comments)
            {
                User Submitter = await _userManager.FindByIdAsync(Comment.SubmitterId);

                byte[] imageBytes = null;

                var fileName = Path.GetFileNameWithoutExtension(
                        Submitter.Id);

                var imageFile = Directory.GetFiles(_localStorageConfig.PathName, fileName + ".*");

                if (imageFile.Length > 0)
                {
                    imageBytes = await System.IO.File.ReadAllBytesAsync(imageFile[0]);
                }

                commentList.Add(new CommentDto
                {
                    Id = Comment.Id,
                    SubmitterUsername = Submitter.UserName,
                    ProfileId = Comment.ProfileId,
                    Body = Comment.Body,
                    SubmitterPicture = imageBytes,
                    CreatedAt = Comment.CreatedAt,
                    New = Comment.IsRead,
                });
            }

            return commentList;
        }

        private async Task<User> AuthenticateUser()
        {
            var identity = User.FindFirst(ClaimTypes.NameIdentifier);

            if (identity == null)
            {
                return null;
            }

            User user = await _userManager.FindByIdAsync(identity.Value);

            if (user == null)
            {
                return null;
            }

            user.LastOnline = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return user;
        }
    }
}

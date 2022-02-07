using Bookshelf.Data;
using Bookshelf.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Bookshelf.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly BookContext _context;
        private readonly UserManager<User> _userManager;

        public NotificationsController(
            BookContext context,
            UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }


        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> getNotifications()
        {
            User user = await AuthenticateUser();

            if (user == null)
            {
                return Unauthorized("Unauthorized");
            }

            List<NotificationDto> notifications = new List<NotificationDto>();

            try
            {
                var friendsQuery =
                from friend in _context.Friends
                where (friend.UserId2 == user.Id && friend.Accepted == false && friend.IsRead == false)
                join _user in _context.Users on friend.UserId1 equals _user.Id
                select new NotificationDto
                {
                    Id = friend.Id,
                    Category = "Friend request",
                    CreatedAt = friend.CreatedAt,
                    IsRead = friend.IsRead,
                    Reference = _user.UserName
                };

                var pendingRequests = await friendsQuery.ToListAsync();

                notifications.AddRange(pendingRequests);

                var commentsQuery =
                    from comment in _context.Comments
                    where (comment.ProfileId == user.Id && comment.SubmitterId != user.Id && comment.IsRead == false)
                    join _user in _context.Users on comment.SubmitterId equals _user.Id
                    select new NotificationDto
                    {
                        Id = comment.Id,
                        Category = "New comment",
                        CreatedAt = comment.CreatedAt,
                        IsRead = comment.IsRead,
                        Reference = _user.UserName
                    };

                var newComments = await commentsQuery.ToListAsync();

                notifications.AddRange(newComments);

                return notifications;
            }
            catch
            {
                return StatusCode(500);
            }

        }

        [HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> markAsRead()
        {
            User user = await AuthenticateUser();

            if (user == null)
            {
                return Unauthorized("Unauthorized");
            }

            try
            {
                var friendsQuery =
                from friend in _context.Friends
                where (friend.UserId2 == user.Id && friend.Accepted == false)
                join _user in _context.Users on friend.UserId1 equals _user.Id
                select friend;

                foreach(FriendRequest friend in friendsQuery)
                {
                    friend.IsRead = true;
                }

                var commentsQuery =
                    from comment in _context.Comments
                    where (comment.ProfileId == user.Id && comment.SubmitterId != user.Id)
                    join _user in _context.Users on comment.SubmitterId equals _user.Id
                    select comment;

                foreach (Comment comment in commentsQuery)
                {
                    comment.IsRead = true;
                }

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch
            {
                return StatusCode(500);
            }
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

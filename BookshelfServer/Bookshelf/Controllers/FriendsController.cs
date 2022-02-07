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
    public class FriendsController : ControllerBase
    {
        private readonly BookContext _context;
        private readonly UserManager<User> _userManager;
        private readonly LocalStorageConfig _localStorageConfig;

        public FriendsController(
            BookContext context,
            UserManager<User> userManager,
            IOptionsMonitor<LocalStorageConfig> storageOptionsMonitor)
        {
            _context = context;
            _userManager = userManager;
            _localStorageConfig = storageOptionsMonitor.CurrentValue;
        }
        [HttpPost("{username}")]
        [Route("Request")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> SendFriendRequest([FromQuery(Name = "username")] string username)
        {
            User senderUser = await AuthenticateUser();

            if (senderUser == null)
            {
                return Unauthorized("Unauthorized");
            }

            User targetUser = await _userManager.FindByNameAsync(username);

            if (targetUser == null)
            {
                return BadRequest("Identity verfification error");
            }

            if (senderUser.Id == targetUser.Id)
            {
                return BadRequest("Invalid request");
            }

            FriendRequest friendRequest = null;

            if (senderUser.Id != targetUser.Id)
            {
                friendRequest = _context.Friends.FirstOrDefault(
                x => (x.UserId1 == senderUser.Id && x.UserId2 == targetUser.Id)
                || (x.UserId2 == senderUser.Id && x.UserId1 == targetUser.Id));

                if(friendRequest != null)
                {
                    return BadRequest("User already in friend list or friend request already sent/received");
                }
            }

            friendRequest = new FriendRequest
            {
                User1 = senderUser,
                User2 = targetUser,
                Accepted = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsRead = false
            };

            try
            {
                _context.Friends.Add(friendRequest);

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch
            {
                return BadRequest("Internal error");
            }
        }

        [HttpPost]
        [Route("Accept")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AcceptFriendRequest([FromQuery(Name = "id")] string id)
        {
            User user = await AuthenticateUser();

            if (user == null)
            {
                return Unauthorized("Unauthorized");
            }

            FriendRequest friendRequest = await _context.Friends.FindAsync(long.Parse(id));

            if (friendRequest == null || friendRequest.UserId2 != user.Id)
            {
                return BadRequest("Friend request not found");
            }

            friendRequest.Accepted = true;
            friendRequest.UpdatedAt = DateTime.UtcNow;
            friendRequest.IsRead = true;

            try
            {
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch
            {
                return BadRequest("Internal error");
            }
        }

        [HttpDelete("{id}")]
        [Route("Remove")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<FriendRequestDto>>> RemoveFriend([FromQuery(Name = "id")] string id)
        {
            User user = await AuthenticateUser();

            if (user == null)
            {
                return Unauthorized("Unauthorized");
            }

            FriendRequest request = await _context.Friends.FindAsync(long.Parse(id));

            if (request == null)
            {
                return BadRequest("Friend not found");
            }

            try
            {
                _context.Friends.Remove(request);
                await _context.SaveChangesAsync();

                return await ToDTOAsync(new List<FriendRequest> { request });
            }
            catch
            {
                return BadRequest("Internal error");
            }
        }

        [HttpGet]
        [Route("Pending")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<FriendRequestDto>>> GetPendingFriendRequests()
        {
            User user = await AuthenticateUser();

            if (user == null)
            {
                return Unauthorized("Unauthorized");
            }

            var requests = await _context.Friends
                .Where(x => x.UserId2 == user.Id && x.Accepted == false)
                .Select(x => x)
                .ToListAsync();

            return await ToDTOAsync(requests);
        }

        [HttpGet]
        [Route("Sent")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<FriendRequestDto>>> GetSentFriendRequests()
        {
            User user = await AuthenticateUser();

            if (user == null)
            {
                return Unauthorized("Unauthorized");
            }

            return await _context.Friends
                .Where(x => x.UserId1 == user.Id && x.Accepted == false)
                .Select(x => ToDTO(x))
                .ToListAsync();
        }

        [HttpGet("{filter}")]
        [Route("FriendRequests")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<FriendRequestDto>>> GetFriendRequests([FromQuery]string filter)
        {
            User user = await AuthenticateUser();

            if (user == null)
            {
                return Unauthorized("Unauthorized");
            }

            List<FriendRequest> requests = null;

            if (filter == "all")
            {
                requests = await _context.Friends
                .Where(x => x.UserId1 == user.Id || x.UserId2 == user.Id)
                .Select(x => x)
                .ToListAsync();
            }
            else if (filter == "accepted")
            {
                requests = await _context.Friends
                .Where(x => (x.UserId1 == user.Id || x.UserId2 == user.Id) && x.Accepted == true)
                .Select(x => x)
                .ToListAsync();
            }
            else if (filter == "pending")
            {
                requests = await _context.Friends
                .Where(x => x.UserId2 == user.Id && x.Accepted == false)
                .Select(x => x)
                .ToListAsync();
            }
            else
            {
                return BadRequest($"{filter} is not a valid filter");
            }


            return await ToDTOAsync(requests);
        }

        private static FriendRequestDto ToDTO(FriendRequest friendRequest) =>
            new FriendRequestDto
            {
                Id = friendRequest.Id,
                Username = friendRequest.User1.UserName,
                CreatedAt = friendRequest.CreatedAt,
                UpdatedAt = friendRequest.UpdatedAt,
                Accepted = friendRequest.Accepted
            };

        private async Task<List<FriendRequestDto>> ToDTOAsync(List<FriendRequest> friendRequests)
        {
            List<FriendRequestDto> requestsList = new List<FriendRequestDto>();
            foreach (FriendRequest friendRequest in friendRequests)
            {

                User user = await _userManager.FindByIdAsync(User.FindFirst(ClaimTypes.NameIdentifier).Value);

                User friend = new User();

                if (friendRequest.UserId1 == user.Id)
                {
                    friend = await _userManager.FindByIdAsync(friendRequest.UserId2);
                }
                if (friendRequest.UserId2 == user.Id)
                {
                    friend = await _userManager.FindByIdAsync(friendRequest.UserId1);
                }
                byte[] imageBytes = null;

                var fileName = Path.GetFileNameWithoutExtension(
                        friend.Id);

                var imageFile = Directory.GetFiles(_localStorageConfig.PathName, fileName + ".*");

                if (imageFile.Length > 0)
                {
                    imageBytes = await System.IO.File.ReadAllBytesAsync(imageFile[0]);
                }

                requestsList.Add(new FriendRequestDto
                {
                    Id = friendRequest.Id,
                    Username = friend.UserName,
                    ProfilePicture = imageBytes,
                    CreatedAt = friendRequest.CreatedAt,
                    UpdatedAt = friendRequest.UpdatedAt,
                    Accepted = friendRequest.Accepted
                });
            }
            return requestsList;
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

using Bookshelf.Configuration;
using Bookshelf.Data;
using Bookshelf.Models;
using Bookshelf.Models.DTOs.Requests;
using Bookshelf.Models.DTOs.Responses;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Bookshelf.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfilesController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly LocalStorageConfig _localStorageConfig;
        private readonly BookContext _context;

        public ProfilesController(UserManager<User> userManager, 
            IOptionsMonitor<LocalStorageConfig> storageOptionsMonitor,
            BookContext context)
            
        {
            _userManager = userManager;
            _localStorageConfig = storageOptionsMonitor.CurrentValue;
            _context = context;
        }

        [HttpPut]
        [Route("UpdateInfo")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Update([FromBody] UserUpdateRequest updatedUserFields)
        {
            if (ModelState.IsValid)
            {
                User user = await AuthenticateUser();

                if (user == null)
                {
                    return Unauthorized("Unauthorized");
                }

                user.Gender = updatedUserFields.Gender;
                user.Birthday = DateTime.Parse(updatedUserFields.Birthday);
                user.Location = updatedUserFields.Location;

                var isUpdated = await _userManager.UpdateAsync(user);

                if (isUpdated.Succeeded)
                {
                    byte[] imageBytes = null;

                    var fileName = Path.GetFileNameWithoutExtension(
                    user.Id);

                    var imageFile = Directory.GetFiles(_localStorageConfig.PathName, fileName + ".*");

                    if (imageFile.Length > 0)
                    {
                        imageBytes = await System.IO.File.ReadAllBytesAsync(imageFile[0]);
                    }

                    return Ok(new UserUpdateResponse()
                    {
                        Success = true,
                        Username = user.UserName,
                        Gender = user.Gender,
                        Birthday = user.Birthday,
                        Location = user .Location,
                        ProfilePicture = imageBytes,
                    });
                }
                else
                {
                    return BadRequest("Internal error");
                }
            }
            return BadRequest("Invalid payload");
        }

        [HttpPut]
        [Route("UpdatePicture")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> OnPostUploadAsync([FromForm(Name = "profilePicture")] IFormFile file)
        {
            User user = await AuthenticateUser();

            if (user == null)
            {
                return Unauthorized("Unauthorized");
            }

            if (file.Length > 0)
            {
                var fileName = Path.GetFileNameWithoutExtension(
                    user.Id);
                var filePath = Path.Combine(_localStorageConfig.PathName,
                    fileName);
                var extension = MimeTypes.MimeTypeMap.GetExtension(file.ContentType);

                var oldFiles = Directory.GetFiles(_localStorageConfig.PathName, fileName + ".*");

                if (oldFiles.Length > 0)
                {
                    foreach (string oldFile in oldFiles)
                    {
                        System.Diagnostics.Trace.WriteLine("exists");
                        System.IO.File.Delete(oldFile);
                    }
                }

                try
                {
                    using (Stream stream = new FileStream(filePath + extension, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                }
                catch
                {
                    return BadRequest("Internal error");
                }

                byte[] imageBytes = null;

                var imageFile = Directory.GetFiles(_localStorageConfig.PathName, fileName + ".*");

                if (imageFile.Length > 0)
                {
                    imageBytes = await System.IO.File.ReadAllBytesAsync(imageFile[0]);
                }

                return Ok(new UserUpdateResponse()
                {
                    Success = true,
                    Username = user.UserName,
                    Gender = user.Gender,
                    Birthday = user.Birthday,
                    Location = user.Location,
                    ProfilePicture = imageBytes,
                });
            }
            return BadRequest("Invalid payload");
        }

        [HttpGet("{username}")]
        [Route("ProfileInfo")]
        public async Task<IActionResult> GetProfileInfo([FromQuery] string field, string username)
        {
            User requestor = await AuthenticateUser();

            if (requestor == null)
            {
                return Unauthorized("Unauthorized");
            }

            User existingUser = await _userManager.FindByNameAsync(username);

            if (existingUser == null)
            {
                return BadRequest("User could not be found");
            }

            byte[] imageBytes = null;

            var fileName = Path.GetFileNameWithoutExtension(
                    existingUser.Id);

            var imageFile = Directory.GetFiles(_localStorageConfig.PathName, fileName + ".*");
            
            if (imageFile.Length > 0)
            {
                imageBytes = await System.IO.File.ReadAllBytesAsync(imageFile[0]);  
            }

            if(field != null && field.ToLower() == "picture")
            {
                return Ok(new ProfileInfoResponse()
                {
                    Username = existingUser.UserName,
                    ProfilePicture = imageBytes,
                });
            }

            FriendRequest friendRequest = null;

            if (requestor.Id != existingUser.Id)
            {
                friendRequest = _context.Friends.FirstOrDefault(
                x => (x.UserId1 == requestor.Id && x.UserId2 == existingUser.Id)
                || (x.UserId2 == requestor.Id && x.UserId1 == existingUser.Id));
            }
            

            return Ok(new ProfileInfoResponse()
            {
                Username = existingUser.UserName,
                Gender = existingUser.Gender,
                Birthday = existingUser.Birthday,
                Location = existingUser.Location,
                ProfilePicture = imageBytes,
                FriendRequestSent = friendRequest != null ? true : false,
                IsFriend = friendRequest != null ? friendRequest.Accepted : false,
                LastOnline = existingUser.LastOnline,
                Success = true,
            });
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

using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Bookshelf.Configuration;
using Bookshelf.Models.DTOs.Requests;
using Bookshelf.Models.DTOs.Responses;
using Bookshelf.Models;
using Bookshelf.Services;
using Bookshelf.Model;
using System.Web;
using System.IO;
using Bookshelf.Data;

namespace Bookshelf.Controllers
{
    [Route("api/[controller]")] // api/authManagement
    [ApiController]
    public class AuthManagementController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly JwtConfig _jwtConfig;
        private readonly ReCaptchaConfig _reCaptchaConfig;
        private readonly LocalStorageConfig _localStorageConfig;
        private readonly CaptchaVerificationService _captchaVerificationService;
        private readonly EmailService _emailService;
        private readonly BookContext _context;

        public AuthManagementController(
            UserManager<User> userManager,
            IOptionsMonitor<JwtConfig> JwtoptionsMonitor,
            IOptionsMonitor<ReCaptchaConfig> reCaptchaOptionsMonitor,
            IOptions<EmailSettings> emailOptions,
            IOptionsMonitor<LocalStorageConfig> storageOptionsMonitor,
            BookContext context)
        {
            _userManager = userManager;
            _jwtConfig = JwtoptionsMonitor.CurrentValue;
            _reCaptchaConfig = reCaptchaOptionsMonitor.CurrentValue;
            _localStorageConfig = storageOptionsMonitor.CurrentValue;
            _captchaVerificationService = new CaptchaVerificationService(_reCaptchaConfig);
            _emailService = new EmailService(emailOptions);
            _context = context;
        }

        [HttpPost]
        [Route("Signup")]
        public async Task<IActionResult> Register([FromBody] RegistrationRequest user)
        {
            if (ModelState.IsValid)
            {
                var verificationRequest = new Models.DTOs.Requests.VerificationRequest
                {
                    Response = user.CaptchaToken
                };
                var captchaVerification = await _captchaVerificationService.VerifyCaptcha(verificationRequest);

                if(captchaVerification)
                {
                    var existingEmail = await _userManager.FindByEmailAsync(user.Email);

                    if (existingEmail != null)
                    {
                        return BadRequest("Email already in use");
                    }

                    var existingUsername = await _userManager.FindByNameAsync(user.Username);

                    if (existingUsername != null)
                    {
                        return BadRequest("Username already in use");
                    }

                    var newUser = new User() { 
                        Email = user.Email, 
                        UserName = user.Username,
                        Gender = "Not Specified",
                        Birthday = null,
                        Location = ""
                    };

                    
                    var isCreated = await _userManager.CreateAsync(newUser, user.Password);

                    if (isCreated.Succeeded)
                    {
                        string confirmationUrl = await GenerateConfirmationUrl(newUser);

                        //var jwtToken = GenerateJwtToken(newUser);
                        Email mailRequest = new Email
                        {
                            ToEmail = user.Email,
                            Subject = "Welcome",
                            Body = $"<p><b>{user.Username}, welcome to Bookshelf!</b> Follow the link to activate your account:</p>" +
                                $"<a href='{confirmationUrl}'>Activate account</a>"
                        };

                        try
                        {
                            await _emailService.SendEmailAsync(mailRequest);
                        }
                        catch
                        {
                            return BadRequest("Could not send email");
                        };

                        return Ok(new RegistrationResponse()
                        {
                            Success = true,
                            Username = user.Username
                        });
                    }
                    else
                    {
                        return BadRequest(new RegistrationResponse()
                        {
                            Errors = isCreated.Errors.Select(x => x.Description).ToList(),
                            Success = false
                        });
                    }

                }

                return BadRequest("Captcha verification failed");
            }
            return BadRequest("Invalid payload");
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest user)
        {
            if (ModelState.IsValid)
            {
                var existingUser = await _userManager.FindByEmailAsync(user.Email);

                if (existingUser == null)
                {
                    return BadRequest("You have entered an invalid username or password");
                }

                if(existingUser.EmailConfirmed == false)
                {
                    return BadRequest("Email address is not verified");
                } 

                var isCorrect = await _userManager.CheckPasswordAsync(existingUser, user.Password);

                if (!isCorrect)
                {
                    return BadRequest("You have entered an invalid username or password");
                }

                byte[] imageBytes = null;

                var fileName = Path.GetFileNameWithoutExtension(
                        existingUser.Id);

                var imageFile = Directory.GetFiles(_localStorageConfig.PathName, fileName + ".*");

                if (imageFile.Length > 0)
                {
                    imageBytes = await System.IO.File.ReadAllBytesAsync(imageFile[0]);
                }

                var jwtToken = GenerateJwtToken(existingUser);

                try
                {
                    existingUser.LastOnline = DateTime.UtcNow;
                    await _userManager.UpdateAsync(existingUser);

                    bool isAdmin = _userManager.IsInRoleAsync(existingUser, "Admin").Result;

                    return Ok(new LoginResponse()
                    {
                        Username = existingUser.UserName,
                        Email = existingUser.Email,
                        Gender = existingUser.Gender,
                        Birthday = existingUser.Birthday,
                        Location = existingUser.Location,
                        ProfilePicture = imageBytes,
                        Token = jwtToken,
                        Success = true,
                        IsAdmin = isAdmin


                    });
                }
                catch
                {
                    return StatusCode(500);
                }
               
            }

            return BadRequest("Internal error");
        }

        [HttpPost]
        [Route("Logout")]
        public async Task<IActionResult> Logout()
        {
            var identity = User.FindFirst(ClaimTypes.NameIdentifier);

            if (identity == null)
            {
                return Unauthorized("Unauthorized");
            }

            User user = await _userManager.FindByIdAsync(identity.Value);

            if (user == null)
            {
                return BadRequest("Identity verfification error");
            }

            try
            {
                user.LastOnline = DateTime.UtcNow;
                await _userManager.UpdateAsync(user);
            }
            catch
            {
                return StatusCode(500);
            }
            return Ok();
        }

        [HttpGet]
        [Route("Confirm")]
        public async Task<IActionResult> ConfirmEmail([FromQuery(Name = "id")] string id, [FromQuery(Name = "token")] string token)
        {
            string encodedToken = token.Replace(' ', '+');

            var existingUser = await _userManager.FindByIdAsync(id);
            if(existingUser == null)
            {
                return BadRequest("Email confirmation failed");
            }

            var result = await _userManager.ConfirmEmailAsync(existingUser, encodedToken);
            return Ok(result);
        }

        private string GenerateJwtToken(User user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes(_jwtConfig.Secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("Id", user.Id),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = jwtTokenHandler.WriteToken(token);

            return jwtToken;
        }

        public async Task<string> GetEmailConfirmationToken(User user)
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            //var result = await UserManager.ConfirmEmailAsync(user.Id, code);
            return token;
        }

        public async Task<string> GenerateConfirmationUrl(User user)
        {
            string confirmationToken = await GetEmailConfirmationToken(user);
            string confirmationUrl = HttpUtility.UrlPathEncode("http://localhost:3000/confirm/?id=" + user.Id + "&token=" + confirmationToken);

            return confirmationUrl;
        }
    }
}
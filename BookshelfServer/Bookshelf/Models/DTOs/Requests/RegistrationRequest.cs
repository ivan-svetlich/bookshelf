using System.ComponentModel.DataAnnotations;

namespace Bookshelf.Models.DTOs.Requests
{
    public class RegistrationRequest
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
        [Required]
        public string CaptchaToken { get; set; }
    }
}
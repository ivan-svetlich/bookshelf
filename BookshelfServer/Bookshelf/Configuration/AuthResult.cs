using System.Collections.Generic;

namespace Bookshelf.Configuration
{
    public class AuthResult
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public bool Success { get; set; }
        public List<string> Errors { get; set; }
    }
}
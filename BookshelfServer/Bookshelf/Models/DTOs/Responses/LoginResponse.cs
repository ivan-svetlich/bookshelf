using Bookshelf.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models.DTOs.Responses
{
    public class LoginResponse : AuthResult
    {
        public string Gender { get; set; }
        public DateTime? Birthday { get; set; }
        public string Location { get; set; }
        public byte[] ProfilePicture { get; set; }
        public bool IsAdmin { get; set; }
    }
}

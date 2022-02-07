using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models.DTOs.Responses
{
    public class CaptchaVerificationResponse
    {
        public bool Success { get; set; }
        public DateTime ChalengeTs { get; set; }
        public string Hostname { get; set; }
        public Array[] ErrorCodes { get; set; }
    }
}

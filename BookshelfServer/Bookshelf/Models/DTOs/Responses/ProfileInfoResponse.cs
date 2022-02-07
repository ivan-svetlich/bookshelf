using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models.DTOs.Responses
{
    public class ProfileInfoResponse
    {
        public string Username { get; set; }
        public string Gender { get; set; }
        public DateTime? Birthday { get; set; }
        public string Location { get; set; }
        public byte[] ProfilePicture { get; set; }
        public bool IsFriend { get; set; }
        public bool FriendRequestSent { get; set; }
        public DateTime LastOnline { get; set; }
        public bool Success { get; set; }

    }
}

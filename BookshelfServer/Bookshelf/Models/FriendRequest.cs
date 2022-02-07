using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models
{
    public class FriendRequest
    {
        [Key]
        public long Id { get; set; }
        [ForeignKey("User1")]
        public string UserId1 { get; set; }
        [ForeignKey("User2")]
        public string UserId2 { get; set; }
        public bool Accepted { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsRead { get; set; }

        public virtual User User1 { get; set; }
        public virtual User User2 { get; set; }
    }

    public class FriendRequestDto
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public byte[] ProfilePicture { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool Accepted { get; set; }
    }
}

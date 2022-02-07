using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models
{
    public class Comment
    {
        [Key]
        public long Id { get; set; }
        [ForeignKey("Submitter")]
        public string SubmitterId { get; set; }
        [ForeignKey("Profile")]
        public string ProfileId { get; set; }
        public string Body { get; set; }
        public DateTime? CreatedAt { get; set; }
        public bool IsRead { get; set; }

        public User Submitter { get; set; }
        public User Profile { get; set; }
    }

    public class CommentDto
    {
        public long Id { get; set; }
        public string SubmitterUsername { get; set; }
        public string ProfileId { get; set; }
        public byte[] SubmitterPicture { get; set; }
        public string Body { get; set; }
        public DateTime? CreatedAt { get; set; }
        public bool New { get; set; }
    }

    public class CommentRequest
    {
        public string SubmitterUsername { get; set; }
        public string ProfileUsername { get; set; }
        public string Body { get; set; }
    }
}

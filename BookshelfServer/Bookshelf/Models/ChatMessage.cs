using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models
{
    public class ChatMessage
    {
        [Key]
        public long Id { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Read { get; set; }
        public bool DeletedBySender { get; set; }
        public bool DeletedByReceiver { get; set; }
    }

}

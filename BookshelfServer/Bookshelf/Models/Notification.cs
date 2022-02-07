using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models
{
    public class NotificationDto
    {
        public long Id { get; set; }
        public string Category { get; set; }
        public DateTime? CreatedAt { get; set; }
        public bool IsRead { get; set; }
        public string Reference { get; set; }
    }
}

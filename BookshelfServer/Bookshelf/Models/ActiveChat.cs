using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models
{
    public class ActiveChat
    {
        [Key]
        public long Id { get; set; }
        
        public string UserId1 { get; set; }
        public string UserId2 { get; set; }
        public bool Connected1 { get; set; }
        public bool Connected2 { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("UserId1")]
        public virtual User User1 { get; set; }
        [ForeignKey("UserId2")]
        public virtual User User2 { get; set; }
    }
}

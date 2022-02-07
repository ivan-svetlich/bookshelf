using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models
{
    public class HubConnection
    {
        [Key]
        public long Id { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }
        public string ConnectionId { get; set; }
        public DateTime? CreatedAt { get; set; }

        public virtual User User { get; set; }
    }

    public class ConnectionDTO
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public bool Connected { get; set; }
        public int NewMessages { get; set; }

    }
}

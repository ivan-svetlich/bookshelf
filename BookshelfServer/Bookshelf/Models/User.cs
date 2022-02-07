using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models
{
    public class User: IdentityUser
    {
        public string Gender { get; set; }
        public DateTime? Birthday { get; set; }
        public string Location { get; set; } 
        public string ProfilePicture { get; set; }
        public DateTime LastOnline { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models
{
    public class VerificationRequest
    {
        [Required]
        public string Secret { get; set; }
        [Required]
        public string Response { get; set; }
    }
}

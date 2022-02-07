using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models.DTOs.Requests
{
    public class VerificationRequest
    {
        [Required]
        public string Response { get; set; }
    }
}

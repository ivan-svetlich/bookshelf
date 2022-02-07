using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models.DTOs.Requests
{
    public class UserUpdateRequest
    {
        public string Gender { get; set; }
        public string Birthday { get; set; }
        public string Location { get; set; }
    }
}

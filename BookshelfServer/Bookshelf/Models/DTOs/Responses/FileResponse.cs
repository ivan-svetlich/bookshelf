using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models.DTOs.Responses
{
    public class FileResponse
    {
        public string filename { get; set; }
        public byte[] file { get; set; }
        public string type { get; set; }
    }
}

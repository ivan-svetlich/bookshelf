using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models.DTOs.Responses
{
    public class TopBooksResponse
    {
        public string GoogleBooksId { get; set; }
        public int Count { get; set; }
    }
}

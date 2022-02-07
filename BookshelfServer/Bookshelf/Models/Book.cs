using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models
{
    public class Book
    {
        public long Id { get; set; }
        public string UserId { get; set; }    
        public string Title { get; set; }
        public string Authors { get; set; }
        public string Publisher { get; set; }
        public int? Status { get; set; }
        public int? Score { get; set; }
        public string GoogleBooksId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class BookDTO
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Authors { get; set; }
        public string Publisher { get; set; }
        public string Status { get; set; }
        public string Score { get; set; }
        public string GoogleBooksId { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? Username { get; set; }
        public string? Thumbnail { get; set; }
        public  int? Count { get; set; }
    }

    public class BookToFile
    {
        public string Title { get; set; }
        public string Authors { get; set; }
        public string Publisher { get; set; }
        public string Status { get; set; }
        public string Score { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models
{
    public class Product
    {
        [Key]
        public long Id { get; set; }
        public string Title { get; set; }
        public string Authors { get; set; }
        public string Publisher { get; set; }
        public string GoogleBooksId { get; set; }
        [Column(TypeName = "decimal(8,2)")]
        public decimal Price { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool Removed { get; set; }
    }

    public class NewProductRequest
    {
        public string Title { get; set; }
        public string Authors { get; set; }
        public string Publisher { get; set; }
        public string GoogleBooksId { get; set; }
        public decimal Price { get; set; }
    }

    public class UpdateProductRequest
    {
        public long Id { get; set; }
        public decimal Price { get; set; }
    }

    public class ProductWithThumbnail
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Authors { get; set; }
        public string Publisher { get; set; }
        public long ProductId { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public string Thumbnail { get; set; }
    }
}

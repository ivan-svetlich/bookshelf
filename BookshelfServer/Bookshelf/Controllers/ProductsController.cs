using Bookshelf.Data;
using Bookshelf.Models;
using Bookshelf.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Bookshelf.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly BookContext _context;
        private readonly UserManager<User> _userManager;
        private readonly GoogleBooksService googleBooksService;

        public ProductsController(
            BookContext context,
            UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
            googleBooksService = new GoogleBooksService();
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> AddProduct([FromBody] NewProductRequest newProduct)
        {
            User user = await AuthenticateUser();

            if (user == null)
            {
                return Unauthorized("Unauthorized");
            }

            bool isAdmin = _userManager.IsInRoleAsync(user, "Admin").Result;

            if (!isAdmin)
            {
                return Unauthorized("Unauthorized");
            }

            try
            {
                Product existingProduct = _context.Products.FirstOrDefault(p => (
                    p.Title == newProduct.Title && p.Authors == newProduct.Authors && p.Publisher == newProduct.Publisher));

                if(existingProduct != null)
                {
                    existingProduct.Price = newProduct.Price;
                    existingProduct.GoogleBooksId = newProduct.GoogleBooksId;
                    existingProduct.Removed = false;
                    existingProduct.UpdatedAt = DateTime.UtcNow;

                    await _context.SaveChangesAsync();

                    return Ok(existingProduct.Id);
                }
                else
                {
                    Product product = new Product
                    {
                        Title = newProduct.Title,
                        Authors = newProduct.Authors,
                        Publisher = newProduct.Publisher,
                        GoogleBooksId = newProduct.GoogleBooksId,
                        Price = newProduct.Price,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Products.Add(product);
                    await _context.SaveChangesAsync();

                    return Ok(product.Id);
                }  
            }
            catch
            {
                return StatusCode(500, "Error while trying to create product");
            }
        }

        [HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UpdateProduct([FromBody] UpdateProductRequest updateRequest)
        {
            User user = await AuthenticateUser();

            if (user == null)
            {
                return Unauthorized("Unauthorized");
            }

            bool isAdmin = _userManager.IsInRoleAsync(user, "Admin").Result;

            if (!isAdmin)
            {
                return Unauthorized("Unauthorized");
            }

            try
            {
                Product product = _context.Products.FirstOrDefault(product => product.Id == updateRequest.Id);

                if(product != null)
                {
                    product.Price = updateRequest.Price;
                    product.UpdatedAt = DateTime.UtcNow;

                    await _context.SaveChangesAsync();
                    return Ok(product.Id);
                }
                return NotFound();
            }
            catch
            {
                return StatusCode(500, "Error while trying to update product");
            }
        }

        [HttpDelete]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> RemoveProduct([FromQuery] long id)
        {
            User user = await AuthenticateUser();

            if (user == null)
            {
                return Unauthorized("Unauthorized");
            }

            bool isAdmin = _userManager.IsInRoleAsync(user, "Admin").Result;

            if (!isAdmin)
            {
                return Unauthorized("Unauthorized");
            }

            try
            {
                Product product = _context.Products.FirstOrDefault(product => product.Id == id);

                if (product != null)
                {
                    BookSale sale = _context.BookSales.FirstOrDefault(sale => sale.ProductId == product.Id);
                    if(sale != null)
                    {
                        product.Removed = true;
                    }
                    else
                    {
                        _context.Products.Remove(product);
                    }

                    await _context.SaveChangesAsync();
                    return Ok(product.Id);
                }
                return NotFound();
            }
            catch
            {
                return StatusCode(500, "Error while trying to remove product");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {      
            try
            {
                Product product = _context.Products.FirstOrDefault(product => product.GoogleBooksId == id && !product.Removed);

                if (product != null)
                {
                    return Ok(product);
                }
                return NotFound();
            }
            catch
            {
                return StatusCode(500, "Error while trying to get product");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetByQuery([FromQuery] string q, [FromQuery] string field, [FromQuery] int startIndex)
        {
            try
            {
                List<ProductWithThumbnail> products;

                switch (field)
                {
                    case "intitle":
                        products = (from product in _context.Products
                                    where product.Title.ToLower().Contains(q.ToLower()) && !product.Removed
                                    select new ProductWithThumbnail
                                    {
                                        Id = product.GoogleBooksId,
                                        Title = product.Title,
                                        Authors = product.Authors,
                                        Publisher = product.Publisher,
                                        ProductId = product.Id,
                                        Price = product.Price
                                    })
                                    .OrderByDescending(x => x.Title)
                                    .ThenByDescending(x => x.Title.Length)
                                    .Page(startIndex, 20)
                                    .ToList();
                        break;
                    case "inauthor":
                        products = (from product in _context.Products
                                    where product.Authors.ToLower().Contains(q.ToLower()) && !product.Removed
                                    select new ProductWithThumbnail
                                    {
                                        Id = product.GoogleBooksId,
                                        Title = product.Title,
                                        Authors = product.Authors,
                                        Publisher = product.Publisher,
                                        ProductId = product.Id,
                                        Price = product.Price
                                    })
                                    .OrderBy(x => x.Authors)
                                    .ThenBy(x => x.Authors.Length)
                                    .Page(startIndex, 20)
                                    .ToList();
                        break;
                    case "inpublisher":
                        products = (from product in _context.Products
                                    where product.Publisher.ToLower().Contains(q.ToLower()) && !product.Removed
                                    select new ProductWithThumbnail
                                    {
                                        Id = product.GoogleBooksId,
                                        Title = product.Title,
                                        Authors = product.Authors,
                                        Publisher = product.Publisher,
                                        ProductId = product.Id,
                                        Price = product.Price
                                    })
                                    .OrderByDescending(x => x.Publisher)
                                    .ThenByDescending(x => x.Publisher.Length)
                                    .Page(startIndex, 20)
                                    .ToList();
                        break;
                    default:
                        products = null;
                        break;
                }    

                if (products != null)
                {  
                    foreach (ProductWithThumbnail product in products)
                    {
                        var props = await googleBooksService.GetBookThumbnail(product.Id);
                        if(props != null)
                        {
                            product.Description = props["description"];
                            product.Thumbnail = props["thumbnail"];
                        }
                    }
                    return Ok(products.ToList());
                }

                return NotFound();
            }
            catch
            {
                return StatusCode(500, "Error while trying to get products");
            }
        }

        private async Task<User> AuthenticateUser()
        {
            var identity = User.FindFirst(ClaimTypes.NameIdentifier);

            if (identity == null)
            {
                return null;
            }

            User user = await _userManager.FindByIdAsync(identity.Value);

            if (user == null)
            {
                return null;
            }

            user.LastOnline = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return user;
        }
    }

    public static class PagingExtensions
    {
        //used by LINQ to SQL
        public static IQueryable<TSource> Page<TSource>(this IQueryable<TSource> source, int startIndex, int pageSize)
        {
            return source.Skip(startIndex).Take(pageSize);
        }

        //used by LINQ
        public static IEnumerable<TSource> Page<TSource>(this IEnumerable<TSource> source, int startIndex, int pageSize)
        {
            return source.Skip(startIndex).Take(pageSize);
        }

    }
}

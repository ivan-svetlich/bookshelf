using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bookshelf.Models;
using Bookshelf.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Bookshelf.Models.DTOs.Responses;
using Bookshelf.Services;
using System.Data;

namespace BookApi.Controllers
{
    [Route("api/Books")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class BooksController : ControllerBase
    {
        private readonly BookContext _context;
        private readonly UserManager<User> _userManager;
        private readonly GoogleBooksService googleBooksService;

        public BooksController(BookContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
            googleBooksService = new GoogleBooksService();
        }

        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDTO>>> GetBooks([FromQuery(Name = "username")] string username)
        {
            var existingUser = await _userManager.FindByNameAsync(username);

            if (existingUser == null)
            {
                return BadRequest();
            }

            return await _context.Books
                .Where(x => x.UserId == existingUser.Id)
                .Select(x => ToDTO(x))
                .ToListAsync();
        }

        [HttpGet]
        [Route("Purchased")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<BookSaleDTO>>> GetPurchasedBooks()
        {
            User user = await AuthenticateUser();

            if (user == null)
            {
                return Unauthorized("Unauthorized");
            }

            List<BookSaleDTO> purchasedBooks = (from sale in _context.BookSales
                                              where sale.UserId == user.Id && sale.Status == "approved"
                                              select new BookSaleDTO
                                              {
                                                  Id = sale.Id,
                                                  Title = sale.Product.Title,
                                                  Authors = sale.Product.Authors,
                                                  Publisher = sale.Product.Publisher,
                                                  Price = sale.Price,
                                                  CreatedAt = sale.CreatedAt,
                                                  Status = sale.Status,
                                                  GoogleBooksId = sale.Product.GoogleBooksId
                                              }).ToList();

            return purchasedBooks;
        }

        [HttpGet("{amount}")]
        [Route("LastUpdates")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<BookDTO>>> GetBookUpdates([FromQuery(Name = "amount")] int amount)
        {
            List<BookDTO> books = await _context.Books
                .Join(_context.Users, book => book.UserId, user => user.Id, (book, user) =>
                    new BookDTO
                    {
                        Id = book.Id,
                        Title = book.Title,
                        Authors = book.Authors,
                        Publisher = book.Publisher,
                        Status = Convert.ToBoolean(book.Status) ? book.Status.ToString() : "",
                        Score = Convert.ToBoolean(book.Score) ? book.Score.ToString() : "",
                        GoogleBooksId = book.GoogleBooksId,
                        UpdatedAt = book.UpdatedAt,
                        Username = user.UserName
                    })
                    //new { book = book, username = user.UserName})
                .OrderByDescending(x => x.UpdatedAt)
                .Take(amount)
                .Select(x => x)
                .ToListAsync();

            foreach(BookDTO book in books)
            {
                var props = await googleBooksService.GetBookThumbnail(book.GoogleBooksId);

                if(props != null)
                {
                    book.Thumbnail = props["thumbnail"];
                }
            }

            return Ok(books);
        }

        [HttpGet("{amount}")]
        [Route("TopBooks")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<BookDTO>>> GetTopBooks([FromQuery(Name = "amount")] int amount)
        {
            List<TopBooksResponse> bookCounts = await _context.Books
                .GroupBy(x => x.GoogleBooksId)
                .Select(g => new TopBooksResponse
                {
                    GoogleBooksId = g.Key,
                    Count = g.Select(x => x.GoogleBooksId).Count()
                })
                .OrderByDescending(g => g.Count)
                .Take(amount)
                .ToListAsync();

            List<BookDTO> books = new List<BookDTO>();

            foreach(TopBooksResponse bookCount in bookCounts)
            {
                Book book = await _context.Books.FirstOrDefaultAsync(x => x.GoogleBooksId == bookCount.GoogleBooksId);

                if(book != null)
                {
                    BookDTO bookDTO = new BookDTO
                    {
                        Id = book.Id,
                        Title = book.Title,
                        Authors = book.Authors,
                        Publisher = book.Publisher,
                        Status = Convert.ToBoolean(book.Status) ? book.Status.ToString() : "",
                        Score = Convert.ToBoolean(book.Score) ? book.Score.ToString() : "",
                        GoogleBooksId = book.GoogleBooksId,
                        UpdatedAt = book.UpdatedAt,
                        Count = bookCount.Count
                    };
                    var props = await googleBooksService.GetBookThumbnail(bookCount.GoogleBooksId);

                    if (props != null)
                    {
                        bookDTO.Thumbnail = props["thumbnail"];
                    }

                    books.Add(bookDTO);
                }                  
            }

            return Ok(books);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookDTO>> GetBook(long id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound();
            }

            return ToDTO(book);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<BookDTO>>> GetBooksByUserId(string id)
        {
            return await _context.Books
                .Where(x => x.UserId == User.FindFirst(id).Value)
                .Select(x => ToDTO(x))
                .ToListAsync();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<BookDTO>> UpdateBook(long id, BookDTO bookDTO)
        {
            if (id != bookDTO.Id)
            {
                return BadRequest("Incongruent id");
            }

            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound("Book not found in database");
            }
            book.UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            book.Title = bookDTO.Title;
            book.Authors = bookDTO.Authors;
            book.Publisher = bookDTO.Publisher;
            book.Status = string.IsNullOrEmpty(bookDTO.Status) ? null : int.Parse(bookDTO.Status);
            book.Score = string.IsNullOrEmpty(bookDTO.Score) ? null : int.Parse(bookDTO.Score);
            book.GoogleBooksId = bookDTO.GoogleBooksId;
            book.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!BookExists(id))
            {
                return NotFound("Internal error");
            }

            return CreatedAtAction(
                nameof(GetBook),
                new { id = book.Id },
                ToDTO(book));
        }

        [HttpPost]
        public async Task<ActionResult<BookDTO>> CreateBook(BookDTO bookDTO)
        {
            User user = await AuthenticateUser();

            if (user == null)
            {
                return Unauthorized("Unauthorized");
            }

            var book = new Book
            {
                UserId = user.Id,
                Title = bookDTO.Title,
                Authors = bookDTO.Authors,
                Publisher = bookDTO.Publisher,
                Status = string.IsNullOrEmpty(bookDTO.Status) ? null : int.Parse(bookDTO.Status),
                Score = string.IsNullOrEmpty(bookDTO.Score) ? null : int.Parse(bookDTO.Score),
                GoogleBooksId = bookDTO.GoogleBooksId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetBook),
                new { id = book.Id },
                ToDTO(book));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(long id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound("The book you are trying to remove could not be found on your list");
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return Ok(book.Id);
        }

        [HttpGet("type")]
        [Route("File")]
        public async Task<ActionResult<FileResponse>> GetListAsCSV(string type)
        {
            User user = await AuthenticateUser();

            if (user == null)
            {
                return Unauthorized("Unauthorized");
            }

            string extension = type.ToLower();
            if (extension != "csv" && extension != "pdf")
            {
                return BadRequest("Invalid file type");
            }

            var query = from book in _context.Books
                        where book.UserId == user.Id
                        select new BookToFile
                        {
                            Title = book.Title,
                            Authors = book.Authors,
                            Publisher = book.Publisher,
                            Status = FileService.GetStatusAsString(book.Status),
                            Score = FileService.GetScoreAsString(book.Score)
                        };

            List<BookToFile> dataList = await query.ToListAsync();

            if (extension == "csv")
            {
                FileResponse response = new FileResponse
                {
                    filename = @$"{user.UserName}'s_list",
                    file = FileService.CreateCsv(user, dataList),
                    type = "text/csv"
                };

                return response;
            }
            if (extension == "pdf")
            {
                FileResponse response = new FileResponse
                {
                    filename = @$"{user.UserName}'s_list",
                    file = FileService.CreatePdf(user, dataList),
                    type = "application/pdf"
                };

                return response;
            }

            return StatusCode(500);
        }

        private bool BookExists(long id) =>
             _context.Books.Any(e => e.Id == id);

        private static BookDTO ToDTO(Book book) =>
            new BookDTO
            {
                Id = book.Id,
                Title = book.Title,
                Authors = book.Authors,
                Publisher = book.Publisher,
                Status = Convert.ToBoolean(book.Status) ? book.Status.ToString() : "",
                Score = Convert.ToBoolean(book.Score) ? book.Score.ToString() : "",
                GoogleBooksId = book.GoogleBooksId,
            };

        private static BookDTO ToDTOWithUsername(Book book, string username) =>
            new BookDTO
            {
                Id = book.Id,
                Title = book.Title,
                Authors = book.Authors,
                Publisher = book.Publisher,
                Status = Convert.ToBoolean(book.Status) ? book.Status.ToString() : "",
                Score = Convert.ToBoolean(book.Score) ? book.Score.ToString() : "",
                GoogleBooksId = book.GoogleBooksId,
                UpdatedAt = book.UpdatedAt,
                Username = username
            };

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
}
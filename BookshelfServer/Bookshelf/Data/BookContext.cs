using Microsoft.EntityFrameworkCore;
using Bookshelf.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Bookshelf.Data
{
    public class BookContext : IdentityDbContext<User>
    {
        public BookContext(DbContextOptions<BookContext> options)
            : base(options)
        {
        }

        public DbSet<Book> Books { get; set; }

        public DbSet<Product> Products { get; set; }

        public DbSet<BookSale> BookSales { get; set; }

        public DbSet<Comment> Comments { get; set; }

        public DbSet<FriendRequest> Friends { get; set; }

        public DbSet<HubConnection> HubConnections { get; set; }

        public DbSet<ActiveChat> ActiveChats { get; set; }

        public DbSet<ChatMessage> ChatMessages { get; set; }
    }
}

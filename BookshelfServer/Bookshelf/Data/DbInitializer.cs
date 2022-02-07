using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Data
{
    public static class DbInitializer
    {
        public static void Initialize(BookContext context)
        {
            context.Database.EnsureCreated();

            if (context.Books.Any())
            {
                return;   // DB has been seeded
            }
        }
    }
}
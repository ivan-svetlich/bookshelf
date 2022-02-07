using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Configuration
{
    public class PaymentConfig
    {
        public MercadoPago MercadoPago { get; set; }
    }

    public class MercadoPago
    {
        public string AccessToken { get; set; }
        public string NotificationUrl { get; set; }
    }
}

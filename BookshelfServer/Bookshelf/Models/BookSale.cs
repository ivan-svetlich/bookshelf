using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models
{
    public class BookSale
    {
        [Key]
        public long Id { get; set; }
        public string PaymentId { get; set; } //MercadoPago paymentID -> "https://api.mercadopago.com/v1/payments/[ID]"
        public string UserId { get; set; }
        public long ProductId { get; set; }
        [Column(TypeName = "decimal(8,2)")]
        public decimal Price { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } /* Payment status
            pending: The user has not yet completed the payment process.
            approved: The payment has been approved and accredited.
            authorized: The payment has been authorized but not captured yet.
            in_process: Payment is being reviewed.
            in_mediation: Users have initiated a dispute.
            rejected: Payment was rejected. The user may retry payment.
            cancelled: Payment was cancelled by one of the parties or because time for payment has expired
            refunded: Payment was refunded to the user.
            charged_back: Was made a chargeback in the buyer’s credit card.

            product_id_parse_error: ProductId string value could not be converted to long. 
            price_parse_error: Price string value could not be converted to decimal(8,2). */

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }
    }

    public class BookSaleDTO
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Authors { get; set; }
        public string Publisher { get; set; }
        [Column(TypeName = "decimal(8,2)")]
        public decimal Price { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; }
        public string GoogleBooksId { get; set; }
    }
}

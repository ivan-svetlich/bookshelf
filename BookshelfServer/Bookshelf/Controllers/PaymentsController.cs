using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using Bookshelf.Data;
using Microsoft.AspNetCore.Identity;
using Bookshelf.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using MercadoPago.Resource.Preference;
using Bookshelf.Services;
using Bookshelf.Models.DTOs.Requests;
using Bookshelf.Configuration;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Globalization;
using System.Collections.Generic;

namespace Bookshelf.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly BookContext _context;
        private readonly UserManager<User> _userManager;
        private readonly MercadoPagoService _mercadoPagoService;

        public PaymentsController(
            BookContext context, 
            UserManager<User> userManager,
            IOptions<PaymentConfig> paymentOptions,
            IOptions<ClientSettings> clientSettings)
        {
            _context = context;
            _userManager = userManager;
            _mercadoPagoService = new MercadoPagoService(paymentOptions, clientSettings);
        }

        [HttpPost]
        [Route("MercadoPago/Preference")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> CreatePreference([FromBody] CreatePreferenceRequest request)
        {
            User user = await AuthenticateUser();

            if (user == null)
            {
                return Unauthorized("Unauthorized");
            }

            bool isNumber = long.TryParse(request.productId, out long id);

            if(!isNumber)
            {
                return BadRequest("Invalid product ID");
            }

            var product = _context.Products.FirstOrDefault(prod => prod.Id == id);

            if(product == null)
            {
                return BadRequest("Invalid product ID");
            }

            Preference preference = await _mercadoPagoService.CreatePreference(product, user);

            return Ok(preference);
        }

        [HttpPost]
        [Route("MercadoPago/Notifications")]
        public async Task<IActionResult> PostWebHookNotification(JsonElement notification)
        {
            try
            {
                MercadopagoWebhookNotification mercadopagoNotif = Newtonsoft.Json.JsonConvert
                    .DeserializeObject<MercadopagoWebhookNotification>(notification.GetRawText());

                if (mercadopagoNotif.Type == "payment" && mercadopagoNotif.Data != null && mercadopagoNotif.Data.Id != null)
                {
                    MercadopagoPaymentData paymentData = await _mercadoPagoService.GetPaymentInfo(mercadopagoNotif.Data.Id);

                    if(paymentData != null)
                    {
                        foreach (Item item in paymentData.AdditionalInfo.Items)
                        {
                            bool isValidProductId = long.TryParse(item.Id, out long productId);
                            bool isValidPrice = decimal.TryParse(
                                item.UnitPrice.Replace(",", "."),
                                NumberStyles.Number,
                                CultureInfo.InvariantCulture,
                                out decimal price);

                            if (isValidProductId && isValidPrice)
                            {
                                _context.BookSales.Add(new BookSale
                                {
                                    PaymentId = mercadopagoNotif.Data.Id,
                                    UserId = paymentData.UserId,
                                    ProductId = productId,
                                    Price = price,
                                    CreatedAt = DateTime.UtcNow,
                                    Status = paymentData.Status
                                });
                            }
                            else if (!isValidPrice)
                            {
                                _context.BookSales.Add(new BookSale
                                {
                                    PaymentId = mercadopagoNotif.Data.Id,
                                    UserId = paymentData.UserId,
                                    ProductId = productId,
                                    Price = price,
                                    CreatedAt = DateTime.UtcNow,
                                    Status = "price_parse_error"
                                });
                            }
                            else
                            {
                                _context.BookSales.Add(new BookSale
                                {
                                    PaymentId = mercadopagoNotif.Data.Id,
                                    UserId = paymentData.UserId,
                                    ProductId = productId,
                                    Price = price,
                                    CreatedAt = DateTime.UtcNow,
                                    Status = "product_id_parse_error"
                                });
                            }

                            await _context.SaveChangesAsync();
                        }
                    }  
                }

                return Ok();
            }
            catch(Exception e)
            {
                System.Diagnostics.Trace.WriteLine(e.ToString());

                return Ok();
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
}

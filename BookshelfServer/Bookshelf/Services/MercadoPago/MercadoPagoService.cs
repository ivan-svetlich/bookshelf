using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Bookshelf.Configuration;
using Bookshelf.Models;
using MercadoPago.Client.Preference;
using MercadoPago.Config;
using MercadoPago.Resource.Preference;
using Microsoft.Extensions.Options;

namespace Bookshelf.Services
{
    public class MercadoPagoService
    {
        private string clientUrl;
        private string notificationUrl;

        public MercadoPagoService(IOptions<PaymentConfig> paymentOptions, IOptions<ClientSettings> clientSettings)
        {
            MercadoPagoConfig.AccessToken = paymentOptions.Value.MercadoPago.AccessToken;
            notificationUrl = paymentOptions.Value.MercadoPago.NotificationUrl;
            clientUrl = clientSettings.Value.Url;
        }

        public async Task<Preference> CreatePreference(Product product, User user)
        {
            var request = new PreferenceRequest
            {
                Items = new List<PreferenceItemRequest>
                {
                    new PreferenceItemRequest
                    {
                        Id = $"{product.Id}",
                        Title = $"{product.Title} ({product.Authors})",
                        CategoryId = "virtual_goods",
                        Quantity = 1,
                        CurrencyId = "ARS",
                        UnitPrice = product.Price,
                    },
                },
                Payer = new PreferencePayerRequest
                {
                    Email = user.Email

                },
                BackUrls = new PreferenceBackUrlsRequest
                {
                    Success = $"{clientUrl}/book/{product.GoogleBooksId}/?buy_status=success",
                    Failure = $"{clientUrl}/book/{product.GoogleBooksId}/?buy_status=failure",
                    Pending = $"{clientUrl}/book/{product.GoogleBooksId}/?buy_status=pending",
                },
                AutoReturn = "approved",
                NotificationUrl = notificationUrl,
                StatementDescriptor = "BOOKSHELF_STORE",
                ExternalReference = user.Id,
            };
            var client = new PreferenceClient();
            Preference preference = await client.CreateAsync(request);

            return preference;
        }

        public async Task<MercadopagoPaymentData> GetPaymentInfo(string id)
        {
            string baseUrl = "https://api.mercadopago.com/v1/payments/";

            try
            {
                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + MercadoPagoConfig.AccessToken);

                    using (HttpResponseMessage res = await client.GetAsync(baseUrl + id))
                    {
                        using (HttpContent content = res.Content)
                        {
                            var data = await content.ReadAsStringAsync();
                            if (data != null)
                            {
                                MercadopagoPaymentData paymentData = Newtonsoft.Json.JsonConvert
                                    .DeserializeObject<MercadopagoPaymentData>(data);

                                return paymentData;
                            }
                            else
                            {
                                System.Diagnostics.Trace.WriteLine("No data----------");

                                return null;
                            }
                        }
                    }
                }
            }
            catch (Exception exception)
            {
                System.Diagnostics.Trace.WriteLine("Exception----------");
                System.Diagnostics.Trace.WriteLine(exception.ToString());

                return null;
            }
        }
    }
}

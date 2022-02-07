using MercadoPago.Client.Preference;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models
{
    public class MercadopagoPaymentData
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("additional_info")]
        public AdditionalInfo AdditionalInfo { get; set; }
        [JsonProperty("date_created")]
        public DateTime DateCreated { get; set; }
        [JsonProperty("date_approved")]
        public DateTime? DateApproved { get; set; }
        [JsonProperty("external_reference")]
        public string UserId { get; set; }
        [JsonProperty("status")]
        public string Status { get; set; }

    }

    public class AdditionalInfo
    {
        [JsonProperty("items")]
        public Item[] Items { get; set; }
    }

    public class Item
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("category_id")]
        public string CategoryId { get; set; }
        [JsonProperty("unit_price")]
        public string UnitPrice { get; set; }
    }
}

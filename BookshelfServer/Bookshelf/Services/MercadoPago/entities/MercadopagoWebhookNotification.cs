using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bookshelf.Models
{
    public class MercadopagoWebhookNotification
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("live_mode")]
        public bool LiveMode { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
        [JsonProperty("date_created")]
        public DateTime DateCreated { get; set; }
        [JsonProperty("application_id")]
        public long ApplicationId { get; set; }
        [JsonProperty("user_id")]
        public int UserId { get; set; }
        [JsonProperty("action")]
        public string Action { get; set; }
        [JsonProperty("data")]
        public Data Data { get; set; }

    }

    public class Data
    {
        [JsonProperty("id")]
        public string Id { get; set; }
    }
}

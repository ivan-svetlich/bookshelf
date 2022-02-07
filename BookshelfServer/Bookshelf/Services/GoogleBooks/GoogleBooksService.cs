using Bookshelf.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Bookshelf.Services
{
    public class GoogleBooksService
    {
        private string googleBooksUrl;

        public GoogleBooksService()
        {
            googleBooksUrl = "https://www.googleapis.com/books/v1";
        }

        public async Task<Dictionary<string, string>> GetBookThumbnail(string id)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    using (HttpResponseMessage res = await client.GetAsync(
                        $"{googleBooksUrl}/volumes/{id}?fields=(volumeInfo/description,volumeInfo/imageLinks/thumbnail)"))
                    {
                        using (HttpContent content = res.Content)
                        {
                            var data = await content.ReadAsStringAsync();
                            
                            if (data != null)
                            {
                                string description = "";
                                string thumbnail = "";

                                GoogleBooksVolume volume = JsonConvert.DeserializeObject<GoogleBooksVolume>(data);
                                if (volume.VolumeInfo != null)
                                {
                                    if (volume.VolumeInfo.Description != null)
                                    {
                                        description = volume.VolumeInfo.Description;
                                    }

                                    if(volume.VolumeInfo.ImageLinks != null && volume.VolumeInfo.ImageLinks.Thumbnail != null)
                                    {
                                        thumbnail = volume.VolumeInfo.ImageLinks.Thumbnail;
                                    }  
                                }

                                return new Dictionary<string, string> { ["description"] = description, ["thumbnail"] = thumbnail };
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

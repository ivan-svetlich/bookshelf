using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Bookshelf.Configuration;
using Bookshelf.Models;
using Bookshelf.Models.DTOs.Requests;
using Bookshelf.Models.DTOs.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Bookshelf.Services
{
    public class CaptchaVerificationService
    {
        private string url;
        private string secret;
        public CaptchaVerificationService(ReCaptchaConfig reCaptchaConfig)
        {
            url = reCaptchaConfig.Url;
            secret = reCaptchaConfig.Secret;
        }

        static HttpClient client = new HttpClient();

        public async Task<bool> VerifyCaptcha(Models.DTOs.Requests.VerificationRequest verificationRequestDto)
        {
            var verificationRequest = new Models.VerificationRequest
            {
                Response = verificationRequestDto.Response,
                Secret = secret
            };

            HttpResponseMessage result = await CaptchaVerificationService.VerifyCaptchaAsync(verificationRequest, url);

            if (result.IsSuccessStatusCode)
            {
                CaptchaVerificationResponse verificationResponse = await result.Content.ReadAsAsync<CaptchaVerificationResponse>();
                return verificationResponse.Success;
            }

            return false;
        }

        public static async Task<HttpResponseMessage> VerifyCaptchaAsync(Models.VerificationRequest verificationRequest, string url)
        {
            HttpResponseMessage response = await client.PostAsync(
                url + "?secret=" + verificationRequest.Secret + "&response=" + verificationRequest.Response, null);
            response.EnsureSuccessStatusCode();
            return response;
        }
    }
}

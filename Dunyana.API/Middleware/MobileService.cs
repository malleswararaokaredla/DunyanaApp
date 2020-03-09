using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Dunyana.API.Middleware
{
    public class MobileService: IMobileService
    {
        private readonly IConfiguration _configuration;
        public MobileService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<string> SendMobileOTP(string Mobile, string message)
        {
            string result = "";
            try
            {
                string MobileURL = _configuration["MobileSender:MobileURL"];
                WebClient client = new WebClient();
                string baseurl = MobileURL + "&mobileno=" + Mobile + "&msgtext=" + message + "&priority=High&CountryCode=ALL;";
                Stream data = client.OpenRead(baseurl);
                StreamReader reader = new StreamReader(data);
                string s = reader.ReadToEnd();
                if (s.Contains(','))
                {
                    string[] resultlist = s.Split(',');
                    int count = resultlist.Count();
                    if (count == 3)
                    {
                        result = resultlist[2].TrimEnd();
                    }

                }
                if(result == "")
                {
                    result = s;
                }
                data.Close();
                reader.Close();
                await Task.CompletedTask;
                return result;
            }
            catch (Exception ex)
            {

                throw;
            }
        }
    }
}

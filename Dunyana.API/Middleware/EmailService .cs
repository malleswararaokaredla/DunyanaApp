using Microsoft.Extensions.Configuration;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
namespace Dunyana.API.Middleware
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task SendEmail(string email, string subject, string message)
        {
            try
            {
                using (var client = new SmtpClient())
                {
                    var credential = new NetworkCredential
                    {
                        UserName = _configuration["EmailSender:Email"],
                        Password = _configuration["EmailSender:Password"]
                    };

                    client.Credentials = credential;
                    client.Host = _configuration["EmailSender:Host"];
                    client.Port = int.Parse(_configuration["EmailSender:Port"]);
                    client.EnableSsl = true;
                    //client.UseDefaultCredentials = true;
                    using (var emailMessage = new MailMessage())
                    {
                        emailMessage.To.Add(new MailAddress(email));
                        emailMessage.From = new MailAddress(_configuration["EmailSender:Email"]);
                        emailMessage.IsBodyHtml = true;
                        emailMessage.Subject = subject;
                        emailMessage.Body = message;
                        client.Send(emailMessage);
                    }
                }
                await Task.CompletedTask;
            }
            catch (Exception ex)
            {

                throw;
            }
          
        }


    }
}

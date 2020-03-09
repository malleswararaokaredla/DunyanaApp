using System.Threading.Tasks;

namespace Dunyana.API.Middleware
{
    public interface IEmailService
    {
        Task SendEmail(string email, string subject, string message);
    }
}

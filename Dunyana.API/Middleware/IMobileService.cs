using System.Threading.Tasks;

namespace Dunyana.API.Middleware
{
    public interface IMobileService
    {
        Task<string> SendMobileOTP(string Mobile, string message);
    }
}

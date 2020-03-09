namespace Dunyana.Domain
{
    public class AppSettings
    {
        public string Secret { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public string ClientURL { get; set; }
        
    }

    public static class Role
    {
        public const string Customer = "C";
        public const string Merchant = "M";
        public const string NaqelUser = "N";
    }
}

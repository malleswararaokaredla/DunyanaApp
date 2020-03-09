using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Dunyana.Dto
{

    public class MerchantRedirectionlist
    {
        public dynamic Name { get; set; }
        public dynamic Merchantid { get; set; }
        public dynamic MerchantRedirectionUrl { get; set; }
    }
    public class MerchantRedirectionDto
    {
        public string MerchantRedirectionUrl { get; set; }
        [Required(ErrorMessage = "The email address is required")]
        public int Merchantid { get; set; }
    }
    public class MerchantRedirectionlistDto
    {
        public int MerchantRedirectionId { get; set; }
        [Required(ErrorMessage = "The Merchant Attribute is required")]
        public string MerchantAttribute { get; set; }
        [Required(ErrorMessage = "The Merchant Value is required")]
        public string MerchantValue { get; set; }
        [Required(ErrorMessage = "The Merchant Description is required")]
        public string MerchantDescription { get; set; }

    }
    public class MerchantRedirectionUrllistDto
    {
        public string MerchantRedirectionUrl { get; set; }
        public List<MerchantRedirectionlistDto> MerchantRedirectionlist { get; set; }
    }
}
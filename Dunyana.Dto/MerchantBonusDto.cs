using System.ComponentModel.DataAnnotations;

namespace Dunyana.Dto
{
    public class GetMerchantBonusDto
    {
        public int MerchantID { get; set; }
        public string MerchantName { get; set; }
        public decimal? WalletPoints { get; set; }
        public decimal? WalletAmount { get; set; }
        public string MerchantCountry { get; set; }
    }
    public class UpdateMerchantBonusDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "The MerchantID is required")]
        public int MerchantID { get; set; }
        [Range(0, 100, ErrorMessage = "The WalletPoints will not more than 100%")]
        public decimal WalletPoints { get; set; }
        [Range(0, 100, ErrorMessage = "The WalletAmount will not more than 100%")]
        public decimal WalletAmount { get; set; }
    }
}

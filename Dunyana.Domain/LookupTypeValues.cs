using Sym.Core;
using System.Collections.Generic;

namespace Dunyana.Domain
{
    public class LookupTypeValues : TrackAndAuditEntity<LookupTypeValues, int>
    {
        public LookupTypeValues()
        {

        }

        public override int Id { get; set; }
        public string Description { get; set; }
        public string ShortDesc { get; set; }
        public int? CountryMobileCode { get; set; }
        public int LookupTypeID { get; set; }
        public string Status { get; set; }

        public virtual LookupType LookupType { get; set; }
        public virtual ICollection<MerchantSellCountries> MerchantSellCountries { get; set; }
        public virtual WalletHistory WalletHistory { get; set; }
        public virtual MerchantRequest MerchantRequest { get; set; }
        public virtual MerchantRequestDetails MerchantRequestDetails { get; set; }
        public virtual Merchant MerchantCountry { get; set; }
        public virtual Merchant MerchantApprovalStatus { get; set; }
        public virtual CustomerRegistration CustomerCountry { get; set; }
        public virtual NaqelUsers NaqelCountry { get; set; }
        public virtual NaqelUsers NaqelUserType { get; set; }
        public virtual ICollection<MerchantBanner> MerchantBanner { get; set; }
        public virtual ICollection<MerchantDeal> MerchantDeal { get; set; }
        public virtual ICollection<AdminPromotionalCountries> AdminPromotionalCountries { get; set; }
    }
}


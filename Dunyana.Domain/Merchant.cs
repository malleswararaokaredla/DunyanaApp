using Sym.Core;
using System.Collections.Generic;

namespace Dunyana.Domain
{
    public class Merchant : TrackAndAuditEntity<Merchant, int>
    {
        public Merchant()
        {

        }
        public override int Id { get; set; }
        public string Name { get; set; }
        public string ProfileImage { get; set; }
        public string Company { get; set; }
        public string CompanyImage { get; set; }
        public string Website { get; set; }
        public string MerchantRedirectionUrl { get; set; }
        public string Email { get; set; }
        public string Categories { get; set; }
        public int Country { get; set; }
        public string SellCountries { get; set; }
        public int? ApprovalStatus { get; set; }
        public int? UsersID { get; set; }
        public int? TermandCondition { get; set; }
        public virtual ICollection<Order> Order { get; set; }
        public virtual ICollection<MerchantCategory> MerchantCategory { get; set; }
        public virtual ICollection<MerchantRedirection> MerchantRedirection { get; set; }
        public virtual ICollection<MerchantContract> MerchantContract { get; set; }
        public virtual MerchantRequest MerchantRequest { get; set; }
        public virtual ICollection<MerchantSellCountries> MerchantSellCountries { get; set; }
        public virtual LookupTypeValues LookupCountry { get; set; }
        public virtual LookupTypeValues LookupApprovalStatus { get; set; }
        public virtual Deals Deals { get; set; }
        public virtual Users Users { get; set; }
        public virtual Banner Banners { get; set; }
        public virtual ICollection<MerchantBanner> MerchantBanner { get; set; }
        public virtual ICollection<MerchantDeal> MerchantDeal { get; set; }
        public virtual ICollection<MerchantCatalog> MerchantCatalog { get; set; }
        public virtual MerchantBonus MerchantBonus { get; set; }
        public virtual MerchantAccountDetails MerchantAccountDetails { get; set; }
    }
}
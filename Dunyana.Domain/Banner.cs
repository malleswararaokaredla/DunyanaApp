using Sym.Core;
using System;
using System.Collections.Generic;

namespace Dunyana.Domain
{
    public class Banner : TrackAndAuditEntity<Banner, int>
    {
        public Banner()
        {

        }
        public override int Id { get; set; }
        public int MerchantID { get; set; }
        public string Country { get; set; }
        public string EnglishImage { get; set; }
        public string ArabicImage { get; set; }
        public string BannerURL { get; set; }
        public string BannerDescription { get; set; }
        public int Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string TimeZone { get; set; }
        public string IsDefault { get; set; }
        public virtual Merchant Merchant { get; set; }
        public virtual ICollection<MerchantBanner> MerchantBanner { get; set; }
    }
}

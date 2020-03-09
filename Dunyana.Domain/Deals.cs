using Sym.Core;
using System;
using System.Collections.Generic;

namespace Dunyana.Domain
{
    public class Deals : TrackAndAuditEntity<Deals, int>
    {
        public Deals()
        {

        }
        public override int Id { get; set; }
        public  int MerchantId { get; set; }
        public string DealName { get; set; }
        public string DealCode { get; set; }
        public string Country { get; set; }
        public string EnglishImage { get; set; }
        public string ArabicImage { get; set; }
        public string DealURL { get; set; }
        public string DealDescription { get; set; }
        public int Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string TimeZone { get; set; }
        public virtual Merchant Merchant { get; set; }
        public virtual ICollection<MerchantDeal> MerchantDeal { get; set; }
    }
}

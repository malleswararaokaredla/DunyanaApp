using Sym.Core;
using System;
using System.Collections.Generic;

namespace Dunyana.Domain
{
    public class AdminPromotional : TrackAndAuditEntity<AdminPromotional, int>
    {
        public AdminPromotional()
        {

        }
        public override int Id { get; set; }
        public string Promotionalcountries { get; set; }
        public string EnglishImage { get; set; }
        public string ArabicImage { get; set; }
        public string PromotionalURL { get; set; }
        public string Promotionaldescription { get; set; }
        public int Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string TimeZone { get; set; }
        public string IsDefault { get; set; }
        public virtual ICollection<AdminPromotionalCountries> AdminPromotionalCountries { get; set; }
    }
}

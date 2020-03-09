using Sym.Core;

namespace Dunyana.Domain
{
    public class MerchantBanner : TrackAndAuditEntity<MerchantBanner, int>
    {
        public MerchantBanner()
        {

        }
        public override int Id { get; set; }
        public int MerchantID { get; set; }
        public int CountryID { get; set; }
        public int BannerID { get; set; }
        public virtual Merchant Merchant { get; set; }
        public virtual Banner Banner { get; set; }
        public virtual LookupTypeValues LookupTypeValues { get; set; }
    }
}

using Sym.Core;

namespace Dunyana.Domain
{
    public class MerchantSellCountries : TrackAndAuditEntity<MerchantSellCountries, int>
    {
        public MerchantSellCountries()
        {

        }
        public override int Id { get; set; }
        public int MerchantID { get; set; }
        public int Country { get; set; }
        public virtual Merchant Merchant { get; set; }
        public virtual LookupTypeValues LookupTypeValues { get; set; }
    }
}

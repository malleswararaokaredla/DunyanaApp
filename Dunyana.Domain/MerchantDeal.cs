using Sym.Core;

namespace Dunyana.Domain
{
    public class MerchantDeal : TrackAndAuditEntity<MerchantDeal, int>
    {
        public MerchantDeal()
        {

        }
        public override int Id { get; set; }
        public int MerchantID { get; set; }
        public int CountryID { get; set; }
        public int DealID { get; set; }
        public virtual Merchant Merchant { get; set; }
        public virtual Deals Deals { get; set; }
        public virtual LookupTypeValues LookupTypeValues { get; set; }
    }
}

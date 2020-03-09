using Sym.Core;

namespace Dunyana.Domain
{
    public class MerchantCategory : TrackAndAuditEntity<MerchantCategory, int>
    {
        public MerchantCategory()
        {

        }
        public override int Id { get; set; }
        public int CategoryID { get; set; }
        public int MerchantID { get; set; }
        public virtual Merchant Merchant { get; set; }
        public virtual Category Category { get; set; }
    }
}

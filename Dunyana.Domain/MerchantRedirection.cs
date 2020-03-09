using Sym.Core;

namespace Dunyana.Domain
{
    public class MerchantRedirection : TrackAndAuditEntity<MerchantRedirection, int>
    {
        public MerchantRedirection()
        {

        }
        public override int Id { get; set; }
        public int MerchantID { get; set; }
        public string Attribute { get; set; }
        public string Value { get; set; }
        public string Description { get; set; }
        public virtual Merchant Merchant { get; set; }
    }
}

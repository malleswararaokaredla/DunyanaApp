using Sym.Core;

namespace Dunyana.Domain
{
    public class MerchantCatalog : TrackAndAuditEntity<MerchantCatalog, int>
    {
        public MerchantCatalog()
        {

        }
        public override int Id { get; set; }
        public int MerchantID { get; set; }
        public int CategoryID { get; set; }
        public string Subcategory { get; set; }
        public string Brand { get; set; }
        public string Product { get; set; }
        public virtual Merchant Merchant { get; set; }
        public virtual Category Category { get; set; }
    }
}

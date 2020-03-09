using Sym.Core;

namespace Dunyana.Domain
{
    public class MerchantRequest : TrackAndAuditEntity<MerchantRequest, int>
    {
        public MerchantRequest()
        {

        }
        public override int Id { get; set; }
        public int MerchantID { get; set; }
        public int ApprovalStatus { get; set; }
        public int RequestAssignee { get; set; }
        public string Description { get; set; }
        public string MerchantRequestGUID { get; set; }
        public virtual Merchant Merchant { get; set; }
        public virtual LookupTypeValues LookupTypeValues { get; set; }
        public virtual NaqelUsers NaqelUsers { get; set; }
        public virtual MerchantContract MerchantContract { get; set; }
        public virtual MerchantRequestDetails MerchantRequestDetails { get; set; }
    }
}

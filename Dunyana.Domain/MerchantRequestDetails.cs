using Sym.Core;

namespace Dunyana.Domain
{
    public class MerchantRequestDetails : TrackAndAuditEntity<MerchantRequestDetails, int>
    {
        public MerchantRequestDetails()
        {

        }
        public override int Id { get; set; }
        public int MerchantRequestID { get; set; }
        public int ApprovalStatus { get; set; }
        public int RequestAssignee { get; set; }
        public string Description { get; set; }
        public virtual MerchantRequest MerchantRequest { get; set; }
        public virtual LookupTypeValues LookupTypeValues { get; set; }
        public virtual NaqelUsers NaqelUsers { get; set; }
    }
}

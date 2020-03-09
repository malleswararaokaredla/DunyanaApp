using Sym.Core;
using System.Collections.Generic;

namespace Dunyana.Domain
{
    public class MerchantContract : TrackAndAuditEntity<MerchantContract, int>
    {
        public MerchantContract()
        {

        }
        public override int Id { get; set; }
        public int MerchantID { get; set; }
        public int MerchantrequestID { get; set; }
        public string CurrentContractFileName { get; set; }
        public virtual Merchant Merchant { get; set; }
        public virtual MerchantRequest MerchantRequest { get; set; }
        public virtual ICollection<MerchantContractDetails> MerchantContractDetails { get; set; }
    }
}

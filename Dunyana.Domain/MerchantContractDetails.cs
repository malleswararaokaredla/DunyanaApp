using Sym.Core;
using System;
using System.Collections.Generic;

namespace Dunyana.Domain
{
    public class MerchantContractDetails : TrackAndAuditEntity<MerchantContractDetails, int>
    {
        public MerchantContractDetails()
        {

        }
        public override int Id { get; set; }
        public int MerchantcontractID { get; set; }
        public string ContractFileName { get; set; }
        public virtual MerchantContract MerchantContract { get; set; }
    }
}

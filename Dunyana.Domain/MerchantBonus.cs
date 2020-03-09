using Sym.Core;
using System;
using System.Collections.Generic;

namespace Dunyana.Domain
{
    public class MerchantBonus : TrackAndAuditEntity<MerchantBonus, int>
    {
        public MerchantBonus()
        {

        }
        public override int Id { get; set; }
        public int MerchantID { get; set; }
        public decimal? WalletPoints { get; set; }
        public decimal? WalletAmount { get; set; }
        public virtual Merchant Merchant { get; set; }
    }
}

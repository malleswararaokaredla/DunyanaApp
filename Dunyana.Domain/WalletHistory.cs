
using Sym.Core;
using System;

namespace Dunyana.Domain
{
    public class WalletHistory : TrackAndAuditEntity<WalletHistory, int>
    {
        public WalletHistory()
        {

        }
        public override int Id { get; set; }
        public int CustomerID { get; set; }
        public int Type { get; set; }
        public string Transaction { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal TransactionAmount { get; set; }
        public string TransactionDescription { get; set; }      
        public int Status { get; set; }
        public int OrderID { get; set; }
        public virtual LookupTypeValues LookupTypeValues { get; set; }
        //public virtual Wallet Wallet { get; set; }
    }
}

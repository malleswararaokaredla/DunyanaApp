using Sym.Core;
using System;

namespace Dunyana.Domain
{
    public class WalletPointsHistory : TrackAndAuditEntity<WalletPointsHistory, int>
    {
        public WalletPointsHistory()
        {

        }
        public override int Id { get; set; }
        public int CustomerID { get; set; }
        public string Transaction { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal TransactionPoints { get; set; }
        public string TransactionDescription { get; set; }
        public int Status { get; set; }
        public int OrderID { get; set; }
    }
}

using Sym.Core;

namespace Dunyana.Domain
{
    public class WalletPoints : TrackAndAuditEntity<WalletPoints, int>
    {
        public WalletPoints()
        {

        }
        public override int Id { get; set; }
        public decimal Points { get; set; }
        public int CustomerID { get; set; }
        public virtual CustomerRegistration CustomerRegistration { get; set; }
    }
}

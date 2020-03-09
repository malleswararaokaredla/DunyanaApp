using Sym.Core;

namespace Dunyana.Domain
{
    public class Wallet : TrackAndAuditEntity<Wallet, int>
    {
        public Wallet()
        {

        }
        public override int Id { get; set; }
        public decimal Amount { get; set; }
        public int CustomerID { get; set; }
        public virtual CustomerRegistration CustomerRegistration { get; set; }
    }
}

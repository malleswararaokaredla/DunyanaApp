using Sym.Core;
using System;

namespace Dunyana.Domain
{
    public class PaymentCards : TrackAndAuditEntity<PaymentCards, int>
    {
        public PaymentCards()
        {

        }
        public override int Id { get; set; }
        public int last4digits { get; set; }
        public string CardType { get; set; }
        public int Expmonth { get; set; }
        public int Expyear { get; set; }
        public int CustomerId { get; set; }
        public string CardCustomerId { get; set; }
        public string CardSourceId { get; set; }
        public virtual CustomerRegistration CustomerRegistration { get; set; }
    }
}

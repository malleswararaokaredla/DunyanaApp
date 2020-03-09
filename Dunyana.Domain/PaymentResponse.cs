using Sym.Core;
using System;

namespace Dunyana.Domain
{
    public class PaymentResponse : TrackAndAuditEntity<PaymentResponse, int>
    {
        public PaymentResponse()
        {

        }
        public override int Id { get; set; }        
        public DateTime PaymentDate { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public int Card { get; set; }
        public string Cardscheme { get; set; }
        public string CardType { get; set; }
        public string PaymentStatus { get; set; }
        public string TransactionId { get; set; }
        public string TransactionType { get; set; }
        public int CustomerId { get; set; }
        public int OrderId { get; set; }
        public string PaymentCustomerId { get; set; }
        public string PaymentSourceId { get; set; }
        public string ReturnPaymentResponse { get; set; }
        public virtual CustomerRegistration CustomerRegistration { get; set; }
    }
}

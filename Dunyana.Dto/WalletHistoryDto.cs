using System;
using Checkout.Payments;
namespace Dunyana.Dto
{
    public class WalletHistoryDto
    {
        public int Id { get; set; }
        public string CustomerID { get; set; }
        public string Type { get; set; }
        public string Transaction { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal TransactionAmount { get; set; }
        public string TransactionDescription { get; set; }
        public int Status { get; set; }
        public bool SaveCard { get; set; }
        public GetPaymentResponse SourceId { get; set; }
        public PaymentResponse PaymentResponseSource { get; set; }
        public bool? isExistingCard { get; set; }
        public int? OrderID { get; set; }
        public decimal OrderWalletPaymentAmount { get; set; }
    }
    public class MobileWalletHistoryDto
    {
        public int Id { get; set; }
        public string CustomerID { get; set; }
        public string Type { get; set; }
        public string Transaction { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal TransactionAmount { get; set; }
        public string TransactionDescription { get; set; }
        public int Status { get; set; }
        public bool SaveCard { get; set; }
        public GetMobilePaymentResponse SourceId { get; set; }
        public PaymentResponse PaymentResponseSource { get; set; }
        public bool? isExistingCard { get; set; }
        public int? OrderID { get; set; }
        public decimal OrderWalletPaymentAmount { get; set; }
    }
}

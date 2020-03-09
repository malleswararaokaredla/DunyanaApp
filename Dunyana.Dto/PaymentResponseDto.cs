using System;
using System.ComponentModel.DataAnnotations;

namespace Dunyana.Dto
{
    public class PaymentResponseDto
    {

        [Required]
        [DataType(DataType.Date, ErrorMessage = "The PaymentDate must be yyyy-MM-dd HH:MM:SS DateFormat"), DisplayFormat(DataFormatString = "{0:yyyy-MM-dd HH:MM:SS}", ApplyFormatInEditMode = true)]
        public DateTime PaymentDate { get; set; }
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public string Currency { get; set; }
        [Required]
        [Display(Name = "Cardlast4digits")]
        public int Card { get; set; }
        [Required]
        public string Cardscheme { get; set; }
        [Required]
        public string CardType { get; set; }
        [Required]
        public string PaymentStatus { get; set; }
        [Required]
        public string TransactionId { get; set; }
        [Required(ErrorMessage = "The Transaction Type should be M(Merchant) or W(Wallet)")]
        public string TransactionType { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "The CustomerId is required")]
        public int CustomerId { get; set; }
        [Required]
        public string PaymentCustomerId { get; set; }
        [Required]
        public string PaymentSourceId { get; set; }
        [Required]
        public string ReturnPaymentResponse { get; set; }
        public int OrderId { get; set; }
    }
    public class PaymentResponseWithoutRequiredDto
    {
        public DateTime PaymentDate { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public int Card { get; set; }
        public string Cardscheme { get; set; }
        public string CardType { get; set; }
        public string PaymentStatus { get; set; }
        public string TransactionId { get; set; }
        public string TransactionType { get; set; }
        public string ReturnPaymentResponse { get; set; }
    }
}

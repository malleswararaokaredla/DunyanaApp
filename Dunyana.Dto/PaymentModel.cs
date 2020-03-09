using System.ComponentModel.DataAnnotations;


namespace Dunyana.Domain.Models
{
    public class PaymentModel
    {
        public PaymentModel()
        {
            Capture = true;
        }
        
        [Required]
        [Display(Name = "Amount (in minor currency unit)")]
        public decimal Amount { get; set; }

        [Required]
        public string Currency { get; set; }

        [Display(Name = "3-D Secure")]
        public bool DoThreeDS { get; set; }
        public string CardToken { get; set; }
        public string CardBin { get; set; }
        public string Currencies { get; set; }
        public bool Capture { get; set; }
        public string Reference { get; set; }
        public string CustomerId { get; set; }
        public bool? isExistingCard { get; set; }
        public string CVV { get; set; }
        public bool SaveCard { get; set; }
        public int? PaymentCardId { get; set; }
        public bool IsFromOrder { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Dunyana.Dto
{
    public class PaymentCardsDto
    {
        [Required]
        [Display(Name = "Cardlast4digits")]
        public int last4digits { get; set; }
        [Required]
        public string CardType { get; set; }
        [Required]
        public int Expmonth { get; set; }
        [Required]
        public int Expyear { get; set; }
        [Required]
        public int CustomerId { get; set; }
        [Required]
        public string CardCustomerId { get; set; }
        [Required]
        public string CardSourceId { get; set; }
    }
    public class GetPaymentCardsDto
    {
        public int paymentcardId { get; set; }
        public int last4digits { get; set; }
        public string CardType { get; set; }
        public int Expmonth { get; set; }
        public int Expyear { get; set; }
        public int CustomerId { get; set; }
        public string CardCustomerId { get; set; }
        public string CardSourceId { get; set; }
    }
}

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Dunyana.Dto
{

    public class MerchantResponseDto
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "The MerchantID is required")]
        public int MerchantID { get; set; }
        [Required(ErrorMessage = "The MerchantUserName is required")]
        public string MerchantUserName { get; set; }
        [Required(ErrorMessage = "The MerchantPassword is required")]
        public string MerchantPassword { get; set; }
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "The CustomerID is required")]
        public int CustomerID { get; set; }
        public List<OrderDetailsDto> OrderDetails { get; set; }
    }
}

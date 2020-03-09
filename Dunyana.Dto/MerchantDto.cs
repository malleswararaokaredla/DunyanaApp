using System.ComponentModel.DataAnnotations;

namespace Dunyana.Dto
{
    public class MerchantDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ProfileImage { get; set; }
        public string Company { get; set; }
        public string CompanyImage { get; set; }
        public string Website { get; set; }
        [Required(ErrorMessage = "The email address is required")]
        public string Email { get; set; }
        public string Categories { get; set; }
        public int Country { get; set; }
        public string SellCountries { get; set; }
        public string PWD { get; set; }

        public int UsersID { get; set; }
    }
    public class InsertMerchantDto
    {
        [Required(ErrorMessage = "The Name is required")]
        public string Name { get; set; }
        public string ProfileImage { get; set; }
        [Required(ErrorMessage = "The Company is required")]
        public string Company { get; set; }
        public string CompanyImage { get; set; }
        [Required(ErrorMessage = "The Website link is required")]
        public string Website { get; set; }
        [Required(ErrorMessage = "The email address is required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "The Categories is required")]
        public string Categories { get; set; }
        [Required(ErrorMessage = "The Country is required")]
        public int Country { get; set; }
        [Required(ErrorMessage = "The SellCountries is required")]
        public string SellCountries { get; set; }
        [Required(ErrorMessage = "The Password is required")]
        public string PWD { get; set; }
        [Required]
        [EnumDataType(typeof(MerchantTermandCondition), ErrorMessage = "The TermandCondition should be 'Y'(Yes) or 'N'(No)")]
        public string TermandCondition { get; set; }
    }
    public class MerchantProfile
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ProfileImage { get; set; }
        public string Company { get; set; }
        public string CompanyImage { get; set; }
        public string Website { get; set; }     
        public string Email { get; set; }
        public string Categories { get; set; }
        public string Country { get; set; }
        public string SellCountries { get; set; }
        public string PWD { get; set; }
        public string MerchantRedirectionUrl { get; set; }
        //public List<MerchantRedirectionDto> MerchantRedirectionDto { get; set; }
    }
    public class MerchantByCategory
    {
        [Range(1, int.MaxValue, ErrorMessage = "The CategoryID is required")]
        public int CategoryID { get; set; }
        [Required(ErrorMessage = "The Ipcountry is required")]
        public string Ipcountry { get; set; }
    }
    public class GetMerchant
    {
       [Required(ErrorMessage = "The email address is required")]
        public string Email { get; set; }
    }
    public enum MerchantTermandCondition
    {
        Y = 1,
        N = 0
    }
    public class GetMerchantAccountDetailsDto
    {
        public int Id { get; set; }
        public string MerchantContractNumber { get; set; }
        public string AccountCR { get; set; }
        public string BrandAccount { get; set; }
        public string BankName { get; set; }
        public string AccountNumber { get; set; }
        public string Address { get; set; }
        public string Swiftcode  { get; set; }
    }
    public class UpdateMerchantAccountDetailsDto
    {
        public int Id { get; set; }
        public string MerchantEmail { get; set; }
        public string AccountCR { get; set; }
        public string BrandAccount { get; set; }
        public string BankName { get; set; }
        public string AccountNumber { get; set; }
        public string Address { get; set; }
        public string Swiftcode { get; set; }
    }
    public class InsertMerchantAccountDetailsDto
    {
        public int MerchantId { get; set; }
        public string AccountCR { get; set; }
        public string BrandAccount { get; set; }
        public string BankName { get; set; }
        public string AccountNumber { get; set; }
        public string Address { get; set; }
        public string Swiftcode { get; set; }
    }
    public class InsertMerchantContractNumberDto
    {
        public int MerchantId { get; set; }
        public string MerchantContractNumber { get; set; }
    }
    public class UpdateMerchantContractNumberDto
    {
        public int MerchantId { get; set; }
        public string MerchantContractNumber { get; set; }
    }
    public class MerchantAccountDto
    {
        [Required(ErrorMessage = "The MerchantEmail is required")]
        public string MerchantEmail { get; set; }
      
    }
}

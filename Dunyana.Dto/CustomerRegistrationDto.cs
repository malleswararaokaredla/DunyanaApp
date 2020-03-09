using System.ComponentModel.DataAnnotations;

namespace Dunyana.Dto
{
    public class CustomerRegistrationDto
    {
        public dynamic Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [Required(ErrorMessage = "The email address is required")]
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Address { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Image { get; set; }
        public int EmailVerified { get; set; }
        //public bool MobileVerified { get; set; }
        public string LoginType { get; set; }
        public string FBID { get; set; }
        public string GoogleID { get; set; }
        public string OldPWD { get; set; }
        public string PWD { get; set; }
        public string Type { get; set; }
        public int Status { get; set; }
        public int UsersID { get; set; }
        public int OTP { get; set; }
        public int MobileOTP { get; set; }
        //public string EncId { get; set; }
    }
    public class MobileOTPDto
    {
        public string Mobile { get; set; }
        public string Mobilewithcountrycode { get; set; }
    }
    public class InsertCustomerRegistrationDto
    {
        [Required(ErrorMessage = "The FirstName is required")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "The LastName is required")]
        public string LastName { get; set; }
        [Required(ErrorMessage = "The email is required")]
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Address { get; set; }
        [Required(ErrorMessage = "The Country is required")]
        public string Country { get; set; }
        [Required(ErrorMessage = "The City is required")]
        public string City { get; set; }
        public string LoginType { get; set; }
        [Required(ErrorMessage = "The PWD is required")]
        public string PWD { get; set; }
        [Required]
        [EnumDataType(typeof(TermandCondition), ErrorMessage = "The TermandCondition should be 'Y'(Yes) or 'N'(No)")]
        public string TermandCondition { get; set; }
        public int OTP { get; set; }
        public int MobileOTP { get; set; }
    }
    public class CustomerWalletBalance
    {
        public int CustomerID { get; set; }
        public string CustomerGUID { get; set; }
        public string CustomerName { get; set; }
        public string Currency { get; set; }
        public decimal? WalletBalance { get; set; }
    }
    public class LoginDto
    {
        [Required(ErrorMessage = "Please enter email")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Please enter password")]
        public string PWD { get; set; }

    }
    public class GetProfileDto
    {
        [Required(ErrorMessage = "Please enter email")]
        public string Email { get; set; }

    }
    public class UsersProfileDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Type { get; set; }
        public int Status { get; set; }
        public string GUID { get; set; }
        public string token { get; set; }

    }
    public enum TermandCondition
    {
        Y = 1,
        N = 0
    }
}

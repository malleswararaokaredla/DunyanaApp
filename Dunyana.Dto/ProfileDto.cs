using System.Collections.Generic;

namespace Dunyana.Dto
{
    public class ProfileDto
    {
        public dynamic Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mobile { get; set; }
        public string Address { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Image { get; set; }
        public string PWD { get; set; }
        public decimal Wallet { get; set; }
        public decimal WalletPoints { get; set; }
        public string ProfileImage { get; set; }
        public string Company { get; set; }
        public string Customercurrency { get; set; }
        public int Status { get; set; }
        public string Type { get; set; }
        public string CompanyImage { get; set; }
        public string Website { get; set; }           
        public string MerchantRedirectionUrl { get; set; }
        public int? NaqelUserType { get; set; }
        public List<ProfileCategoriesDto> Categories { get; set; }
        public List<ProfileSellCountriesDto> SellCountries { get; set; }

    }
    public class ProfileCategoriesDto
    {
        public int? CategoryId { get; set; }
        public string CategoryName { get; set; }
    }
    public class ProfileSellCountriesDto
    {
        public int? SellCountryId { get; set; }
        public string SellCountryName { get; set; }
    }
}

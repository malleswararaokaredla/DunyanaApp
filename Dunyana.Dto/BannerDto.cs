using System;
using System.ComponentModel.DataAnnotations;

namespace Dunyana.Dto
{
    public class GetBannerDto
    {
        public int BannerId { get; set; }
        public int MerchantId { get; set; }
        public string MerchantName { get; set; }
        public string Countries { get; set; }
        public string EnglishImage { get; set; }
        public string ArabicImage { get; set; }
        public string BannerURL { get; set; }
        public string BannerDescription { get; set; }
        public int Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
    public class MerchantBannerDto
    {
        [Required]
        [EnumDataType(typeof(BannerType), ErrorMessage = "The Type should be 'A'(Active) or 'E'(Expiried)")]
        public string Type { get; set; }
        [Required(ErrorMessage = "The MerchantEmail is required")]
        public string MerchantEmail { get; set; }
        [Required(ErrorMessage = "The CountryTimezone is required")]
        public string CountryTimezone { get; set; }
    }
    public class BannerDto
    {
        [Required(ErrorMessage = "The MerchantEmail is required")]
        public string MerchantEmail { get; set; }
        [Required(ErrorMessage = "The Countries is required")]
        public string Countries { get; set; }
        public string EnglishImage { get; set; }
        public string ArabicImage { get; set; }

        public string BannerURL { get; set; }
        public string BannerDescription { get; set; }
        [Required(ErrorMessage = "The StartDate is required")]
        [DataType(DataType.Date, ErrorMessage = "The StartDate must be yyyy-MM-dd HH:MM:SS DateFormat"), DisplayFormat(DataFormatString = "{0:yyyy-MM-dd HH:MM:SS}", ApplyFormatInEditMode = true)]
        public DateTime StartDate { get; set; }
        [Required(ErrorMessage = "The EndDate is required")]
        [DataType(DataType.Date, ErrorMessage = "The EndDate must be yyyy-MM-dd HH:MM:SS DateFormat"), DisplayFormat(DataFormatString = "{0:yyyy-MM-dd HH:MM:SS}", ApplyFormatInEditMode = true)]
        public DateTime EndDate { get; set; }
        [Required(ErrorMessage = "The CountryTimezone is required")]
        public string CountryTimezone { get; set; }
    }
    public class UpdateBannerDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "The BannerId is required")]
        public int BannerId { get; set; }
        public int MerchantId { get; set; }
        public string Countries { get; set; }
        public string EnglishImage { get; set; }
        public string ArabicImage { get; set; }
        public string BannerURL { get; set; }
        public string BannerDescription { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        [Required(ErrorMessage = "The CountryTimezone is required")]
        public string CountryTimezone { get; set; }
    }
    public class DeleteBannerDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "The BannerId is required")]
        public int BannerId { get; set; }
        [Required(ErrorMessage = "The CountryTimezone is required")]
        public string CountryTimezone { get; set; }
    }
    public enum BannerType
    {
        A, E
    }

}

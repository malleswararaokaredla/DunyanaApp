using System;
using System.ComponentModel.DataAnnotations;

namespace Dunyana.Dto
{
    public class GetDealDto
    {
        public int DealId { get; set; }
        public int MerchantId { get; set; }
        public string MerchantName { get; set; }
        public string DealName { get; set; }
        public string DealCode { get; set; }
        public string Countries { get; set; }
        public string EnglishImage { get; set; }
        public string ArabicImage { get; set; }
        public string DealURL { get; set; }
        public string DealDescription { get; set; }
        public int Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
    public class MerchantDealDto
    {
        [Required]
        [EnumDataType(typeof(DealType), ErrorMessage = "The Type should be 'A'(Active) or 'E'(Expiried)")]
        public string Type { get; set; }
        [Required(ErrorMessage = "The MerchantEmail is required")]
        public string MerchantEmail { get; set; }
        [Required(ErrorMessage = "The CountryTimezone is required")]
        public string CountryTimezone { get; set; }
    }
    public class DealDto
    {
        [Required(ErrorMessage = "The MerchantEmail is required")]
        public string MerchantEmail { get; set; }
        [Required(ErrorMessage = "The DealName is required")]
        public string DealName { get; set; }
        public string DealCode { get; set; }
        [Required(ErrorMessage = "The Countries is required")]
        public string Countries { get; set; }
        public string EnglishImage { get; set; }
        public string ArabicImage { get; set; }

        public string DealURL { get; set; }
        public string DealDescription { get; set; }
        [Required(ErrorMessage = "The StartDate is required")]
        [DataType(DataType.Date, ErrorMessage = "The StartDate must be yyyy-MM-dd HH:MM:SS DateFormat"), DisplayFormat(DataFormatString = "{0:yyyy-MM-dd HH:MM:SS}", ApplyFormatInEditMode = true)]
        public DateTime StartDate { get; set; }
        [Required(ErrorMessage = "The EndDate is required")]
        [DataType(DataType.Date, ErrorMessage = "The EndDate must be yyyy-MM-dd HH:MM:SS DateFormat"), DisplayFormat(DataFormatString = "{0:yyyy-MM-dd HH:MM:SS}", ApplyFormatInEditMode = true)]
        public DateTime EndDate { get; set; }
        [Required(ErrorMessage = "The CountryTimezone is required")]
        public string CountryTimezone { get; set; }
    }
    public class UpdateDealDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "The DealId is required")]
        public int DealId { get; set; }
        public int MerchantId { get; set; }
        public string DealName { get; set; }
        public string DealCode { get; set; }
        public string Countries { get; set; }
        public string EnglishImage { get; set; }
        public string ArabicImage { get; set; }
        public string DealURL { get; set; }
        public string DealDescription { get; set; }
        [Required(ErrorMessage = "The CountryTimezone is required")]
        public string CountryTimezone { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
    public class DeleteDealDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "The DealId is required")]
        public int DealId { get; set; }
        [Required(ErrorMessage = "The CountryTimezone is required")]
        public string CountryTimezone { get; set; }
    }
    public enum DealType
    {
        A, E
    }
}

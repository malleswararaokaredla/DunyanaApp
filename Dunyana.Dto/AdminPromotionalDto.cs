using System;
using System.ComponentModel.DataAnnotations;

namespace Dunyana.Dto
{
    public class GetAdminPromotionalDto
    {
        public int PromotionalId { get; set; }
        public string Countries { get; set; }
        public string EnglishImage { get; set; }
        public string ArabicImage { get; set; }
        public string AdminPromotionalURL { get; set; }
        public string AdminPromotionalDescription { get; set; }
        public int Status { get; set; }
        public string IsDefault { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
    public class AdminPromotionalDto
    {
        [Required]
        [EnumDataType(typeof(PromotionalType), ErrorMessage = "The Type should be 'A'(Active) or 'E'(Expiried) or 'D'(Default)")]
        public string Type { get; set; }
        [Required(ErrorMessage = "The CountryTimezone is required")]
        public string CountryTimezone { get; set; }
    }
    public class InsertAdminPromotionalDto
    {
        public string Countries { get; set; }
        public string EnglishImage { get; set; }
        public string ArabicImage { get; set; }
        public string AdminPromotionalURL { get; set; }
        public string AdminPromotionalDescription { get; set; }
        public int Status { get; set; }
        public string IsDefault { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        [Required(ErrorMessage = "The CountryTimezone is required")]
        public string CountryTimezone { get; set; }
    }
    public class UpdateAdminPromotionalDto
    {
        public int PromotionalId { get; set; }
        public string Countries { get; set; }
        public string EnglishImage { get; set; }
        public string ArabicImage { get; set; }
        public string AdminPromotionalURL { get; set; }
        public string AdminPromotionalDescription { get; set; }
        public int Status { get; set; }
        public string IsDefault { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        [Required(ErrorMessage = "The CountryTimezone is required")]
        public string CountryTimezone { get; set; }
    }
    public class DeleteAdminPromotionalDto
    {
        public int PromotionalId { get; set; }
        [Required(ErrorMessage = "The CountryTimezone is required")]
        public string CountryTimezone { get; set; }
    }
    public enum PromotionalType
    {
        A, E, D
    }
}

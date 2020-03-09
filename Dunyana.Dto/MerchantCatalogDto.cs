
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Dunyana.Dto
{
    public class GetMerchantCatalogDto
    {
        public int Id { get; set; }
        public int MerchantID { get; set; }
        public string MerchantName { get; set; }
        public string CategoryName { get; set; }
        public string Subcategory { get; set; }
        public string Brand { get; set; }
        public string Product { get; set; }
    }
    public class MerchantCataloglist
    {
        public int Id { get; set; }
        public int MerchantID { get; set; }
        public string MerchantName { get; set; }
        public string CategoryName { get; set; }
        public string Subcategory { get; set; }
        public string Brand { get; set; }
        public string Product { get; set; }
    }
    public class GetMerchantCategoryCataloglist
    {
        public int MerchantID { get; set; }
        public string MerchantName { get; set; }
        public List<MerchantCategoryCatalogDto> MerchantCategory { get; set; }
    }
    public class GetMerchantCatalogMerchantDto
    {
        [Required(ErrorMessage = "The MerchantEmailId is required")]
        public string MerchantEmailId { get; set; }
    }
    public class InsetMerchantCatalogDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "The MerchantID is required")]
        public int MerchantID { get; set; }
        [Required]
        [EnumDataType(typeof(MerchantCatalogType), ErrorMessage = "The Type should be 'O'(Overwrite) or 'A'(Append) or 'D'(Direct)")]
        public string Type { get; set; }
        [Required(ErrorMessage = "The MerchantCatalog is required")]
        public List<MerchantCatalogDto> MerchantCatalog { get; set; }
    }
    public class MerchantCatalogDto
    {
        [Required(ErrorMessage = "The CategoryName is required")]
        public string CategoryName{ get; set; }
        public string Subcategory { get; set; }
        public string Brand { get; set; }
        public string Product { get; set; }
    }
    public class UpdateMerchantCatalogDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "The MerchantCatalogId is required")]
        public int MerchantCatalogId { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "The MerchantID is required")]
        public int MerchantID { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "The CategoryID is required")]
        public int CategoryID { get; set; }
        public string Subcategory { get; set; }
        public string Brand { get; set; }
        public string Product { get; set; }
    }
    public class DeleteMerchantCatalogDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "The MerchantCatalogId is required")]
        public int MerchantCatalogId { get; set; }
    }
    public enum MerchantCatalogType
    {
        O,
        A,
        D,
    }
    public class MerchantCategoryCatalogDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
    }
}

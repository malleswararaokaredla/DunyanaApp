using System.ComponentModel.DataAnnotations;

namespace Dunyana.Dto
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public int Priority { get; set; }
        public int IsActive { get; set; }
    }
    public class GetCategorylistDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public int Priority { get; set; }
        public int IsActive { get; set; }
        public int MerchantCount { get; set; }
    }
    public class GetCategoryDto
    {
        [Required]
        [EnumDataType(typeof(CategoryType), ErrorMessage = "The Type should be 'A'(All) or 'O'(Open)")]
        public string Type { get; set; }
        [Required(ErrorMessage = "The Ipcountry is required")]
        public string Ipcountry { get; set; }
    }
    public class DeleteCategoryDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "The CategoryId is required")]
        public int CategoryId { get; set; }
    }
    public enum CategoryType
    {
        A,
        O
    }
}

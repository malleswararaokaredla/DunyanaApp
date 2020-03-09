
using Dunyana.DataAccess.Repositories;
using Dunyana.Domain;
using Dunyana.Dto;
using Microsoft.AspNetCore.Http;
using Sym.Core.Service;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dunyana.Services
{
    public class CategoryService : EntityService<Category, CategoryRepository>
    {
        private readonly LookupTypeValuesService _LookupTypeValuesService;
        public CategoryService(CategoryRepository repository, LookupTypeValuesService LookupTypeValuesService,
         IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {
            _LookupTypeValuesService = LookupTypeValuesService;

        }
        public async Task<List<GetCategorylistDto>> GetAll(GetCategoryDto GetCategoryDto)
        {
            List<GetCategorylistDto> Categorylist = new List<GetCategorylistDto>();
            //return Repository.OrderBy(x => x.Priority).ToList();
            int countryID = await _LookupTypeValuesService.GetCountryID(GetCategoryDto.Ipcountry);
            var getCategory = (from s in this.Repository
                               select new
                               {
                                   s.Id,
                                   s.Image,
                                   s.Name,
                                   s.Priority,
                                   s.IsActive,
                                   //s.MerchantCategory
                               }).ToList();
            if (GetCategoryDto.Type != "A")
            {
                getCategory = getCategory.Where(m => m.IsActive.Equals(1)).ToList()
                             .OrderBy(x => x.Priority).ToList();
                foreach (var Category in getCategory)
                {
                    int Merchantcount = 0;
                    GetCategorylistDto CategoryDto = new GetCategorylistDto();

                    CategoryDto.Id = Category.Id;
                    CategoryDto.Image = Category.Image;
                    CategoryDto.Name = Category.Name;
                    CategoryDto.Priority = Category.Priority;
                    CategoryDto.IsActive = Category.IsActive;
                    //foreach (var MerchantCategory in Category.MerchantCategory)
                    //{
                    //    if (MerchantCategory.Merchant != null && MerchantCategory.Merchant.MerchantSellCountries != null)
                    //    {
                    //        foreach (var MerchantSellCategory in MerchantCategory.Merchant.MerchantSellCountries)
                    //        {
                    //            if (MerchantSellCategory.Country == countryID)
                    //            {
                    //                if (MerchantCategory.Merchant.MerchantRequest != null)
                    //                {
                    //                    if (MerchantCategory.Merchant.MerchantRequest.ApprovalStatus != 0)
                    //                    {
                    //                        if (MerchantCategory.Merchant.MerchantRequest.ApprovalStatus == 26)
                    //                        {
                    //                            Merchantcount++;
                    //                        }
                    //                    }
                    //                }
                    //            }
                    //        }
                    //    }
                    //}
                    CategoryDto.MerchantCount = Merchantcount;
                    Categorylist.Add(CategoryDto);
                }
            }
            else
            {
                foreach (var Category in getCategory)
                {
                    GetCategorylistDto CategoryDto = new GetCategorylistDto();

                    CategoryDto.Id = Category.Id;
                    CategoryDto.Image = Category.Image;
                    CategoryDto.Name = Category.Name;
                    CategoryDto.Priority = Category.Priority;
                    CategoryDto.IsActive = Category.IsActive;
                    Categorylist.Add(CategoryDto);
                }
            }

            return Categorylist.OrderBy(x => x.Priority).ToList();
        }
        public async Task<string> InsertCategoryDetails(CategoryDto CategoryDto)
        {
            int Categorycount = Repository.Where(x => x.Name == CategoryDto.Name).Count();
            var CategoryPriority = Repository.SingleOrDefault(x => x.Priority == CategoryDto.Priority);
            if (Categorycount == 0 && CategoryPriority == null)
            {
                await Repository.InsertAsync(new Category
                {
                    Name = CategoryDto.Name,
                    Image = CategoryDto.Image,
                    Priority = CategoryDto.Priority,
                    IsActive = CategoryDto.IsActive
                });
                return "A new category is added successfully.";
            }
            else if (Categorycount != 0)
            {
                return "Duplicate category name.";
            }
            else
            {
                return "This priority already assign for the '" + CategoryPriority.Name + "' category.";
            }

        }
        public async Task<int> GetCategoryId(string CategoryName)
        {
            var Category = Repository.Where(x => x.Name == CategoryName.Trim() && x.IsActive == 1).SingleOrDefault();
            if (Category == null)
                return 0;
            return Category.Id;
        }
        public async Task<string> UpdateCategorys(CategoryDto CategoryDto)
        {
            string Returnmessage = string.Empty;
            var isvalid = Repository.SingleOrDefault(x => x.Id == CategoryDto.Id);
            if (isvalid.Name == CategoryDto.Name && isvalid.Priority == CategoryDto.Priority)
            {
                Returnmessage = "Success";

            }
            else if (isvalid.Name != CategoryDto.Name && isvalid.Priority == CategoryDto.Priority)
            {
                int Categorycount = Repository.Where(x => x.Name == CategoryDto.Name).Count();
                if (Categorycount == 0)
                {
                    Returnmessage = "Success";

                }
                else
                {
                    Returnmessage = "Duplicate category name.";
                }
            }
            else if (isvalid.Name == CategoryDto.Name && isvalid.Priority != CategoryDto.Priority)
            {
                var CategoryPriority = Repository.SingleOrDefault(x => x.Priority == CategoryDto.Priority);
                if (CategoryPriority == null)
                {
                    Returnmessage = "Success";

                }
                else
                {
                    Returnmessage = "This priority already assign for the '" + CategoryPriority.Name + "' category.";
                }
            }
            else
            {
                int Categorycount = Repository.Where(x => x.Name == CategoryDto.Name).Count();
                var CategoryPriority = Repository.SingleOrDefault(x => x.Priority == CategoryDto.Priority);
                if (Categorycount == 0 && CategoryPriority == null)
                {
                    Returnmessage = "Success";

                }
                else if (Categorycount != 0)
                {
                    Returnmessage = "Duplicate category name.";
                }
                else
                {
                    Returnmessage = "This priority already assign for the '" + CategoryPriority.Name + "' category.";
                }
            }
            if (Returnmessage == "Success")
            {
                if (!string.IsNullOrEmpty(CategoryDto.Image))
                {
                    isvalid.Image = CategoryDto.Image;
                }
                if (!string.IsNullOrEmpty(CategoryDto.Name))
                {
                    isvalid.Name = CategoryDto.Name;
                }
                if (!string.IsNullOrEmpty(CategoryDto.IsActive.ToString()))
                {
                    isvalid.IsActive = CategoryDto.IsActive;
                }
                if (!string.IsNullOrEmpty(CategoryDto.Priority.ToString()))
                {
                    isvalid.Priority = CategoryDto.Priority;
                }

                await Repository.UpdateAsync(isvalid);
                return "Categories updated successfully.";
            }
            else
            {
                return Returnmessage;
            }
        }
        public async Task<string> deleteCategory(int CategoryId)
        {
            var getCategoryList = this.Repository.Where(x => x.Id == CategoryId).ToList();

            int Categorycount = 0;

            foreach (var MerchantCategoryList in getCategoryList)
            {
                foreach (var CategoryList in MerchantCategoryList.MerchantCategory)
                {
                    if (CategoryList.CategoryID == CategoryId)
                    {
                        Categorycount++;
                    }

                }
            }

            if (Categorycount == 0)
            {
                Repository.Delete(getCategoryList);
                return "Category delete successfully.";
            }
            else
            {
                return "";
            }

        }
    }
}

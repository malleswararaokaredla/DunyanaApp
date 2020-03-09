using Dunyana.DataAccess.Repositories;
using Dunyana.Domain;
using Dunyana.Dto;
using Microsoft.AspNetCore.Http;
using Sym.Core.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dunyana.Services
{
    public class MerchantCatalogService : EntityService<MerchantCatalog, MerchantCatalogRepository>
    {
        private readonly CategoryService _CategoryService;
        public MerchantCatalogService(MerchantCatalogRepository repository, CategoryService CategoryService,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {

            _CategoryService = CategoryService;
        }
        public async Task<List<GetMerchantCatalogDto>> GetMerchantCatalogbyMerchantId(int MerchantId)
        {

            var getCategoryCatalog = (from s in this.Repository
                                      select new
                                      {
                                          s.Id,
                                          MerchantId = s.Merchant.Id,
                                          MerchantName = s.Merchant.Name,
                                          CategoryName = s.Category.Name,
                                          s.Subcategory,
                                          s.Brand,
                                          s.Product,
                                      }).Where(s => s.MerchantId == MerchantId).OrderBy(s => s.CategoryName).ToList();

            List<GetMerchantCatalogDto> MerchantCataloglist = new List<GetMerchantCatalogDto>();
            foreach (var CategoryCatalog in getCategoryCatalog)
            {
                GetMerchantCatalogDto GetMerchantCatalogDto = new GetMerchantCatalogDto();

                GetMerchantCatalogDto.Id = CategoryCatalog.Id;
                GetMerchantCatalogDto.MerchantID = CategoryCatalog.MerchantId;
                GetMerchantCatalogDto.MerchantName = CategoryCatalog.MerchantName;
                GetMerchantCatalogDto.CategoryName = CategoryCatalog.CategoryName;
                GetMerchantCatalogDto.Subcategory = CategoryCatalog.Subcategory;
                GetMerchantCatalogDto.Brand = CategoryCatalog.Brand;
                GetMerchantCatalogDto.Product = CategoryCatalog.Product;
                MerchantCataloglist.Add(GetMerchantCatalogDto);
            }

            return MerchantCataloglist;

        }
        public async Task<int> CheckMerchantCatalog(int MerchantId, string CategoryName, string Subcategory, string Brand, string Product)
        {
            var isvalid = Repository.Where(x => x.Merchant.Id == MerchantId && x.Category.Name == CategoryName && x.Subcategory == Subcategory && x.Brand == Brand && x.Product == Product).SingleOrDefault();
            if (isvalid == null)
                return 0;
            return 1;
        }
        public async Task<int> CheckMerchantCatalogForupdate(int MerchantCatalogId, int MerchantId, int CategoryId, string Subcategory, string Brand, string Product)
        {
            int returnvalue = 1;
            var MerchantCataloglist = Repository.Where(x => x.MerchantID == MerchantId && x.CategoryID == CategoryId && x.Subcategory == Subcategory && x.Brand == Brand && x.Product == Product && x.Id != MerchantCatalogId).ToList();
            if (MerchantCataloglist.Count > 0)
            {

                returnvalue = 1;
            }
            else
            {
                returnvalue = 0;
            }
            return returnvalue;
        }
        public async Task<string> CheckMerchantCatalogCategories(int MerchantId, string Categories)
        {
            string returntext = string.Empty;
            var GetMerchantCategories = (from s in this.Repository
                                         where s.MerchantID == MerchantId
                                         select new
                                         {
                                             s.CategoryID,
                                         }).Distinct().ToList();
            string[] strMerchantID = (Categories).ToString().Split(",");
            int Listcount = 0;
            for (int i = 0; i < strMerchantID.Length; i++)
            {
                foreach (var MerchantcatlogCategorieslist in GetMerchantCategories)
                {
                    if (MerchantcatlogCategorieslist.CategoryID == Convert.ToInt32(strMerchantID[i]))
                    {
                        Listcount++;
                    }
                }
            }
            if (Listcount == GetMerchantCategories.Count)
            {
                returntext = "Success";
            }
            else
            {
                returntext = "Fail";
            }
            return returntext;
        }
        public async Task InsertMerchantCatalog(InsetMerchantCatalogDto InsetMerchantCatalogDto)
        {


            foreach (var MerchantCatalog in InsetMerchantCatalogDto.MerchantCatalog)
            {
                int CategoryID = await _CategoryService.GetCategoryId(MerchantCatalog.CategoryName);
                if (CategoryID > 0)
                {
                    await Repository.InsertAsync(new MerchantCatalog
                    {
                        MerchantID = InsetMerchantCatalogDto.MerchantID,
                        CategoryID = CategoryID,
                        Subcategory = MerchantCatalog.Subcategory,
                        Brand = MerchantCatalog.Brand,
                        Product = MerchantCatalog.Product,

                    }
                    );
                }
            }
        }
        public async Task UpdateMerchantCatalog(UpdateMerchantCatalogDto UpdateMerchantCatalogDto)
        {
            var isvalid = Repository.SingleOrDefault(x => x.Id == UpdateMerchantCatalogDto.MerchantCatalogId);
            if (UpdateMerchantCatalogDto.CategoryID > 0)
            {
                isvalid.CategoryID = UpdateMerchantCatalogDto.CategoryID;
            }
            if (!string.IsNullOrEmpty(UpdateMerchantCatalogDto.Subcategory))
            {
                isvalid.Subcategory = UpdateMerchantCatalogDto.Subcategory;
            }
            if (!string.IsNullOrEmpty(UpdateMerchantCatalogDto.Brand))
            {
                isvalid.Brand = UpdateMerchantCatalogDto.Brand;
            }
            if (!string.IsNullOrEmpty(UpdateMerchantCatalogDto.Product))
            {
                isvalid.Product = UpdateMerchantCatalogDto.Product;
            }
            await Repository.UpdateAsync(isvalid);
        }

        public async Task deleteMerchantCatalog(int MerchantCatalogId)
        {
            var deleteMerchantCatalog = this.Repository.Where(m => m.Id == MerchantCatalogId);
            Repository.Delete(deleteMerchantCatalog);
        }
        public async Task deleteMerchantCatalogbyMerchantId(int MerchantId)
        {
            var deleteMerchantCatalogbyMerchantId = this.Repository.Where(m => m.MerchantID == MerchantId);
            Repository.Delete(deleteMerchantCatalogbyMerchantId);
        }
        public async Task<List<SearchDto>> getsearch(string searchvalue)
        {
            //return Repository.OrderBy(x => x.Priority).ToList();

            var getSearchresult = (from s in this.Repository
                                   where s.Merchant.MerchantRequest.LookupTypeValues.Description == "Approved"
                                   where (s.Category.Name.Contains(searchvalue) && s.Category.IsActive == 1) || s.Merchant.Name.Contains(searchvalue) || s.Subcategory.Contains(searchvalue) || s.Brand.Contains(searchvalue) || s.Product.Contains(searchvalue)
                                   where s.Merchant.Users.Status == 1
                                   select new
                                   {
                                       s.Merchant,
                                       s.MerchantID,
                                       s.Merchant.MerchantRedirection,
                                   }).Distinct().ToList();
            List<SearchDto> Searchlist = new List<SearchDto>();
            if (getSearchresult.Count > 0)
            {
                foreach (var Searchresult in getSearchresult)
                {
                    SearchDto SearchDto = new SearchDto();

                    SearchDto.Id = Searchresult.Merchant.Id;
                    SearchDto.Name = Searchresult.Merchant.Name;
                    SearchDto.ProfileImage = Searchresult.Merchant.ProfileImage;
                    SearchDto.CompanyImage = Searchresult.Merchant.CompanyImage;
                    //SearchDto.Website = Searchresult.Merchant.Website;

                    string Merchantatt = "";
                    if (Searchresult.MerchantRedirection.Count > 0)
                    {
                        foreach (var MerchantRedirection in Searchresult.MerchantRedirection)
                        {
                            Merchantatt += "&" + MerchantRedirection.Attribute + "=" + MerchantRedirection.Value;

                        }
                    }
                    if (Merchantatt != "" && Searchresult.Merchant.MerchantRedirectionUrl != "")
                    {
                        SearchDto.Website = Searchresult.Merchant.MerchantRedirectionUrl + "?MerchantID=" + Searchresult.Merchant.Id + Merchantatt;

                    }
                    Searchlist.Add(SearchDto);
                }


            }

            return Searchlist.OrderBy(x => x.Name).ToList();
        }

    }


}


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
    public class MerchantCategoryService : EntityService<MerchantCategory, MerchantCategoryRepository>
    {
        private readonly MerchantCatalogService _MerchantCatalogService;
        private readonly LookupTypeValuesService _LookupTypeValuesService;
        public MerchantCategoryService(MerchantCategoryRepository repository, MerchantCatalogService MerchantCatalogService, LookupTypeValuesService LookupTypeValuesService,
          IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {
            _MerchantCatalogService = MerchantCatalogService;
            _LookupTypeValuesService = LookupTypeValuesService;
        }

        public async Task<List<MerchantCategoryDto>> GetAll(MerchantByCategory MerchantByCategory)
        {
            int countryID = await _LookupTypeValuesService.GetCountryID(MerchantByCategory.Ipcountry);
            //return this.Repository.Where(m => m.CategoryID == CategoryID).ToList();


            var getMerchantCategory = (from s in this.Repository.Where(m => m.CategoryID == MerchantByCategory.CategoryID)
                                       where s.Merchant.Users.Status == 1
                                       where s.Merchant.MerchantRequest.LookupTypeValues.Description == "Approved"
                                       select new
                                       {
                                           s.Merchant,
                                           s.MerchantID,
                                           s.Merchant.Country,
                                           s.Merchant.MerchantRedirection,
                                       }).ToList();

            List<MerchantCategoryDto> MerchantCategorylist = new List<MerchantCategoryDto>();
            foreach (var MerchantCategory in getMerchantCategory)
            {
                if (MerchantCategory.Merchant.MerchantSellCountries != null)
                {
                    foreach (var MerchantSellCategory in MerchantCategory.Merchant.MerchantSellCountries)
                    {
                        if (MerchantSellCategory.Country == countryID)
                        {
                            MerchantCategoryDto MerchantCategoryDto = new MerchantCategoryDto();

                            MerchantCategoryDto.MerchantID = MerchantCategory.MerchantID;
                            MerchantCategoryDto.MerchantName = MerchantCategory.Merchant.Name;
                            MerchantCategoryDto.MerchantCountry = MerchantCategory.Country;
                            //MerchantCategoryDto.MerchantUrl = MerchantCategory.Merchant.Website;
                            MerchantCategoryDto.MerchantWebImage = MerchantCategory.Merchant.CompanyImage;
                            MerchantCategoryDto.MerchantProfileImage = MerchantCategory.Merchant.ProfileImage;
                            string Merchantatt = "";
                            if (MerchantCategory.MerchantRedirection.Count > 0)
                            {
                                foreach (var MerchantRedirection in MerchantCategory.MerchantRedirection)
                                {
                                    Merchantatt += "&" + MerchantRedirection.Attribute + "=" + MerchantRedirection.Value;

                                }
                            }
                            if (Merchantatt != "" && MerchantCategory.Merchant.MerchantRedirectionUrl != "")
                            {
                                MerchantCategoryDto.MerchantUrl = MerchantCategory.Merchant.MerchantRedirectionUrl + "?MerchantID=" + MerchantCategory.MerchantID + Merchantatt;

                            }
                            if (Merchantatt == "" && MerchantCategory.Merchant.MerchantRedirectionUrl != "")
                            {
                                MerchantCategoryDto.MerchantUrl = MerchantCategory.Merchant.MerchantRedirectionUrl;
                            }
                            MerchantCategorylist.Add(MerchantCategoryDto);
                        }
                    }
                }
            }

            return MerchantCategorylist;

        }
        public async Task InsertMerchantCategory(int MerchantID, string strCategoryID)
        {

            string[] strMerchantID = (strCategoryID).ToString().Split(",");
            for (int i = 0; i < strMerchantID.Length; i++)
            {
                await Repository.InsertAsync(new MerchantCategory
                {
                    CategoryID = Convert.ToInt32(strMerchantID[i]),
                    MerchantID = MerchantID
                }
                );
            }
        }
        public async Task<string> deleteMerchantCategories(int MerchantId, string Categories)
        {
            string returntext = string.Empty;
            string returnoutput = await _MerchantCatalogService.CheckMerchantCatalogCategories(MerchantId, Categories);
            if (returnoutput == "Success")
            {
                var deleteMerchantCategories = this.Repository.Where(m => m.MerchantID == MerchantId);
                Repository.Delete(deleteMerchantCategories);
                returntext = "Success";
            }
            else
            {
                returntext = "Fail";
            }
            return returntext;

        }
        public async Task<int> CheckCategoryDetails(string CategoryName , int MerchantID)
        {
            int Categorycount = Repository.Where(x => x.Category.Name == CategoryName.Trim() && x.MerchantID == MerchantID && x.Category.IsActive == 1 && x.Merchant.MerchantRequest.LookupTypeValues.Description == "Approved").Count();
            if (Categorycount > 0)
                return 1;
            return 0;

        }
        public async Task<List<GetMerchantCategoryCataloglist>> getMerchantCategory()
        {
            var getApprovedMerchant = (from s in this.Repository
                                       where s.Merchant.MerchantRequest.LookupTypeValues.Description == "Approved"
                                       where s.Merchant.Users.Status == 1
                                       select new
                                       {
                                           s.MerchantID,
                                           s.Merchant.Name,
                                       }).Distinct().OrderBy(x=>x.Name).ToList();
            List<GetMerchantCategoryCataloglist> GetMerchantCategoryCataloglist = new List<GetMerchantCategoryCataloglist>();
            foreach (var ApprovedMerchant in getApprovedMerchant)
            {
                GetMerchantCategoryCataloglist GetMerchantCataloglist = new GetMerchantCategoryCataloglist();
                GetMerchantCataloglist.MerchantID = ApprovedMerchant.MerchantID;
                GetMerchantCataloglist.MerchantName = ApprovedMerchant.Name;

                var getMerchantCategory = (from s in this.Repository
                                           select new
                                           {
                                               s.MerchantID,
                                               s.Category.Id,
                                               s.Category.Name,
                                               s.Category.IsActive,
                                           }).Where(s => s.MerchantID == ApprovedMerchant.MerchantID).Where(s => s.IsActive == 1).ToList();
                GetMerchantCataloglist.MerchantCategory = new List<MerchantCategoryCatalogDto>();
                foreach (var MerchantCategory in getMerchantCategory)
                {
                    MerchantCategoryCatalogDto GetMerchantCategoryCatalogDto = new MerchantCategoryCatalogDto();

                    GetMerchantCategoryCatalogDto.CategoryId = MerchantCategory.Id;
                    GetMerchantCategoryCatalogDto.CategoryName = MerchantCategory.Name;
                    GetMerchantCataloglist.MerchantCategory.Add(GetMerchantCategoryCatalogDto);
                }
                GetMerchantCategoryCataloglist.Add(GetMerchantCataloglist);
            }

            return GetMerchantCategoryCataloglist;

        }

    }
}

using Dunyana.API.Filters;
using Dunyana.Dto;
using Dunyana.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace Dunyana.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class SearchController : ControllerBase
    {

        private readonly MerchantCatalogService _MerchantCatalogService;
        private readonly IConfiguration _configuration;
        private readonly MerchantRedirectionService _MerchantRedirectionService;
        string strMerchantImages = string.Empty;
        public SearchController(MerchantCatalogService MerchantCatalogService, IConfiguration configuration, MerchantRedirectionService MerchantRedirectionService)
        {
            _MerchantCatalogService = MerchantCatalogService;
            _configuration = configuration;
            _MerchantRedirectionService = MerchantRedirectionService;
        }

        [HttpGet, Route("search/{SearchValue}")]
        [TransactionFilter]
        public async Task<IActionResult> getsearch(string SearchValue)
        {
            try
            {
                strMerchantImages = _configuration["FilePath:ImagePath"] + "MerchantImages/";
                string strServerURL = _configuration["FilePath:ServerURL"] + "MerchantImages/";
                var _getsearchMerchants = await _MerchantCatalogService.getsearch(SearchValue);
                foreach (var searchMerchantslist in _getsearchMerchants)
                {
                    if ((System.IO.File.Exists(strMerchantImages + searchMerchantslist.ProfileImage + "")))
                    {
                        if (searchMerchantslist.ProfileImage != null)
                        {

                            searchMerchantslist.ProfileImage = strServerURL + searchMerchantslist.ProfileImage;
                        }
                        else
                        {
                            searchMerchantslist.ProfileImage = strServerURL + "Dummy.jpg";
                        }

                    }
                    else
                    {
                        searchMerchantslist.ProfileImage = strServerURL + "Dummy.jpg";
                    }
                    if ((System.IO.File.Exists(strMerchantImages + searchMerchantslist.CompanyImage)))
                    {
                        if (searchMerchantslist.CompanyImage != null)
                        {

                            searchMerchantslist.CompanyImage = strServerURL + searchMerchantslist.CompanyImage;
                        }
                        else
                        {

                            searchMerchantslist.CompanyImage = strServerURL + "CategoryImagesDummy.jpg"; 
                        }

                    }
                    else
                    {
                        searchMerchantslist.CompanyImage = strServerURL + "CategoryImagesDummy.jpg";
                    }
                    //if (!string.IsNullOrEmpty(searchMerchantslist.Website))
                    //{
                    //    var _getMerchantRedirectionlist = await _MerchantRedirectionService.getMerchantRedirectionlist(searchMerchantslist.Id);
                    //    string Merchantatt = "";
                    //    if (!string.IsNullOrEmpty(_getMerchantRedirectionlist.MerchantRedirectionUrl))
                    //    {
                    //        foreach (var MerchantRedirection in _getMerchantRedirectionlist.MerchantRedirectionlist)
                    //        {
                    //            Merchantatt += "&" + MerchantRedirection.MerchantAttribute + "=" + MerchantRedirection.MerchantValue;

                    //        }
                    //    }
                    //    if (Merchantatt != "")
                    //    {
                    //        searchMerchantslist.Website = searchMerchantslist.Website + "?MerchantID=" + searchMerchantslist.Id + Merchantatt;

                    //    }
                    //}
                }

                return Ok(_getsearchMerchants);
            }
            catch (Exception err)
            {

                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }


        }
    }
}
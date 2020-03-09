using Dunyana.API.Filters;
using Dunyana.API.Middleware;
using Dunyana.Dto;
using Dunyana.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NaqelService;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Dunyana.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class MerchantCatalogController : Controller
    {
        private readonly MerchantCatalogService _MerchantCatalogService;
        private readonly CategoryService _CategoryService;
        private readonly MerchantCategoryService _MerchantCategoryService;
        public MerchantCatalogController(MerchantCatalogService MerchantCatalogService, CategoryService CategoryService, MerchantCategoryService MerchantCategoryService)
        {
            _MerchantCatalogService = MerchantCatalogService;
            _CategoryService = CategoryService;
            _MerchantCategoryService = MerchantCategoryService;
        }
        [HttpGet, Route("getMerchantCataloglist"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> getMerchantCataloglist()
        {
            try
            {
                var _getMerchantCataloglist = await _MerchantCategoryService.getMerchantCategory();
                if (_getMerchantCataloglist.Count > 0)
                {

                    return Ok(_getMerchantCataloglist);
                }

                return Ok(_getMerchantCataloglist);

            }
            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        // GET: api/<controller>
        [HttpGet, Route("getMerchantCatalog/{Merchantid}"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> getMerchantCatalog(int Merchantid)
        {
            try
            {
                var _getMerchantCataloglist = await _MerchantCatalogService.GetMerchantCatalogbyMerchantId(Merchantid);
                if (_getMerchantCataloglist.Count > 0)
                {

                    return Ok(_getMerchantCataloglist);
                }

                return Ok(_getMerchantCataloglist);

            }
            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        [HttpPost, Route("insertMerchantCatalog"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> insertMerchantCatalog([FromBody] InsetMerchantCatalogDto InsetMerchantCatalogDto)
        {
            try
            {
                int emptyCount = 0;
                foreach (var getMerchantCatalog in InsetMerchantCatalogDto.MerchantCatalog)
                {
                    if (string.IsNullOrEmpty(getMerchantCatalog.CategoryName) || string.IsNullOrEmpty(getMerchantCatalog.Subcategory) || string.IsNullOrEmpty(getMerchantCatalog.Product) || string.IsNullOrEmpty(getMerchantCatalog.Brand ))
                    {
                        emptyCount = 1;
                        break;
                    }
                }
                if (emptyCount == 0)
                {
                    int Checkcount = 0;
                    string InvalidCategorylist = "";
                    var distinctList = from c in InsetMerchantCatalogDto.MerchantCatalog
                                       group c by new
                                       {
                                           c.CategoryName,
                                           c.Subcategory,
                                           c.Brand,
                                           c.Product,
                                       } into grp
                                       select grp.First();
                    int distictcount = distinctList.Count();
                    if (InsetMerchantCatalogDto.Type == "A")
                    {
                        foreach (var getMerchantCatalog in InsetMerchantCatalogDto.MerchantCatalog)
                        {
                            int checkCategory = await _MerchantCategoryService.CheckCategoryDetails(getMerchantCatalog.CategoryName, InsetMerchantCatalogDto.MerchantID);
                            if (checkCategory == 1)
                            {
                                int checkvalue = await _MerchantCatalogService.CheckMerchantCatalog(InsetMerchantCatalogDto.MerchantID, getMerchantCatalog.CategoryName, getMerchantCatalog.Subcategory, getMerchantCatalog.Brand, getMerchantCatalog.Product);
                                if (checkvalue == 0)
                                {
                                    Checkcount++;
                                }
                            }
                            else
                            {
                                InvalidCategorylist = InvalidCategorylist + ',' + getMerchantCatalog.CategoryName;
                            }
                        }
                        if (InsetMerchantCatalogDto.MerchantCatalog.Count == Checkcount && InsetMerchantCatalogDto.MerchantCatalog.Count == distinctList.Count())
                        {
                            await _MerchantCatalogService.InsertMerchantCatalog(InsetMerchantCatalogDto);
                            return Ok(new GenericResultDto<string> { Result = "Merchant Catalog created successfully" });
                        }
                        else
                        {
                            if (InsetMerchantCatalogDto.MerchantCatalog.Count != distinctList.Count())
                            {
                                return BadRequest(new GenericResultDto<string> { Result = "Cannot have a duplicate row with the same Category, Subcategory, Brand, Product for a Merchant" });
                            }
                            if (InvalidCategorylist != "")
                            {
                                return BadRequest(new GenericResultDto<string> { Result = "Invalid categories " + InvalidCategorylist.TrimStart(',') + ",Please upload with valid categories" });
                            }
                        }
                    }
                    else if (InsetMerchantCatalogDto.Type == "D")
                    {
                        foreach (var getMerchantCatalog in InsetMerchantCatalogDto.MerchantCatalog)
                        {
                            int checkvalue = await _MerchantCatalogService.CheckMerchantCatalog(InsetMerchantCatalogDto.MerchantID, getMerchantCatalog.CategoryName, getMerchantCatalog.Subcategory, getMerchantCatalog.Brand, getMerchantCatalog.Product);
                            if (checkvalue == 0)
                            {
                                await _MerchantCatalogService.InsertMerchantCatalog(InsetMerchantCatalogDto);
                                return Ok(new GenericResultDto<string> { Result = "Merchant Catalog created successfully" });
                            }
                        }
                    }
                    else if (InsetMerchantCatalogDto.Type == "O")
                    {
                        foreach (var getMerchantCatalog in InsetMerchantCatalogDto.MerchantCatalog)
                        {
                            int checkCategory = await _MerchantCategoryService.CheckCategoryDetails(getMerchantCatalog.CategoryName, InsetMerchantCatalogDto.MerchantID);
                            if (checkCategory == 0)
                            {
                                InvalidCategorylist = InvalidCategorylist + ',' + getMerchantCatalog.CategoryName;
                            }
                        }
                        if (InvalidCategorylist == "" && InsetMerchantCatalogDto.MerchantCatalog.Count == distinctList.Count())
                        {
                            await _MerchantCatalogService.deleteMerchantCatalogbyMerchantId(InsetMerchantCatalogDto.MerchantID);
                            await _MerchantCatalogService.InsertMerchantCatalog(InsetMerchantCatalogDto);
                            return Ok(new GenericResultDto<string> { Result = "Merchant Catalog created successfully" });
                        }
                        else
                        {
                            if (InsetMerchantCatalogDto.MerchantCatalog.Count != distinctList.Count())
                            {
                                return BadRequest(new GenericResultDto<string> { Result = "Cannot have a duplicate row with the same Category, Subcategory, Brand, Product for a Merchant" });
                            }
                            if (InvalidCategorylist != "")
                            {
                                return BadRequest(new GenericResultDto<string> { Result = "Invalid categories " + InvalidCategorylist.TrimStart(',') + ",Please upload with valid categories" });
                            }
                        }

                    }

                    return BadRequest(new GenericResultDto<string> { Result = "Cannot have a duplicate row with the same Category, Subcategory, Brand, Product for a Merchant" });
                }
                else
                {
                    return BadRequest(new GenericResultDto<string> { Result = "The file contains empty column values." });

                }

            }
               
            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        [HttpPost, Route("updateMerchantCatalog"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> updateMerchantCatalog([FromBody] UpdateMerchantCatalogDto UpdateMerchantCatalogDto)
        {
            try
            {
                int checkvalue = await _MerchantCatalogService.CheckMerchantCatalogForupdate(UpdateMerchantCatalogDto.MerchantCatalogId, UpdateMerchantCatalogDto.MerchantID, UpdateMerchantCatalogDto.CategoryID, UpdateMerchantCatalogDto.Subcategory, UpdateMerchantCatalogDto.Brand, UpdateMerchantCatalogDto.Product);
                if (checkvalue == 0)
                {
                    await _MerchantCatalogService.UpdateMerchantCatalog(UpdateMerchantCatalogDto);
                    return Ok(new GenericResultDto<string> { Result = "Merchant Catalog updated successfully" });
                }

                return BadRequest(new GenericResultDto<string> { Result = "Cannot have a duplicate row with the same Category, Subcategory, Brand, Product for a Merchant" });
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        [HttpPost, Route("deleteMerchantCatalog"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> deleteMerchantCatalog([FromBody] DeleteMerchantCatalogDto DeleteMerchantCatalogDto)
        {
            try
            {

                await _MerchantCatalogService.deleteMerchantCatalog(DeleteMerchantCatalogDto.MerchantCatalogId);
                return Ok(new GenericResultDto<string> { Result = "Merchant Catalog deleted successfully" });

            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
    }
}
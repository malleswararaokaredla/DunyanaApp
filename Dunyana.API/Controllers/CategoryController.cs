using Dunyana.API.Filters;
using Dunyana.Dto;
using Dunyana.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
namespace Dunyana.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _CategoryService;
        private readonly IConfiguration _configuration;
        string strImagePath = string.Empty;
        Guid categoryImages = Guid.NewGuid();
        public CategoryController(CategoryService CategoryService, IConfiguration configuration)
        {
            _CategoryService = CategoryService;
            _configuration = configuration;
        }
        [HttpPost, Route("GetCategories")]
        public async Task<IActionResult> Get(GetCategoryDto GetCategoryDto)
        {
            try
            {
                var _getAllCategories = await _CategoryService.GetAll(GetCategoryDto);
                strImagePath = _configuration["FilePath:ImagePath"] + "CategoryImages/";
                string strServerURL = _configuration["FilePath:ServerURL"] + "CategoryImages/";
                foreach (var returnlist in _getAllCategories)
                {
                    if (System.IO.File.Exists(strImagePath + returnlist.Image))
                    {

                        returnlist.Image = strServerURL + returnlist.Image;
                    }
                    else
                    {
                        returnlist.Image = strServerURL + "CategoryImagesDummy.jpg";
                    }

                }

                return Ok(_getAllCategories);
            }
            catch (Exception err)
            {

                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }


        }
        [HttpPost, Route("InsertCategories"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> InsertCategoryDetails([FromBody] List<JObject> jsonResult)
        {
            string ResultMeassage = string.Empty;
            try
            {
                strImagePath = _configuration["FilePath:ImagePath"] + "CategoryImages/";

                foreach (var json in jsonResult)
                {

                    CategoryDto Categorydata = JsonConvert.DeserializeObject<CategoryDto>(json.ToString());
                    if (Categorydata.Image != "")
                    {
                        if (!Directory.Exists(strImagePath))
                            Directory.CreateDirectory(strImagePath);
                        Byte[] imageByteData = Convert.FromBase64String(Categorydata.Image);
                        var fs = new BinaryWriter(new FileStream(strImagePath + categoryImages + ".jpg", FileMode.Append, FileAccess.Write));
                        fs.Write(imageByteData);
                        fs.Close();
                        Categorydata.Image = categoryImages + ".jpg";
                    }
                    else
                    {
                        Categorydata.Image = "";
                    }


                    ResultMeassage = await _CategoryService.InsertCategoryDetails(Categorydata);
                }


            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
            return Ok(new GenericResultDto<string> { Result = ResultMeassage });
        }
        [HttpPost, Route("UpdateCategories"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> UpdateCategorys([FromBody] List<JObject> jsonResult)
        {
            string ResultMeassage = string.Empty;
            try
            {
                strImagePath = _configuration["FilePath:ImagePath"] + "CategoryImages/";
                foreach (var json in jsonResult)
                {
                    CategoryDto Categorydata = null;
                    Categorydata = JsonConvert.DeserializeObject<CategoryDto>(json.ToString());
                    if (Categorydata.Image != "")
                    {
                        if (Categorydata.Image.Substring(Categorydata.Image.Length - 3) != "jpg")
                        {
                            if (!Directory.Exists(strImagePath))
                                Directory.CreateDirectory(strImagePath);
                            Byte[] imageByteData = Convert.FromBase64String(Categorydata.Image);
                            var fs = new BinaryWriter(new FileStream(strImagePath + categoryImages + ".jpg", FileMode.Create, FileAccess.Write));
                            fs.Write(imageByteData);
                            fs.Close();
                            Categorydata.Image = categoryImages + ".jpg";
                        }
                        else
                        {
                            Categorydata.Image = "";
                        }
                    }
                    else
                    {
                        Categorydata.Image = "";
                    }
                    ResultMeassage = await _CategoryService.UpdateCategorys(Categorydata);
                }

            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
            return Ok(new GenericResultDto<string> { Result = ResultMeassage });
        }
        [HttpPost, Route("deleteCategory"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> deleteCategory([FromBody] DeleteCategoryDto CategoryId)
        {
            string Resultmessage = string.Empty;
            try
            {
                Resultmessage = await _CategoryService.deleteCategory(CategoryId.CategoryId);
                if (Resultmessage == "")
                {
                    return BadRequest(new GenericResultDto<string> { Result = "Category exists with merchants." });
                }
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string>
                {
                    Result = err.Message
                });
            }
            return Ok(new GenericResultDto<string> { Result = Resultmessage });

        }


    }
}
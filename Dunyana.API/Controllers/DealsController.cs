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
    public class DealsController : ControllerBase
    {
        private readonly DealsService _DealsService;
        private readonly IConfiguration _configuration;
        private readonly MerchantDealService _MerchantDealService;
        private readonly MerchantService _MerchantService;
        string strImagePath = string.Empty;
        Guid DealEnglishImages = Guid.NewGuid();
        Guid DealArabicImages = Guid.NewGuid();
        public DealsController(DealsService DealsService, IConfiguration configuration, MerchantDealService MerchantDealService, MerchantService MerchantService)
        {
            _DealsService = DealsService;
            _configuration = configuration;
            _MerchantDealService = MerchantDealService;
            _MerchantService = MerchantService;
        }
        [HttpGet, Route("getDeals/{Ipcountry}/{CountryTimezone}")]
        [TransactionFilter]
        public async Task<IActionResult> GetDeals(string Ipcountry, string CountryTimezone)
        {
            try
            {
                var _getAllDeals = await _DealsService.GetAllDeal(Ipcountry, CountryTimezone);

                foreach (var returnlist in _getAllDeals)
                {
                    strImagePath = _configuration["FilePath:ImagePath"] + "DealsImages/";
                    string strServerURL = _configuration["FilePath:ServerURL"] + "DealsImages/";
                    if (System.IO.File.Exists(strImagePath + returnlist.EnglishImage))
                    {

                        returnlist.EnglishImage = strServerURL + returnlist.EnglishImage;
                    }
                    else
                    {
                        returnlist.EnglishImage = "";

                    }
                    if (System.IO.File.Exists(strImagePath + returnlist.ArabicImage))
                    {

                        returnlist.ArabicImage = strServerURL + returnlist.ArabicImage;
                    }
                    else
                    {
                        returnlist.ArabicImage = "";

                    }
                }
                return Ok(_getAllDeals);
            }
            catch (Exception err)
            {

                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        [HttpPost, Route("getDealsByMerchant")]
        [TransactionFilter]
        public async Task<IActionResult> GetDealsByMerchant([FromBody] MerchantDealDto MerchantDealDto)
        {
            try
            {
                var _getAllDeals = await _DealsService.GetDealByMerchant(MerchantDealDto);

                foreach (var returnlist in _getAllDeals)
                {
                    strImagePath = _configuration["FilePath:ImagePath"] + "DealsImages/";
                    string strServerURL = _configuration["FilePath:ServerURL"] + "DealsImages/";
                    if (System.IO.File.Exists(strImagePath + returnlist.EnglishImage))
                    {

                        returnlist.EnglishImage = strServerURL + returnlist.EnglishImage;
                    }
                    else
                    {
                        returnlist.EnglishImage = "";

                    }
                    if (System.IO.File.Exists(strImagePath + returnlist.ArabicImage))
                    {

                        returnlist.ArabicImage = strServerURL + returnlist.ArabicImage;
                    }
                    else
                    {
                        returnlist.ArabicImage = "";

                    }
                }
                return Ok(_getAllDeals);
            }
            catch (Exception err)
            {

                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        [HttpPost, Route("insertDeals"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> InsertDealDetails([FromBody] DealDto DealDto)
        {
            string Dealstatus = "";
            try
            {

                strImagePath = _configuration["FilePath:ImagePath"] + "DealsImages/";
                if (!Directory.Exists(strImagePath))
                    Directory.CreateDirectory(strImagePath);
                if (DealDto.EnglishImage != "")
                {

                    Byte[] EnglishimageByteData = Convert.FromBase64String(DealDto.EnglishImage);
                    var Englishfs = new BinaryWriter(new FileStream(strImagePath + DealEnglishImages + ".jpg", FileMode.Append, FileAccess.Write));
                    Englishfs.Write(EnglishimageByteData);
                    Englishfs.Close();
                    DealDto.EnglishImage = DealEnglishImages + ".jpg";
                }
                else
                {
                    DealDto.EnglishImage = "";
                }
                if (DealDto.ArabicImage != "")
                {

                    Byte[] ArabicimageByteData = Convert.FromBase64String(DealDto.ArabicImage);
                    var Arabicfs = new BinaryWriter(new FileStream(strImagePath + DealArabicImages + ".jpg", FileMode.Append, FileAccess.Write));
                    Arabicfs.Write(ArabicimageByteData);
                    Arabicfs.Close();
                    DealDto.ArabicImage = DealArabicImages + ".jpg";
                }
                else
                {
                    DealDto.ArabicImage = "";
                }
                MerchantDto MerchantDto = new MerchantDto();
                MerchantDto.Email = DealDto.MerchantEmail;
                var getMerchantID = await _MerchantService.GetMerchantDetails(MerchantDto);
                Dealstatus = await _DealsService.InsertDealDetails(DealDto, getMerchantID.Id);
                int Dealid = await _DealsService.GetDealid(getMerchantID.Id, DealDto.Countries, DealDto.ArabicImage, DealDto.EnglishImage);
                if (Dealid > 0 && Dealstatus == "Deal created successfully")
                {
                    await _MerchantDealService.InsertMerchantDealDetails(getMerchantID.Id, DealDto.Countries, Dealid);
                    return Ok(new GenericResultDto<string> { Result = Dealstatus });
                }
                return BadRequest(new GenericResultDto<string> { Result = Dealstatus });
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        [HttpPost, Route("updateDeals"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> UpdateDeals([FromBody] UpdateDealDto UpdateDealDto)
        {
            string Dealupdatestatus = string.Empty;
            try
            {
                strImagePath = _configuration["FilePath:ImagePath"] + "DealsImages/";

                if (!Directory.Exists(strImagePath))
                    Directory.CreateDirectory(strImagePath);

                if (!String.IsNullOrEmpty(UpdateDealDto.EnglishImage))
                {
                    if (UpdateDealDto.EnglishImage.Substring(UpdateDealDto.EnglishImage.Length - 3) != "jpg")
                    {
                        if (!String.IsNullOrEmpty(UpdateDealDto.EnglishImage))
                        {
                            Byte[] EnglishimageByteData = Convert.FromBase64String(UpdateDealDto.EnglishImage);
                            var Englishfs = new BinaryWriter(new FileStream(strImagePath + DealEnglishImages + ".jpg", FileMode.Create, FileAccess.Write));
                            Englishfs.Write(EnglishimageByteData);
                            Englishfs.Close();
                            UpdateDealDto.EnglishImage = DealEnglishImages + ".jpg";
                        }
                    }
                    else
                    {
                        UpdateDealDto.EnglishImage = "";
                    }
                }
                else
                {
                    UpdateDealDto.EnglishImage = "";
                }
                if (!String.IsNullOrEmpty(UpdateDealDto.ArabicImage))
                {
                    if (UpdateDealDto.ArabicImage.Substring(UpdateDealDto.ArabicImage.Length - 3) != "jpg")
                    {
                        if (!String.IsNullOrEmpty(UpdateDealDto.ArabicImage))
                        {
                            Byte[] ArabicimageByteData = Convert.FromBase64String(UpdateDealDto.ArabicImage);
                            var Arabicfs = new BinaryWriter(new FileStream(strImagePath + DealArabicImages + ".jpg", FileMode.Create, FileAccess.Write));
                            Arabicfs.Write(ArabicimageByteData);
                            Arabicfs.Close();
                            UpdateDealDto.ArabicImage = DealArabicImages + ".jpg";
                        }
                    }
                    else
                    {
                        UpdateDealDto.ArabicImage = "";
                    }
                }
                else
                {
                    UpdateDealDto.ArabicImage = "";
                }
                Dealupdatestatus = await _DealsService.UpdateDeals(UpdateDealDto);
                if (Dealupdatestatus == "Deal updated successfully")
                {
                    return Ok(new GenericResultDto<string> { Result = Dealupdatestatus });
                }
                return BadRequest(new GenericResultDto<string> { Result = Dealupdatestatus });
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }

        }

        [HttpPost, Route("deleteDeals"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> deleteDeals([FromBody] DeleteDealDto DeleteDealDto)
        {
            string Dealdeletestatus = string.Empty;
            try
            {
                Dealdeletestatus = await _DealsService.DeleteDeal(DeleteDealDto);
                if (Dealdeletestatus == "Deal deleted successfully")
                {
                    return Ok(new GenericResultDto<string> { Result = Dealdeletestatus });
                }
                return BadRequest(new GenericResultDto<string> { Result = Dealdeletestatus });
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }

    }

}
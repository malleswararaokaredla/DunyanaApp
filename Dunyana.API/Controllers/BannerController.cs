using Dunyana.API.Filters;
using Dunyana.Dto;
using Dunyana.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;
namespace Dunyana.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class BannerController : ControllerBase
    {
        private readonly BannerService _BannerService;
        private readonly IConfiguration _configuration;
        private readonly MerchantBannerService _MerchantBannerService;
        private readonly MerchantService _MerchantService;
        string strImagePath = string.Empty;
        Guid bannerEnglishImages = Guid.NewGuid();
        Guid bannerArabicImages = Guid.NewGuid();
        public BannerController(BannerService BannerService, IConfiguration configuration, MerchantBannerService MerchantBannerService, MerchantService MerchantService)
        {
            _BannerService = BannerService;
            _configuration = configuration;
            _MerchantBannerService = MerchantBannerService;
            _MerchantService = MerchantService;
        }
        [HttpGet, Route("GetBanners/{Ipcountry}/{CountryTimezone}")]
        [TransactionFilter]
        public async Task<IActionResult> GetBanners(string Ipcountry, string CountryTimezone)
        {
            try
            {
                var _getAllBanners = await _BannerService.GetAllBanner(Ipcountry, CountryTimezone);

                foreach (var returnlist in _getAllBanners)
                {
                    strImagePath = _configuration["FilePath:ImagePath"] + "BannerImages/";
                    string strServerURL = _configuration["FilePath:ServerURL"] + "BannerImages/";
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
                return Ok(_getAllBanners);
            }
            catch (Exception err)
            {

                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        [HttpPost, Route("GetBannersByMerchant")]
        [TransactionFilter]
        public async Task<IActionResult> GetBannersByMerchant([FromBody] MerchantBannerDto MerchantBannerDto)
        {
            try
            {
                var _getAllBanners = await _BannerService.GetBannerByMerchant(MerchantBannerDto);

                foreach (var returnlist in _getAllBanners)
                {
                    strImagePath = _configuration["FilePath:ImagePath"] + "BannerImages/";
                    string strServerURL = _configuration["FilePath:ServerURL"] + "BannerImages/";
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
                return Ok(_getAllBanners);
            }
            catch (Exception err)
            {

                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        [HttpPost, Route("InsertBanners"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> InsertBannerDetails([FromBody] BannerDto BannerDto)
        {
            string Bannerstatus = "";
            try
            {

                strImagePath = _configuration["FilePath:ImagePath"] + "BannerImages/";
                if (!Directory.Exists(strImagePath))
                    Directory.CreateDirectory(strImagePath);
                if (BannerDto.EnglishImage != "")
                {

                    Byte[] EnglishimageByteData = Convert.FromBase64String(BannerDto.EnglishImage);
                    var Englishfs = new BinaryWriter(new FileStream(strImagePath + bannerEnglishImages + ".jpg", FileMode.Append, FileAccess.Write));
                    Englishfs.Write(EnglishimageByteData);
                    Englishfs.Close();
                    BannerDto.EnglishImage = bannerEnglishImages + ".jpg";
                }
                else
                {
                    BannerDto.EnglishImage = "";
                }
                if (BannerDto.ArabicImage != "")
                {

                    Byte[] ArabicimageByteData = Convert.FromBase64String(BannerDto.ArabicImage);
                    var Arabicfs = new BinaryWriter(new FileStream(strImagePath + bannerArabicImages + ".jpg", FileMode.Append, FileAccess.Write));
                    Arabicfs.Write(ArabicimageByteData);
                    Arabicfs.Close();
                    BannerDto.ArabicImage = bannerArabicImages + ".jpg";
                }
                else
                {
                    BannerDto.ArabicImage = "";
                }
                MerchantDto MerchantDto = new MerchantDto();
                MerchantDto.Email = BannerDto.MerchantEmail;
                var getMerchantID = await _MerchantService.GetMerchantDetails(MerchantDto);
                Bannerstatus = await _BannerService.InsertBannerDetails(BannerDto, getMerchantID.Id);
                int Bannerid = await _BannerService.GetBannerid(getMerchantID.Id, BannerDto.Countries, BannerDto.ArabicImage, BannerDto.EnglishImage);
                if (Bannerid > 0 && Bannerstatus == "Banner created successfully")
                {
                    await _MerchantBannerService.InsertMerchantBannerDetails(getMerchantID.Id, BannerDto.Countries, Bannerid);
                    return Ok(new GenericResultDto<string> { Result = Bannerstatus });
                }
                return BadRequest(new GenericResultDto<string> { Result = Bannerstatus });
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        [HttpPost, Route("UpdateBanners"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> UpdateBanners([FromBody] UpdateBannerDto UpdateBannerDto)
        {
            string Bannerupdatestatus = string.Empty;
            try
            {
                strImagePath = _configuration["FilePath:ImagePath"] + "BannerImages/";

                if (!Directory.Exists(strImagePath))
                    Directory.CreateDirectory(strImagePath);

                if (!String.IsNullOrEmpty(UpdateBannerDto.EnglishImage))
                {
                    if (UpdateBannerDto.EnglishImage.Substring(UpdateBannerDto.EnglishImage.Length - 3) != "jpg")
                    {
                        if (!String.IsNullOrEmpty(UpdateBannerDto.EnglishImage))
                        {
                            Byte[] EnglishimageByteData = Convert.FromBase64String(UpdateBannerDto.EnglishImage);
                            var Englishfs = new BinaryWriter(new FileStream(strImagePath + bannerEnglishImages + ".jpg", FileMode.Create, FileAccess.Write));
                            Englishfs.Write(EnglishimageByteData);
                            Englishfs.Close();
                            UpdateBannerDto.EnglishImage = bannerEnglishImages + ".jpg";
                        }
                    }
                    else
                    {
                        UpdateBannerDto.EnglishImage = "";
                    }
                }
                else
                {
                    UpdateBannerDto.EnglishImage = "";
                }
                if (!String.IsNullOrEmpty(UpdateBannerDto.ArabicImage))
                {
                    if (UpdateBannerDto.ArabicImage.Substring(UpdateBannerDto.ArabicImage.Length - 3) != "jpg")
                    {
                        if (!String.IsNullOrEmpty(UpdateBannerDto.ArabicImage))
                        {
                            Byte[] ArabicimageByteData = Convert.FromBase64String(UpdateBannerDto.ArabicImage);
                            var Arabicfs = new BinaryWriter(new FileStream(strImagePath + bannerArabicImages + ".jpg", FileMode.Create, FileAccess.Write));
                            Arabicfs.Write(ArabicimageByteData);
                            Arabicfs.Close();
                            UpdateBannerDto.ArabicImage = bannerArabicImages + ".jpg";
                        }
                    }
                    else
                    {
                        UpdateBannerDto.ArabicImage = "";
                    }
                }
                else
                {
                    UpdateBannerDto.ArabicImage = "";
                }
                Bannerupdatestatus = await _BannerService.UpdateBanners(UpdateBannerDto);
                if (Bannerupdatestatus == "Banner updated successfully")
                {
                    return Ok(new GenericResultDto<string> { Result = Bannerupdatestatus });
                }
                return BadRequest(new GenericResultDto<string> { Result = Bannerupdatestatus });
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }

        }

        [HttpPost, Route("deleteBanners"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> deleteBanners([FromBody] DeleteBannerDto DeleteBannerDto)
        {
            string Bannerdeletestatus = string.Empty;
            try
            {
                Bannerdeletestatus = await _BannerService.DeleteBanners(DeleteBannerDto);
                if (Bannerdeletestatus == "Banner deleted successfully")
                {
                    return Ok(new GenericResultDto<string> { Result = Bannerdeletestatus });
                }
                return BadRequest(new GenericResultDto<string> { Result = Bannerdeletestatus });
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
    }

}
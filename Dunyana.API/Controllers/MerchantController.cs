using Dunyana.API.Filters;
using Dunyana.API.Middleware;
using Dunyana.Dto;
using Dunyana.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
namespace Dunyana.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class MerchantController : BaseController
    {
        private readonly MerchantService _MerchantService;
        private readonly UsersService _UsersService;
        private readonly MerchantCategoryService _MerchantCategoryService;
        private readonly MerchantRedirectionService _MerchantRedirectionService;
        private readonly MerchantContractService _MerchantContractService;
        private readonly IConfiguration _configuration;
        private readonly MerchantSellCountriesService _MerchantSellCountriesService;
        private readonly MerchantRequestService _MerchantRequestService;
        private readonly MerchantRequestDetailsService _MerchantRequestDetailsService;
        private readonly IEmailService _emailService;
        private readonly MerchantAccountDetailsService _MerchantAccountDetailsService;
        string strMerchantImages = string.Empty;
        Guid ProfileImage = Guid.NewGuid();
        Guid CompanyImage = Guid.NewGuid();
        public MerchantController(MerchantService MerchantService, UsersService UsersService, MerchantCategoryService MerchantCategoryService, MerchantRedirectionService MerchantRedirectionService, MerchantContractService MerchantContractService, IConfiguration configuration
                                  , MerchantSellCountriesService MerchantSellCountriesService, MerchantRequestService MerchantRequestService, MerchantRequestDetailsService MerchantRequestDetailsService, IEmailService emailService, MerchantAccountDetailsService MerchantAccountDetailsService)
        {
            _MerchantService = MerchantService;
            _UsersService = UsersService;
            _MerchantCategoryService = MerchantCategoryService;
            _MerchantRedirectionService = MerchantRedirectionService;
            _MerchantContractService = MerchantContractService;
            _configuration = configuration;
            _emailService = emailService;
            _MerchantSellCountriesService = MerchantSellCountriesService;
            _MerchantRequestService = MerchantRequestService;
            _MerchantRequestDetailsService = MerchantRequestDetailsService;
            _MerchantAccountDetailsService = MerchantAccountDetailsService;
        }
        [HttpPost, Route("GetMerchants")]
        [TransactionFilter]
        public async Task<IActionResult> GetMerchant([FromBody]  MerchantDto MerchantDto)
        {
            try
            {
                strMerchantImages = _configuration["FilePath:ImagePath"] + "MerchantImages/";              
                string strServerURL = _configuration["FilePath:ServerURL"] + "MerchantImages/";

                var _getALLMerchantDetails = await _MerchantService.GetMerchantDetails(MerchantDto);
                if ((System.IO.File.Exists(strMerchantImages + _getALLMerchantDetails.ProfileImage + "")))
                {
                    if (_getALLMerchantDetails.ProfileImage != null)
                    {
                       
                        MerchantDto.ProfileImage = strServerURL+ _getALLMerchantDetails.ProfileImage;
                    }
                    else
                    {                     
                        MerchantDto.ProfileImage = strServerURL + "Dummy.jpg";
                    }

                }
                else
                {
                    MerchantDto.ProfileImage = strServerURL + "Dummy.jpg"; 
                }
                if ((System.IO.File.Exists(strMerchantImages + _getALLMerchantDetails.CompanyImage )))
                {
                    if (_getALLMerchantDetails.CompanyImage != null)
                    {

                        MerchantDto.CompanyImage = strServerURL + _getALLMerchantDetails.CompanyImage;
                    }
                    else
                    {
                       
                        MerchantDto.CompanyImage = strServerURL + "Dummy.jpg";
                    }

                }
                else
                {
                    MerchantDto.CompanyImage = strServerURL + "Dummy.jpg";
                }
                return Ok(MerchantDto);
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }

        }
        [HttpPost, Route("getMerchantAccountDetails"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> getMerchantAccountDetails([FromBody]  MerchantAccountDto MerchantAccountDto)
        {
            try
            {

                var _getALLMerchantDetails = await _MerchantService.GetMerchantAccountDetails(MerchantAccountDto);
                return Ok(_getALLMerchantDetails);
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }

        }
        [HttpPost, Route("updateMerchantAccountDetails"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> updateMerchantAccountDetails([FromBody]  UpdateMerchantAccountDetailsDto UpdateMerchantAccountDetailsDto)
        {
            try
            {
                string returnstatus = string.Empty;
               

                if (UpdateMerchantAccountDetailsDto.Id > 0)
                {
                    returnstatus = await _MerchantAccountDetailsService.UpdateMerchantAccountDetails(UpdateMerchantAccountDetailsDto);
                }
                else
                {
                    MerchantDto MerchantDto = new MerchantDto();
                    MerchantDto.Email = UpdateMerchantAccountDetailsDto.MerchantEmail;
                    var getMerchantID = await _MerchantService.GetMerchantDetails(MerchantDto);
                    InsertMerchantAccountDetailsDto InsertMerchantAccountDetailsDto = new InsertMerchantAccountDetailsDto();
                    InsertMerchantAccountDetailsDto.MerchantId = getMerchantID.Id;
                    InsertMerchantAccountDetailsDto.AccountCR = UpdateMerchantAccountDetailsDto.AccountCR;
                    InsertMerchantAccountDetailsDto.BrandAccount = UpdateMerchantAccountDetailsDto.BrandAccount;
                    InsertMerchantAccountDetailsDto.BankName = UpdateMerchantAccountDetailsDto.BankName;
                    InsertMerchantAccountDetailsDto.AccountNumber = UpdateMerchantAccountDetailsDto.AccountNumber;
                    InsertMerchantAccountDetailsDto.Address = UpdateMerchantAccountDetailsDto.Address;
                    InsertMerchantAccountDetailsDto.Swiftcode = UpdateMerchantAccountDetailsDto.Swiftcode;

                    returnstatus = await _MerchantAccountDetailsService.InsertMerchantAccountDetails(InsertMerchantAccountDetailsDto);
                }
                if (returnstatus == "Success")
                {
                    return Ok(new GenericResultDto<string> { Result = "Merchant AccountDetails updated successfully" });
                }
                else
                {
                    return Ok(new GenericResultDto<string> { Result = "Merchant AccountDetails updated Not successfully" });
                }
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }

        }


        [HttpPost, Route("InsertMerchant")]
        [TransactionFilter]
        public async Task<IActionResult> InsertMerchantDetails([FromBody] InsertMerchantDto InsertMerchantDto)
        {
            try
            {
                Guid MerchantRequestId = Guid.NewGuid();
                CustomerRegistrationDto CustomerRegistrationDto = new CustomerRegistrationDto();
                CustomerRegistrationDto.Email = InsertMerchantDto.Email;
                var _emailCheck =await _UsersService.LoginAuthenticate(CustomerRegistrationDto);
                if (InsertMerchantDto.TermandCondition == "Y")
                {
                    InsertMerchantDto.TermandCondition = Convert.ToString(1);
                }
                else if (InsertMerchantDto.TermandCondition == "N")
                {
                    InsertMerchantDto.TermandCondition = Convert.ToString(0);
                }
                if (_emailCheck == null)
                {                   
                    strMerchantImages = _configuration["FilePath:ImagePath"] + "MerchantImages/";
                    if (!String.IsNullOrEmpty(InsertMerchantDto.ProfileImage))
                    {
                        if (!Directory.Exists(strMerchantImages))
                            Directory.CreateDirectory(strMerchantImages);
                        Byte[] imageByteData = Convert.FromBase64String(InsertMerchantDto.ProfileImage);
                        var fs = new BinaryWriter(new FileStream(strMerchantImages + ProfileImage + ".jpg", FileMode.Append, FileAccess.Write));
                        fs.Write(imageByteData);
                        fs.Close();
                        InsertMerchantDto.ProfileImage = ProfileImage + ".jpg";
                    }
                    else
                    {
                        InsertMerchantDto.ProfileImage = "";
                    }
                    if (!String.IsNullOrEmpty(InsertMerchantDto.CompanyImage))
                    {
                        if (!Directory.Exists(strMerchantImages))
                            Directory.CreateDirectory(strMerchantImages);
                        Byte[] imageByteData = Convert.FromBase64String(InsertMerchantDto.CompanyImage);
                        var fs = new BinaryWriter(new FileStream(strMerchantImages + CompanyImage + ".jpg", FileMode.Append, FileAccess.Write));
                        fs.Write(imageByteData);
                        fs.Close();
                        InsertMerchantDto.CompanyImage = CompanyImage + ".jpg";
                    }
                    else
                    {
                        InsertMerchantDto.CompanyImage = "";
                    }
                    CustomerRegistrationDto objCustomerRegistrationDto = new CustomerRegistrationDto();
                    objCustomerRegistrationDto.Email = InsertMerchantDto.Email;
                    objCustomerRegistrationDto.PWD = InsertMerchantDto.PWD;
                    objCustomerRegistrationDto.Type = "M";
                    MerchantDto MerchantDto = new MerchantDto();
                    MerchantDto.Email = InsertMerchantDto.Email;
                    await _UsersService.UserDetails(objCustomerRegistrationDto);
                    int getuserID = await _UsersService.getUsersId(InsertMerchantDto.Email);
                    await _MerchantService.InsertMerchantDetails(InsertMerchantDto, getuserID);
                    var getMerchantID = await _MerchantService.GetMerchantDetails(MerchantDto);
                    await _MerchantCategoryService.InsertMerchantCategory(getMerchantID.Id, InsertMerchantDto.Categories);
                    await _MerchantSellCountriesService.InsertSellCountriesDetails(getMerchantID.Id, InsertMerchantDto.SellCountries);
                    await _MerchantRequestService.InsertRequestDetails(getMerchantID.Id, 24, "Open Request", 4, MerchantRequestId.ToString());
                    var getMerchantRequestId = await _MerchantRequestService.GetMerchantRequestId(MerchantRequestId.ToString());
                    if (getMerchantRequestId > 0)
                    {
                        await _MerchantRequestDetailsService.InsertMerchantRequestDetails(getMerchantRequestId, 24, "Open Request", 4);
                    }
                    string strEmaiL = _configuration["EmailSender:Email"];
                    string Message = "<table width='100%'><tr><td> Dear Admin,</td></tr><tr><td style='padding: 10px 0 10px 0; '>New Merchant Registration.</td></tr><tr><td  style='padding: 10px 0 10px 0;'> <b>" + InsertMerchantDto.Name + " </b> has registered on the dunyana</td></tr><tr><td  style='padding: 15px 0 15px 0;'> Regards,<br /> Dunyana</td></tr></table>";
                    await _emailService.SendEmail(strEmaiL, "New Merchant Registration", Message);
                }
                else
                {
                    return BadRequest(new GenericResultDto<string> { Result = "Email Id already registered",LoginType=_emailCheck.Type, ReEmail = _emailCheck.Username });

                }
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
            return Ok(new GenericResultDto<string> { Result = "We have received your registration request, Please allow us some time to process.", ReFirstName = InsertMerchantDto.Name, ReEmail = InsertMerchantDto.Email });

        }

        [HttpPost, Route("updateMerchant"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> updateMerchantDetails(MerchantDto MerchantDto)
        {
            try
            {
                strMerchantImages = _configuration["FilePath:ImagePath"] + "MerchantImages/";
                if (!String.IsNullOrEmpty(MerchantDto.ProfileImage))
                {
                    if (MerchantDto.ProfileImage.Substring(MerchantDto.ProfileImage.Length - 3) != "jpg")
                    {                     
                        if (!String.IsNullOrEmpty(MerchantDto.ProfileImage))
                        {
                            if (!Directory.Exists(strMerchantImages))
                                Directory.CreateDirectory(strMerchantImages);
                            Byte[] imageByteData = Convert.FromBase64String(MerchantDto.ProfileImage);
                            var fs = new BinaryWriter(new FileStream(strMerchantImages + ProfileImage + ".jpg", FileMode.Create, FileAccess.Write));
                            fs.Write(imageByteData);
                            fs.Close();
                            MerchantDto.ProfileImage = ProfileImage + ".jpg";
                        }
                    }
                    else
                    {
                        MerchantDto.ProfileImage = "";
                    }
                }
                else
                {
                    MerchantDto.ProfileImage = "";
                }
                if (!String.IsNullOrEmpty(MerchantDto.CompanyImage))
                {
                    if (MerchantDto.CompanyImage.Substring(MerchantDto.CompanyImage.Length - 3) != "jpg")
                    {
                        if (!String.IsNullOrEmpty(MerchantDto.CompanyImage))
                        {
                            if (!Directory.Exists(strMerchantImages))
                                Directory.CreateDirectory(strMerchantImages);
                            Byte[] imageByteData = Convert.FromBase64String(MerchantDto.CompanyImage);
                            var fs = new BinaryWriter(new FileStream(strMerchantImages + CompanyImage + ".jpg", FileMode.Create, FileAccess.Write));
                            fs.Write(imageByteData);
                            fs.Close();
                            MerchantDto.CompanyImage = CompanyImage + ".jpg";
                        }
                    }
                    else
                    {
                        MerchantDto.CompanyImage = "";
                    }
                }
                else
                {
                    MerchantDto.CompanyImage = "";
                }

                string returnstatus = await _MerchantService.UpdateRegistrationDetails(MerchantDto);
                if (returnstatus == "Success")
                {
                    return Ok(new GenericResultDto<string> { Result = "Merchant updated successfully", ReFirstName = MerchantDto.Name, ReEmail = MerchantDto.Email });
                }
                else
                {
                    return BadRequest(new GenericResultDto<string> { Result = "You cannot uncheck categories which are having the catalog" });
                }
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }

        // GET: api/<controller>
        [HttpPost, Route("GetMerchantByCategory")]
        public async Task<IActionResult> GetMerchantCategory(MerchantByCategory MerchantByCategory)
        {
            try
            {
                strMerchantImages = _configuration["FilePath:ImagePath"] + "MerchantImages/";
                string strServerURL = _configuration["FilePath:ServerURL"] + "MerchantImages/";

                var _GetMerchantCategory = await _MerchantCategoryService.GetAll(MerchantByCategory);
                if (_GetMerchantCategory.Count > 0)
                {
                    for (int i = 0; i < _GetMerchantCategory.Count(); i++)
                    {
                        if (System.IO.File.Exists(strMerchantImages + _GetMerchantCategory[i].MerchantProfileImage))
                        {
                            _GetMerchantCategory[i].MerchantProfileImage = strServerURL+ _GetMerchantCategory[i].MerchantProfileImage;
                        }
                        else
                        {
                            _GetMerchantCategory[i].MerchantProfileImage = "";
                        }

                        if (System.IO.File.Exists(strMerchantImages + _GetMerchantCategory[i].MerchantWebImage))
                        {
                            _GetMerchantCategory[i].MerchantWebImage = strServerURL + _GetMerchantCategory[i].MerchantWebImage;
                        }
                        else
                        {
                            _GetMerchantCategory[i].MerchantWebImage = strServerURL + "CategoryImagesDummy.jpg"; 
                        }
                        //if (!string.IsNullOrEmpty(_GetMerchantCategory[i].MerchantUrl))
                        //{
                        //    var _getMerchantRedirectionlist = await _MerchantRedirectionService.getMerchantRedirectionlist(_GetMerchantCategory[i].MerchantID);
                        //    string Merchantatt = "";
                        //    if (!string.IsNullOrEmpty(_getMerchantRedirectionlist.MerchantRedirectionUrl))
                        //    {
                        //        foreach (var MerchantRedirection in _getMerchantRedirectionlist.MerchantRedirectionUrl)
                        //        {
                        //            Merchantatt += "&" + MerchantRedirection.MerchantAttribute + "=" + MerchantRedirection.MerchantValue;

                        //        }
                        //    }
                        //    if (Merchantatt != "")
                        //    {
                        //        _GetMerchantCategory[i].MerchantUrl = _GetMerchantCategory[i].MerchantUrl + "?MerchantID=" + _GetMerchantCategory[i].MerchantID + Merchantatt;

                        //    }
                        //}
                    }
                    return Ok(_GetMerchantCategory);
                }
                else
                {
                    return Ok(_GetMerchantCategory);
                }

            }
            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }

        //// GET: api/<controller>
        //[HttpGet, Route("getMerchantRedirection/{MerchantEmail}")]
        //public async Task<IActionResult> GetMerchantRedirection(string MerchantEmail)
        //{
        //    try
        //    {
        //        var _getMerchantRedirectionlist = _MerchantRedirectionService.GetAll(MerchantEmail);
        //        if (_getMerchantRedirectionlist.Count > 0)
        //        {

        //            return Ok(_getMerchantRedirectionlist);
        //        }

        //        return Ok(_getMerchantRedirectionlist);

        //    }
        //    catch (Exception err)
        //    {
        //        return BadRequest(new GenericResultDto<string> { Result = err.Message });
        //    }
        //}

    }
}

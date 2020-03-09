using Dunyana.API.Filters;
using Dunyana.API.Middleware;
using Dunyana.Core;
using Dunyana.Domain;
using Dunyana.Dto;
using Dunyana.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
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
    // [ServiceFilter(typeof(DisableLazyLoadingFilter))]
    public class CustomerController : ControllerBase
    {
        private readonly CustomerRegistrationService _CustomerRegistrationService;
        private readonly IEmailService _emailService;
        private readonly IMobileService _MobileService;
        private readonly UsersService _UsersService;
        private readonly IConfiguration _configuration;
        private readonly OTPAuthenticationService _OTPAuthenticationService;
        private readonly MerchantService _MerchantService;
        private readonly NaqelUsersService _NaqelUsersService;
        private readonly LookupTypeValuesService _LookupTypeValuesService;
        string strImagePath = string.Empty;
        MerchantDto MerchantDto = new MerchantDto();
        MerchantProfile MerchantProfile = new MerchantProfile();
        NaqelUsersDto objNaqelUsersDto = new NaqelUsersDto();
        public CustomerController(CustomerRegistrationService CustomerRegistrationService, IEmailService emailService,IMobileService MobileService, UsersService UsersService, IConfiguration configuration, OTPAuthenticationService OTPAuthenticationService, MerchantService MerchantService, NaqelUsersService NaqelUsersService, LookupTypeValuesService LookupTypeValuesService)
        {
            _CustomerRegistrationService = CustomerRegistrationService;
            _emailService = emailService;
            _UsersService = UsersService;
            _configuration = configuration;
            _OTPAuthenticationService = OTPAuthenticationService;
            _MerchantService = MerchantService;
            _NaqelUsersService = NaqelUsersService;
            _MobileService = MobileService;
            _LookupTypeValuesService = LookupTypeValuesService;
        }

        [HttpGet, Route("GetCustomers"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> Get()
        {
            var customersList = _CustomerRegistrationService.GetAll();
            return Ok(customersList);
        }
         
        [HttpPost, Route("InsertCustomer")]
        [TransactionFilter]
        public async Task<IActionResult> InsertCustomerDetails([FromBody] InsertCustomerRegistrationDto InsertCustomerRegistrationDto)
        {
           
            try
            {
                CustomerRegistrationDto CustomerRegistrationDto = new CustomerRegistrationDto();
                CustomerRegistrationDto.Email = InsertCustomerRegistrationDto.Email;
                CustomerRegistrationDto.Country = InsertCustomerRegistrationDto.Country;
                CustomerRegistrationDto.LoginType = InsertCustomerRegistrationDto.LoginType;
                CustomerRegistrationDto.PWD = InsertCustomerRegistrationDto.PWD;
                CustomerRegistrationDto.OTP = InsertCustomerRegistrationDto.OTP;
                CustomerRegistrationDto.MobileOTP = InsertCustomerRegistrationDto.MobileOTP;
                CustomerRegistrationDto.Mobile = InsertCustomerRegistrationDto.Mobile;
                if (InsertCustomerRegistrationDto.TermandCondition == "Y")
                {
                    InsertCustomerRegistrationDto.TermandCondition = Convert.ToString(1);
                }
                else if (InsertCustomerRegistrationDto.TermandCondition == "N")
                {
                    InsertCustomerRegistrationDto.TermandCondition = Convert.ToString(0);
                }

                var _emailCheck = await _UsersService.LoginAuthenticate(CustomerRegistrationDto);
                if (_emailCheck == null)
                {
                    var _OTPVerifyResponse = await _OTPAuthenticationService.OTPVerifyAuthenticate(CustomerRegistrationDto);
                    var _CountryCode = await _LookupTypeValuesService.GetCountryName(CustomerRegistrationDto.Country);
                  
                    if (_OTPVerifyResponse == "Success" )
                    {
                        if (_CountryCode == "SAR")
                        {
                            var _OTPMobileVerifyResponse = await _OTPAuthenticationService.OTPMobileVerifyAuthenticate(CustomerRegistrationDto);
                            if (_OTPMobileVerifyResponse == "Success")
                            {

                                CustomerRegistrationDto.Type = "C";
                                await _UsersService.UserDetails(CustomerRegistrationDto);
                                int getuserID = await _UsersService.getUsersId(CustomerRegistrationDto.Email);
                                CustomerRegistrationDto.UsersID = getuserID;
                                await _CustomerRegistrationService.InsertRegistrationDetails(InsertCustomerRegistrationDto, getuserID);
                                await _OTPAuthenticationService.DeleteOTPVerifydetails(CustomerRegistrationDto);
                                await _OTPAuthenticationService.DeleteMobileOTPVerifydetails(CustomerRegistrationDto);
                            }
                            else
                            {
                                return BadRequest(new GenericResultDto<string> { Result = _OTPMobileVerifyResponse, ReEmail = CustomerRegistrationDto.Mobile });
                            }
                        }
                        else
                        {
                            CustomerRegistrationDto.Type = "C";
                            await _UsersService.UserDetails(CustomerRegistrationDto);
                            int getuserID = await _UsersService.getUsersId(CustomerRegistrationDto.Email);
                            CustomerRegistrationDto.UsersID = getuserID;
                            await _CustomerRegistrationService.InsertRegistrationDetails(InsertCustomerRegistrationDto, getuserID);
                            await _OTPAuthenticationService.DeleteOTPVerifydetails(CustomerRegistrationDto);
                        }
                    }
                    else
                    {
                        return BadRequest(new GenericResultDto<string> { Result = _OTPVerifyResponse, ReEmail = CustomerRegistrationDto.Email });
                    }
                }
                else
                {
                    return BadRequest(new GenericResultDto<string> { Result = "Email Id already registered", LoginType = _emailCheck.Type, ReEmail = _emailCheck.Username });

                }

            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
            return Ok(new GenericResultDto<string> { Result = "Customer registration successfull", LoginType = "C", ReFirstName = InsertCustomerRegistrationDto.FirstName, ReEmail = InsertCustomerRegistrationDto.Email });
        }
        [HttpPost, Route("OTPAuthentication")]
        [TransactionFilter]
        public async Task<IActionResult> OTPAuthentication([FromBody] CustomerRegistrationDto CustomerRegistrationDto)
        {
            int _returnOTP = 0;
            try
            {
                _returnOTP = await _OTPAuthenticationService.InsertOTPAuthentication(CustomerRegistrationDto);
                try
                {
                    string strURL = _configuration["EmailSender:URL"];
                    string Message = "<table width='100%'><tr><td> Dear Customer,</td></tr><tr><td style='padding: 10px 0 10px 0; '>The One Time Password (OTP) for your Dunyana account is: <b>" + _returnOTP + "</b>.</td></tr><tr><td style='padding: 10px 0 10px 0;'>This OTP is valid for one minute or 1 successful attempt whichever is earlier. Please note, this OTP is valid only for this Dunyana customer registration and cannot be used for any Dunyana customer registration.</td></tr><tr><td  style='padding: 10px 0 10px 0;'>  Please do not share this One Time Password with anyone.</td></tr><tr><td  style='padding: 15px 0 15px 0;'> Regards,<br /> Dunyana</td></tr></table>";
                    await _emailService.SendEmail(CustomerRegistrationDto.Email, "One Time Password (OTP) for your Dunyana verification", Message);

                }
                catch (Exception ex)
                {

                    return BadRequest(new GenericResultDto<string> { Result = ex.Message });
                }

            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
            return Ok(new GenericResultDto<string> { Result = "Check your registered Email address for One-Time-Password(OTP) and enter the code here", ReFirstName = CustomerRegistrationDto.FirstName, ReEmail = CustomerRegistrationDto.Email, OTP = _returnOTP.ToString() });
        }
        [HttpPost, Route("MobileOTPAuthentication")]
        [TransactionFilter]
        public async Task<IActionResult> MobileOTPAuthentication([FromBody] MobileOTPDto MobileOTPDto)
        {
            int _returnOTP = 0;
            try
            {
                _returnOTP = await _OTPAuthenticationService.InsertMobileOTPAuthentication(MobileOTPDto);
                try
                {

                    string Message = _returnOTP + " is your One-Time-Password(OTP) code. code is valid for 2 minutes";
                    string returnmesssage =  await _MobileService.SendMobileOTP(MobileOTPDto.Mobilewithcountrycode,Message);
                    if(returnmesssage.Contains("Send Successful"))
                    {
                        return Ok(new GenericResultDto<string> { Result = "Check your registered Mobile for One-Time-Password(OTP) and enter the code here", OTP = _returnOTP.ToString() });
                    }
                    else
                    {
                        return BadRequest(new GenericResultDto<string> { Result = returnmesssage });
                    }
                }
                catch (Exception ex)
                {

                    return BadRequest(new GenericResultDto<string> { Result = ex.Message });
                }

            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
            
        }

        [HttpPost, Route("ForgotPassword")]
        [TransactionFilter]
        public async Task<IActionResult> ForgotPassword([FromBody] CustomerRegistrationDto CustomerRegistrationDto)
        {
            int _returnOTP = 0;
            try
            {
                var _emailCheck = await _UsersService.LoginAuthenticate(CustomerRegistrationDto);
                if (_emailCheck != null)
                {
                    _returnOTP = await _OTPAuthenticationService.InsertOTPAuthentication(CustomerRegistrationDto);
                    try
                    {
                        string strURL = _configuration["EmailSender:URL"];
                        string Message = "<table width='100%'><tr><td> Dear Customer,</td></tr><tr><td style='padding: 10px 0 10px 0; '>The One Time Password (OTP) for your Dunyana account is: <b>" + _returnOTP + "</b>.</td></tr><tr><td style='padding: 10px 0 10px 0;'>This OTP is valid for one minute or 1 successful attempt whichever is earlier. Please note, this OTP is valid only for this Dunyana customer registration and cannot be used for any Dunyana customer registration.</td></tr><tr><td  style='padding: 10px 0 10px 0;'>  Please do not share this One Time Password with anyone.</td></tr><tr><td  style='padding: 15px 0 15px 0;'> Regards,<br /> Dunyana</td></tr></table>";
                        await _emailService.SendEmail(CustomerRegistrationDto.Email, "One Time Password (OTP) for your Dunyana verification", Message);

                    }
                    catch (Exception ex)
                    {

                        return BadRequest(new GenericResultDto<string> { Result = ex.Message });
                    }
                }
                else
                {
                    return BadRequest(new GenericResultDto<string> { Result = "Email Id not registered", ReEmail = CustomerRegistrationDto.Email });
                }
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
            return Ok(new GenericResultDto<string> { Result = "Check your registered Email address for One-Time-Password(OTP) and enter the code here", ReFirstName = CustomerRegistrationDto.FirstName, ReEmail = CustomerRegistrationDto.Email, OTP = _returnOTP.ToString() });
        }

        [HttpPost, Route("UpdateCustomer"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> UpdateRegistrationDetails([FromBody] CustomerRegistrationDto CustomerRegistrationDto)
        {
            try
            {
                Guid ProfileImage = Guid.NewGuid();

                if (!String.IsNullOrEmpty(CustomerRegistrationDto.Image))
                {
                    if (CustomerRegistrationDto.Image.Substring(CustomerRegistrationDto.Image.Length - 3) != "jpg")
                    {
                        strImagePath = _configuration["FilePath:ImagePath"] + "ProfileImages/";
                        if (!String.IsNullOrEmpty(CustomerRegistrationDto.Image))
                        {
                            if (!Directory.Exists(strImagePath))
                                Directory.CreateDirectory(strImagePath);
                            Byte[] imageByteData = Convert.FromBase64String(CustomerRegistrationDto.Image);
                            var fs = new BinaryWriter(new FileStream(strImagePath + ProfileImage + ".jpg", FileMode.Create, FileAccess.Write));
                            fs.Write(imageByteData);
                            fs.Close();
                            CustomerRegistrationDto.Image = ProfileImage + ".jpg";
                        }
                    }
                    else
                    {
                        CustomerRegistrationDto.Image = Path.GetFileName(CustomerRegistrationDto.Image);
                    }

                }
                else
                {
                    CustomerRegistrationDto.Image = "";
                }
                await _CustomerRegistrationService.UpdateRegistrationDetails(CustomerRegistrationDto);
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
            return Ok(new GenericResultDto<string> { Result = "Customer updated successfully", ReFirstName = CustomerRegistrationDto.FirstName, ReEmail = CustomerRegistrationDto.Email });
        }
        [HttpPost, Route("EmailCheckValidation")]
        [TransactionFilter]
        public async Task<IActionResult> EmailCheckValidation([FromBody] CustomerRegistrationDto CustomerRegistrationDto)
        {
            try
            {
                var _checkLoginAuthentication = await _UsersService.LoginAuthenticate(CustomerRegistrationDto);
                if (_checkLoginAuthentication == null)
                {
                    return Ok(new GenericResultDto<string> { Result = "Email is valid" });
                }
                else
                {
                    return Ok(new GenericResultDto<string> { Result = "Email Id already registered", ReEmail = _checkLoginAuthentication.Username, LoginType = _checkLoginAuthentication.Type });
                }

            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
            return Ok(new GenericResultDto<string> { Result = "Valid email " });
        }
        [HttpPost, Route("MobileCheckValidation")]
        [TransactionFilter]
        public async Task<IActionResult> MobileCheckValidation([FromBody] CustomerRegistrationDto CustomerRegistrationDto)
        {
            try
            {
                var _checkMobileLoginAuthentication = await _UsersService.MobileAuthenticate(CustomerRegistrationDto);
                if (_checkMobileLoginAuthentication == 0)
                {
                    return Ok(new GenericResultDto<string> { Result = "Mobile is available" });
                }
                else
                {
                    return Ok(new GenericResultDto<string> { Result = "Mobile is already registered"});
                }

            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        [HttpPost, Route("UsersLoginAuthenticate")]
        [TransactionFilter]
        public async Task<IActionResult> UsersLoginAuthenticate([FromBody] LoginDto loginDto)
        {
            try
            {

                var _checkLoginAuthentication = await _UsersService.LoginAuthenticate(new CustomerRegistrationDto
                {
                    Email = loginDto.Email
                });
                if (_checkLoginAuthentication != null)
                {
                    var tokenDto = await _CustomerRegistrationService.GetToken(new TokenDto
                        { Type = _checkLoginAuthentication.Type,
                                                        GUID = _checkLoginAuthentication.GUID
                        });
                    if (EncryptionHelper.Decrypt(_checkLoginAuthentication.PWD) == loginDto.PWD)
                    {
                        await _UsersService.UpdateGUID(new CustomerRegistrationDto
                        {
                            Email = loginDto.Email
                        });
                        if (_checkLoginAuthentication.Type == "C")
                        {
                            var _getData = await _CustomerRegistrationService.Authenticate(new CustomerRegistrationDto
                            {
                                Email = loginDto.Email
                            });
                            UsersProfileDto UsersProfileDto = new UsersProfileDto();
                            UsersProfileDto.Id = _checkLoginAuthentication.Id;
                            UsersProfileDto.Username = _getData.Email;
                            UsersProfileDto.Type = _checkLoginAuthentication.Type;
                            UsersProfileDto.Status = _checkLoginAuthentication.Status;
                            UsersProfileDto.GUID = _checkLoginAuthentication.GUID;
                            UsersProfileDto.token = tokenDto.Token;
                            return Ok(new LoginResultDto<UsersProfileDto>
                            {
                                Result = "Success",
                                LoginStatus = _checkLoginAuthentication.Status.ToString(),
                                ReEmail = _getData.Email,
                                ReFirstName = _getData.FirstName,
                                LoginType = _checkLoginAuthentication.Type,
                                ResultData = UsersProfileDto,
                                Token = UsersProfileDto.token
                            });

                        }

                        else if (_checkLoginAuthentication.Type == "M")
                        {
                            string Categories = string.Empty, SellCountries = string.Empty;
                            MerchantDto.Email = loginDto.Email;
                            strImagePath = _configuration["FilePath:ImagePath"] + "MerchantImages/";
                            string strServerURL = _configuration["FilePath:ServerURL"] + "MerchantImages/";
                            var Merchantdetails = await _MerchantService.GetMerchantDetailsByStatus(MerchantDto);
                            if (Merchantdetails != null)
                            {
                                Merchant Merchant = Merchantdetails;
                                MerchantProfile.Id = Merchant.Id;
                                MerchantProfile.Name = Merchant.Name;
                                MerchantProfile.MerchantRedirectionUrl = Merchant.MerchantRedirectionUrl;
                                MerchantProfile.Country = Merchant.LookupCountry.Description;
                                foreach (var MerchantCategoryItem in Merchant.MerchantCategory)
                                {
                                    Categories += MerchantCategoryItem.Category.Name + ",";
                                }
                                foreach (var MerchantSellCountriesItem in Merchant.MerchantSellCountries)
                                {
                                    SellCountries += MerchantSellCountriesItem.LookupTypeValues.Description + ",";
                                }
                                MerchantProfile.Categories = Categories.TrimEnd(',');
                                MerchantProfile.SellCountries = SellCountries.TrimEnd(',');
                                if ((System.IO.File.Exists(strImagePath + Merchant.ProfileImage + "")))
                                {
                                    MerchantProfile.ProfileImage = strServerURL + Merchant.ProfileImage;
                                }
                                else
                                {
                                    MerchantProfile.ProfileImage = strServerURL + "Dummy.jpg";
                                }
                                if ((System.IO.File.Exists(strImagePath + Merchant.CompanyImage)))
                                {
                                    MerchantProfile.ProfileImage = strServerURL + Merchant.CompanyImage;
                                }
                                else
                                {
                                    MerchantProfile.CompanyImage = strServerURL + "Dummy.jpg";
                                }
                                MerchantProfile.Company = Merchant.Company;

                                MerchantProfile.Website = Merchant.Website;
                                MerchantProfile.Email = Merchant.Email;
                                return Ok(new LoginResultDto<MerchantProfile>
                                {
                                    Result = "Success",
                                    LoginStatus = _checkLoginAuthentication.Status.ToString(),
                                    ReEmail = Merchant.Email,
                                    ReFirstName = Merchant.Name,
                                    LoginType = _checkLoginAuthentication.Type,
                                    Website = Merchant.Website,
                                    ResultData = MerchantProfile,
                                    Token = tokenDto.Token
                                });
                            }
                            else
                            {
                                return Ok(new GenericResultDto<string>
                                {
                                    Result = "Your account is under verification and after successful completion, will send a confirmation e-mail.",
                                    ReEmail = loginDto.Email
                                });
                            }
                        }
                        else
                        {

                            objNaqelUsersDto.Email = loginDto.Email;
                            NaqelUsers NaqelUsers = await _NaqelUsersService.GetNaqelUserDetails(objNaqelUsersDto);
                            ProfileDto profileDto = new ProfileDto();
                            profileDto.Id = NaqelUsers.Id;
                            profileDto.FirstName = NaqelUsers.FirstName;
                            profileDto.LastName = NaqelUsers.LastName;
                            profileDto.Country = NaqelUsers.LookupTypeCountry.Description;
                            profileDto.Email = NaqelUsers.Email;
                            profileDto.Mobile = NaqelUsers.Mobile;
                            profileDto.Address = NaqelUsers.Address;
                            strImagePath = _configuration["FilePath:ImagePath"] + "MerchantImages/";
                            string strServerURL = _configuration["FilePath:ServerURL"] + "MerchantImages/";
                            if ((System.IO.File.Exists(strImagePath + NaqelUsers.Image + "")))
                            {
                                profileDto.Image = strServerURL + NaqelUsers.Image;
                            }
                            else
                            {
                                profileDto.Image = strServerURL + "Dummy.jpg";
                            }
                            return Ok(new LoginResultDto<ProfileDto>
                            {
                                Result = "Success",
                                LoginStatus = _checkLoginAuthentication.Status.ToString(),
                                ReEmail = NaqelUsers.Email,
                                ReFirstName = NaqelUsers.FirstName,
                                LoginType = _checkLoginAuthentication.Type,
                                ResultData = profileDto,
                                Token = tokenDto.Token
                            });
                        }

                    }
                    else
                    {
                        return Ok(new GenericResultDto<string>
                        {
                            Result = "Invalid password",
                            ReEmail = loginDto.Email
                        });
                    }
                }
                else
                {
                    // if (_types != null && _types.Type == "M")
                    //   return BadRequest(new GenericResultDto<string> { Result = "Merchant Sign In Under Process", ReEmail = CustomerRegistrationDto.Email });
                    // else
                    return Ok(new GenericResultDto<string> { Result = "Invalid email", ReEmail = loginDto.Email });
                }

            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
            return Ok(new GenericResultDto<string> { Result = "Valid email" });
        }

        [HttpPost, Route("ChangePassword")]
        [TransactionFilter]
        public async Task<IActionResult> UpdateChangePassword([FromBody] CustomerRegistrationDto CustomerRegistrationDto)
        {
            try
            {
                var _types = await _UsersService.LoginAuthenticate(CustomerRegistrationDto);
                if (_types != null)
                {
                    if (!String.IsNullOrEmpty(CustomerRegistrationDto.OldPWD))
                    {
                        if (EncryptionHelper.Decrypt(_types.PWD) == CustomerRegistrationDto.OldPWD)
                        {

                            var list = (from t in _types.UserAduit
                                        orderby t.CreatedDate descending
                                        select t).Take(3);

                            foreach (var Auditloop in list)
                            {

                                if (EncryptionHelper.Decrypt(Auditloop.Newvalue) == CustomerRegistrationDto.PWD)
                                {
                                    return BadRequest(new GenericResultDto<string>
                                    {
                                        Result = "Choose a password that is different from your last 3 passwords"
                                    });
                                }


                            }
                            if (EncryptionHelper.Decrypt(_types.PWD) != CustomerRegistrationDto.PWD)
                            {
                                await _UsersService.ChangePassword(CustomerRegistrationDto);
                                await _OTPAuthenticationService.DeleteOTPVerifydetails(CustomerRegistrationDto);
                                return Ok(new GenericResultDto<string> { Result = "Your password has been changed" });
                            }
                            else
                            {
                                return BadRequest(new GenericResultDto<string>
                                {
                                    Result = "Choose a password that is different from your last 3 passwords"
                                });
                            }
                        }
                        else
                        {
                            return BadRequest(new GenericResultDto<string> { Result = "The old password you have entered is incorrect" });
                        }
                    }
                    else
                    {


                        var list = (from t in _types.UserAduit
                                    orderby t.CreatedDate descending
                                    select t).Take(3);

                        foreach (var Auditloop in list)
                        {

                            if (EncryptionHelper.Decrypt(Auditloop.Newvalue) == CustomerRegistrationDto.PWD)
                            {
                                return BadRequest(new GenericResultDto<string>
                                {
                                    Result = "Choose a password that is different from your last 3 passwords"
                                });
                            }


                        }
                        if (EncryptionHelper.Decrypt(_types.PWD) != CustomerRegistrationDto.PWD)
                        {
                            await _UsersService.ChangePassword(CustomerRegistrationDto);
                            await _OTPAuthenticationService.DeleteOTPVerifydetails(CustomerRegistrationDto);
                            return Ok(new GenericResultDto<string> { Result = "Your password has been changed" });
                        }
                        else
                        {
                            return BadRequest(new GenericResultDto<string>
                            {
                                Result = "Choose a password that is different from your last 3 passwords"
                            });
                        }

                    }
                }
                else
                {
                    return BadRequest(new GenericResultDto<string> { Result = "Invalid email" });
                }
            }
            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
            return Ok(new GenericResultDto<string> { Result = "Your password has been changed" });
        }

        /// <summary>
        /// Returns the details of the logged in user ( Customer or Merchant or Naqel user).
        /// </summary>
        /// <param name="customerRegistrationDto"></param>
        /// <remarks>Email is required.</remarks>        
        /// <returns>A task that upon completion contains the user details.</returns>

        [HttpPost, Route("GetProfileDetails"), Authorize(AuthenticationSchemes = "Bearer")]
       // [Authorize(Roles = Role.Customer)] 
        [TransactionFilter]
        public async Task<IActionResult> GetProfileDetails([FromBody] GetProfileDto customerRegistrationDto)
        {
            try
            {
                ProfileDto profileDto = new ProfileDto();
                var _getUsers = await _UsersService.UserPWD(new CustomerRegistrationDto { Email = customerRegistrationDto.Email });
                if (_getUsers != null)
                {
                    if (_getUsers.Type.ToUpper() == "C")
                    {
                        strImagePath = _configuration["FilePath:ImagePath"] + "ProfileImages/";
                        string strServerURL = _configuration["FilePath:ServerURL"] + "ProfileImages/";
                        var _types = await _CustomerRegistrationService.Authenticate(new CustomerRegistrationDto
                        { Email = customerRegistrationDto.Email });

                        profileDto.FirstName = _types.FirstName;
                        profileDto.LastName = _types.LastName;
                        profileDto.Email = _types.Email;
                        profileDto.Country = _types.LookupCountry.Description;
                        profileDto.City = _types.City;
                        profileDto.Mobile = _types.Mobile;
                        profileDto.Address = _types.Address;
                        profileDto.Status = _getUsers.Status;
                        profileDto.Type = _getUsers.Type;
                        profileDto.Id = _getUsers.GUID;
                        profileDto.Customercurrency = _types.LookupCountry.ShortDesc;
                        if (_types.Wallet != null)
                        {
                            profileDto.Wallet = _types.Wallet.Amount;
                        }
                        else
                        {
                            profileDto.Wallet = 0;
                        }
                        if (_types.WalletPoints != null)
                        {
                            profileDto.WalletPoints = _types.WalletPoints.Points;
                        }
                        else
                        {
                            profileDto.WalletPoints = 0;
                        }
                        if ((System.IO.File.Exists(strImagePath + _types.Image + "")))
                        {
                            if (_types.Image == null || _types.Image == "")
                            {
                                profileDto.Image = strServerURL + "Dummy.jpg";
                            }
                            else
                            {
                                profileDto.Image = strServerURL + _types.Image;
                                
                            }

                        }
                        else
                        {
                            profileDto.Image = strServerURL + "Dummy.jpg";
                        }
                    }
                    else if (_getUsers.Type.ToUpper() == "M")
                    {
                        string Categories = string.Empty, SellCountries = string.Empty;
                        MerchantDto.Email = customerRegistrationDto.Email;
                        Merchant Merchant = await _MerchantService.GetMerchantDetails(MerchantDto);
                        strImagePath = _configuration["FilePath:ImagePath"] + "MerchantImages/";
                        string strServerURL = _configuration["FilePath:ServerURL"] + "MerchantImages/";
                        profileDto.FirstName = Merchant.Name;
                        profileDto.Email = Merchant.Email;
                        profileDto.Company = Merchant.Company;
                        profileDto.Website = Merchant.Website;
                        profileDto.Email = Merchant.Email;
                        profileDto.Status = _getUsers.Status;
                        profileDto.Type = _getUsers.Type;
                        profileDto.Id = Merchant.Id;
                        profileDto.MerchantRedirectionUrl = Merchant.MerchantRedirectionUrl;
                        profileDto.Country = Merchant.LookupCountry.Description;
                        profileDto.Company = Merchant.Company;

                        //foreach (var MerchantCategoryItem in Merchant.MerchantCategory)
                        //{
                        //    Categories += MerchantCategoryItem.Category.Name + ",";
                        //}
                        //foreach (var MerchantSellCountriesItem in Merchant.MerchantSellCountries)
                        //{
                        //    SellCountries += MerchantSellCountriesItem.LookupTypeValues.Description + ",";
                        //}


                        List<ProfileCategoriesDto> profileCategoriesList = new List<ProfileCategoriesDto>();
                        foreach (var CategoriesIteams in Merchant.MerchantCategory)
                        {
                            ProfileCategoriesDto ProfileCategories = new ProfileCategoriesDto();
                            ProfileCategories.CategoryId = CategoriesIteams.Category.Id;
                            ProfileCategories.CategoryName = CategoriesIteams.Category.Name;
                            profileCategoriesList.Add(ProfileCategories);
                        }

                        List<ProfileSellCountriesDto> ProfileSellCountriesList = new List<ProfileSellCountriesDto>();
                        foreach (var SellCountriesIteams in Merchant.MerchantSellCountries)
                        {
                            ProfileSellCountriesDto ProfileSellCountries = new ProfileSellCountriesDto();
                            ProfileSellCountries.SellCountryId = SellCountriesIteams.LookupTypeValues.Id;
                            ProfileSellCountries.SellCountryName = SellCountriesIteams.LookupTypeValues.Description;
                            ProfileSellCountriesList.Add(ProfileSellCountries);
                        }
                        profileDto.Categories = profileCategoriesList;
                        profileDto.SellCountries = ProfileSellCountriesList;
                        if ((System.IO.File.Exists(strImagePath + Merchant.ProfileImage + "")))
                        {
                            profileDto.ProfileImage = strServerURL + Merchant.ProfileImage;
                        }
                        else
                        {
                            profileDto.ProfileImage = strServerURL + "Dummy.jpg";
                        }
                        if ((System.IO.File.Exists(strImagePath + Merchant.CompanyImage)))
                        {
                            profileDto.CompanyImage = strServerURL + Merchant.CompanyImage;
                        }
                        else
                        {
                            profileDto.CompanyImage = strServerURL + "Dummy.jpg";
                        }

                    }
                    else
                    {
                        objNaqelUsersDto.Email = customerRegistrationDto.Email;
                        NaqelUsers NaqelUsers = await _NaqelUsersService.GetNaqelUserDetails(objNaqelUsersDto);
                        profileDto.FirstName = NaqelUsers.FirstName;
                        profileDto.LastName = NaqelUsers.LastName;
                        profileDto.Country = NaqelUsers.LookupTypeCountry.Description;
                        profileDto.Email = NaqelUsers.Email;
                        profileDto.Mobile = NaqelUsers.Mobile;
                        profileDto.Address = NaqelUsers.Address;
                        profileDto.Status = _getUsers.Status;
                        profileDto.Type = _getUsers.Type;
                        profileDto.Id = NaqelUsers.Id;
                        profileDto.NaqelUserType = NaqelUsers.UserType;
                        strImagePath = _configuration["FilePath:ImagePath"] + "NaqelUsersImages/";
                        string strServerURL = _configuration["FilePath:ServerURL"] + "NaqelUsersImages/";
                        if ((System.IO.File.Exists(strImagePath + NaqelUsers.Image + "")))
                        {
                            profileDto.Image = strServerURL + NaqelUsers.Image;
                        }
                        else
                        {
                            profileDto.Image = strServerURL + "Dummy.jpg";
                        }
                    }
                    return Ok(profileDto);
                }
                else
                {
                    return Ok(new GenericResultDto<string> { Result = "User Profile not found" });
                }
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }

        }

        [HttpPost, Route("GetToken")]
        public async Task<IActionResult> GetToken([FromBody] LoginDto loginDto)
        {
            var user = await _UsersService.LoginAuthenticate(new CustomerRegistrationDto
            {
                Email = loginDto.Email
            });
            if (user != null)
            {
                TokenDto tokenDto = new TokenDto();
                tokenDto.GUID = user.GUID;
                tokenDto.Type = user.Type;
                tokenDto = await _CustomerRegistrationService.GetToken(tokenDto);
                return Ok(tokenDto);
            }


            return BadRequest(new GenericResultDto<string> { Result = "User not found" });
        }
    }
}
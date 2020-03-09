using Dunyana.API.Filters;
using Dunyana.API.Middleware;
using Dunyana.Domain;
using Dunyana.Dto;
using Dunyana.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;

namespace Dunyana.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    //[ServiceFilter(typeof(DisableLazyLoadingFilter))]
    public class AdminController : ControllerBase
    {
        private readonly CustomerRegistrationService _customerRegistrationService;

        private readonly UsersService _usersService;
        private readonly IEmailService _emailService;
        private readonly NaqelUsersService _naqelUsersService;
        private readonly MerchantService _merchantService;
        private readonly LookupTypeValuesService _lookupTypeValuesService;
        private readonly AdminPromotionalService _AdminPromotionalService;
        private readonly AdminPromotionalCountriesService _AdminPromotionalCountriesService;
        private readonly IConfiguration _configuration;
        string strImagePath = string.Empty;
        Guid AdminPromotionalEnglishImages = Guid.NewGuid();
        Guid AdminPromotionalArabicImages = Guid.NewGuid();
        public AdminController(CustomerRegistrationService customerRegistrationService,
                       UsersService usersService, IConfiguration configuration,
            NaqelUsersService naqelUsersService, MerchantService merchantService, IEmailService emailService, LookupTypeValuesService lookupTypeValuesService, AdminPromotionalService AdminPromotionalService, AdminPromotionalCountriesService AdminPromotionalCountriesService)
        {
            _customerRegistrationService = customerRegistrationService;
            _usersService = usersService;
            _naqelUsersService = naqelUsersService;
            _merchantService = merchantService;
            _emailService = emailService;
            _configuration = configuration;
            _lookupTypeValuesService = lookupTypeValuesService;
            _AdminPromotionalService = AdminPromotionalService;
            _AdminPromotionalCountriesService = AdminPromotionalCountriesService;
        }
        [HttpGet, Route("GetUsers")]
        public async Task<IActionResult> Get()
        {
            var customersList = _customerRegistrationService.GetAll();
            List<UsersDto> usersDtos = new List<UsersDto>();
            List<UserDto> customers = new List<UserDto>();
            List<UserDto> merchants = new List<UserDto>();
            List<UserDto> naqelUsers = new List<UserDto>();
            foreach (var item in customersList)
            {
                customers.Add(new UserDto
                {
                    Id = item.Id,
                    FirstName = item.FirstName,
                    Country = item.Country,
                    CreatedDt = item.CreatedDt,
                    Email = item.Email,
                    Mobile = item.Mobile,
                    UserName = item.FirstName + " " + item.LastName,
                    IsActive = item.IsActive != null ? Convert.ToInt32(item.IsActive) == 1 ? "Yes" : "No" : string.Empty, // need to fix,
                    UserType = "Customer",
                    Address = item.Address,
                    LastName = item.LastName

                });



            }
            var naqelUserList = _naqelUsersService.GetAll();
            foreach (var naqelItem in naqelUserList)
            {
                naqelUsers.Add(new UserDto
                {
                    Id = naqelItem.Id,
                    FirstName = naqelItem.FirstName,
                    Country = naqelItem.Country,
                    CreatedDt = naqelItem.CreatedDt,
                    Email = naqelItem.Email,
                    Mobile = naqelItem.Mobile,
                    UserName = naqelItem.FirstName + " " + naqelItem.LastName,
                    IsActive = naqelItem.IsActive != null ? Convert.ToInt32(naqelItem.IsActive) == 1 ? "Yes" : "No" : string.Empty, // need to fix,
                    UserType = naqelItem.UserType,
                    Address = naqelItem.Address,
                    LastName = naqelItem.LastName


                });

            }

            var merchantList = _merchantService.GetAll();
            foreach (var merchantItem in merchantList)
            {
                merchants.Add(new UserDto
                {
                    Id = merchantItem.Id,
                    FirstName = merchantItem.FirstName,
                    CreatedDt = merchantItem.CreatedDt,
                    Email = merchantItem.Email,
                    Country = merchantItem.Country,
                    UserName = merchantItem.FirstName,
                    IsActive = merchantItem.IsActive != null ? Convert.ToInt32(merchantItem.IsActive) == 1 ? "Yes" : "No" : string.Empty, // need to fix,
                    UserType = "Merchant",
                    Address = merchantItem.Address,
                    LastName = merchantItem.LastName,
                    Company = merchantItem.Company



                });

            }
            usersDtos.Add(new UsersDto { Customers = customers, Naqelusers = naqelUsers, Merchants = merchants });
            return Ok(usersDtos);
        }
        [HttpGet, Route("getAdminHomePromotionals/{Ipcountry}/{CountryTimezone}")]
        public async Task<IActionResult> GetAdminHomePromotionals(string Ipcountry, string CountryTimezone)
        {
            try
            {
                var _getAdminPromotional = await _AdminPromotionalService.GetAdminHomePromotional(Ipcountry, CountryTimezone);

                foreach (var returnlist in _getAdminPromotional)
                {
                    strImagePath = _configuration["FilePath:ImagePath"] + "AdminPromotional/";
                    string strServerURL = _configuration["FilePath:ServerURL"] + "AdminPromotional/";
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
                return Ok(_getAdminPromotional);
            }
            catch (Exception err)
            {

                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        [HttpPost, Route("getAdminPromotionals"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> GetAdminPromotionals([FromBody] AdminPromotionalDto AdminPromotionalDto)
        {
            try
            {
                var _getAdminPromotional = await _AdminPromotionalService.GetAdminPromotional(AdminPromotionalDto);

                foreach (var returnlist in _getAdminPromotional)
                {
                    strImagePath = _configuration["FilePath:ImagePath"] + "AdminPromotional/";
                    string strServerURL = _configuration["FilePath:ServerURL"] + "AdminPromotional/";
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
                return Ok(_getAdminPromotional);
            }
            catch (Exception err)
            {

                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }

        [HttpPost, Route("insertAdminPromotionals"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> insertAdminPromotionals([FromBody] InsertAdminPromotionalDto InsertAdminPromotionalDto)
        {
            string AdminPromotionalstatus = "";
            try
            {

                strImagePath = _configuration["FilePath:ImagePath"] + "AdminPromotional/";
                if (!Directory.Exists(strImagePath))
                    Directory.CreateDirectory(strImagePath);
                if (InsertAdminPromotionalDto.EnglishImage != "")
                {

                    Byte[] EnglishimageByteData = Convert.FromBase64String(InsertAdminPromotionalDto.EnglishImage);
                    var Englishfs = new BinaryWriter(new FileStream(strImagePath + AdminPromotionalEnglishImages + ".jpg", FileMode.Append, FileAccess.Write));
                    Englishfs.Write(EnglishimageByteData);
                    Englishfs.Close();
                    InsertAdminPromotionalDto.EnglishImage = AdminPromotionalEnglishImages + ".jpg";
                }
                else
                {
                    InsertAdminPromotionalDto.EnglishImage = "";
                }
                if (InsertAdminPromotionalDto.ArabicImage != "")
                {

                    Byte[] ArabicimageByteData = Convert.FromBase64String(InsertAdminPromotionalDto.ArabicImage);
                    var Arabicfs = new BinaryWriter(new FileStream(strImagePath + AdminPromotionalArabicImages + ".jpg", FileMode.Append, FileAccess.Write));
                    Arabicfs.Write(ArabicimageByteData);
                    Arabicfs.Close();
                    InsertAdminPromotionalDto.ArabicImage = AdminPromotionalArabicImages + ".jpg";
                }
                else
                {
                    InsertAdminPromotionalDto.ArabicImage = "";
                }
                AdminPromotionalstatus = await _AdminPromotionalService.InsertAdminPromotionalDetails(InsertAdminPromotionalDto);
                if (InsertAdminPromotionalDto.IsDefault == "0")
                {
                    int AdminPromotionalid = await _AdminPromotionalService.GetAdminPromotionalid(InsertAdminPromotionalDto.ArabicImage, InsertAdminPromotionalDto.EnglishImage);
                    if (AdminPromotionalstatus == "Admin Promotional created successfully" && AdminPromotionalid > 0)
                    {
                        await _AdminPromotionalCountriesService.InsertAdminPromotionalCountriesDetails(InsertAdminPromotionalDto.Countries, AdminPromotionalid);
                        return Ok(new GenericResultDto<string> { Result = AdminPromotionalstatus });
                    };
                }
                else if (InsertAdminPromotionalDto.IsDefault == "1" && AdminPromotionalstatus == "AdminPromotional created successfully")
                {
                    return Ok(new GenericResultDto<string> { Result = AdminPromotionalstatus });
                }
                return BadRequest(new GenericResultDto<string> { Result = AdminPromotionalstatus });
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        [HttpPost, Route("updateAdminPromotionals"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> UpdateAdminPromotionals([FromBody] UpdateAdminPromotionalDto UpdateAdminPromotionalDto)
        {
            string AdminPromotionalupdatestatus = string.Empty;
            try
            {
                strImagePath = _configuration["FilePath:ImagePath"] + "AdminPromotional/";

                if (!Directory.Exists(strImagePath))
                    Directory.CreateDirectory(strImagePath);

                if (!String.IsNullOrEmpty(UpdateAdminPromotionalDto.EnglishImage))
                {
                    if (UpdateAdminPromotionalDto.EnglishImage.Substring(UpdateAdminPromotionalDto.EnglishImage.Length - 3) != "jpg")
                    {
                        if (!String.IsNullOrEmpty(UpdateAdminPromotionalDto.EnglishImage))
                        {
                            Byte[] EnglishimageByteData = Convert.FromBase64String(UpdateAdminPromotionalDto.EnglishImage);
                            var Englishfs = new BinaryWriter(new FileStream(strImagePath + AdminPromotionalEnglishImages + ".jpg", FileMode.Create, FileAccess.Write));
                            Englishfs.Write(EnglishimageByteData);
                            Englishfs.Close();
                            UpdateAdminPromotionalDto.EnglishImage = AdminPromotionalEnglishImages + ".jpg";
                        }
                    }
                    else
                    {
                        UpdateAdminPromotionalDto.EnglishImage = "";
                    }
                }
                else
                {
                    UpdateAdminPromotionalDto.EnglishImage = "";
                }
                if (!String.IsNullOrEmpty(UpdateAdminPromotionalDto.ArabicImage))
                {
                    if (UpdateAdminPromotionalDto.ArabicImage.Substring(UpdateAdminPromotionalDto.ArabicImage.Length - 3) != "jpg")
                    {
                        if (!String.IsNullOrEmpty(UpdateAdminPromotionalDto.ArabicImage))
                        {
                            Byte[] ArabicimageByteData = Convert.FromBase64String(UpdateAdminPromotionalDto.ArabicImage);
                            var Arabicfs = new BinaryWriter(new FileStream(strImagePath + AdminPromotionalArabicImages + ".jpg", FileMode.Create, FileAccess.Write));
                            Arabicfs.Write(ArabicimageByteData);
                            Arabicfs.Close();
                            UpdateAdminPromotionalDto.ArabicImage = AdminPromotionalArabicImages + ".jpg";
                        }
                    }
                    else
                    {
                        UpdateAdminPromotionalDto.ArabicImage = "";
                    }
                }
                else
                {
                    UpdateAdminPromotionalDto.ArabicImage = "";
                }
                AdminPromotionalupdatestatus = await _AdminPromotionalService.UpdateAdminPromotional(UpdateAdminPromotionalDto);
                if (AdminPromotionalupdatestatus == "Admin Promotional updated successfully")
                {
                    return Ok(new GenericResultDto<string> { Result = AdminPromotionalupdatestatus });
                }
                return BadRequest(new GenericResultDto<string> { Result = AdminPromotionalupdatestatus });
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }

        }

        [HttpPost, Route("deleteAdminPromotionals"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> deleteAdminPromotionals([FromBody] DeleteAdminPromotionalDto DeleteAdminPromotionalDto)
        {
            string AdminPromotionaldeletestatus = string.Empty;
            try
            {
                AdminPromotionaldeletestatus = await _AdminPromotionalService.DeleteAdminPromotional(DeleteAdminPromotionalDto);
                if (AdminPromotionaldeletestatus == "Admin Promotional deleted successfully")
                {
                    return Ok(new GenericResultDto<string> { Result = AdminPromotionaldeletestatus });
                }
                return BadRequest(new GenericResultDto<string> { Result = AdminPromotionaldeletestatus });
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }

        [HttpPost, Route("AddUser"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> InsertUser([FromBody] JObject jsonResult)
        {
            try
            {
                Guid Pwdid = Guid.NewGuid();
                UserDto userDto = JsonConvert.DeserializeObject<UserDto>(jsonResult.ToString());
                CustomerRegistrationDto CustomerRegistrationDto = new CustomerRegistrationDto();
                CustomerRegistrationDto.Email = userDto.Email;
                CustomerRegistrationDto.FirstName = userDto.FirstName;
                CustomerRegistrationDto.LastName = userDto.LastName;
                CustomerRegistrationDto.Mobile = userDto.Mobile;
                CustomerRegistrationDto.Country = userDto.Country;
                CustomerRegistrationDto.PWD = Pwdid.ToString().Substring(0, 7);
                CustomerRegistrationDto.Address = userDto.Address;
                string _getNaqelUsertypedec = await _lookupTypeValuesService.Getlookupdec(Convert.ToInt32(userDto.NaqelUserType));
                CustomerRegistrationDto.Type = _getNaqelUsertypedec;
                var _checkLoginAuthentication = await _usersService.LoginAuthenticate(CustomerRegistrationDto);
                if (_checkLoginAuthentication == null)
                {
                    await _usersService.UserDetails(CustomerRegistrationDto);
                    int getuserID = await _usersService.getUsersId(userDto.Email);
                    if (getuserID > 0)
                    {
                        await _naqelUsersService.AddNaqelUser(new NaqelUsers
                        {
                            FirstName = userDto.FirstName,
                            LastName = userDto.LastName,
                            Mobile = userDto.Mobile,
                            Email = userDto.Email,
                            Address = userDto.Address,
                            Country = Convert.ToInt32(userDto.Country),
                            Image = "",
                            UsersID = getuserID,
                            UserType = userDto.NaqelUserType

                        });
                        try
                        {
                            string strURL = _configuration["EmailSender:URL"];
                            string Message = "<table width='100%'><tr><td> Dear " + userDto.FirstName + " " + userDto.LastName + ",</td></tr><tr><td style='padding: 10px 0 10px 0; '>Your Dunyana Account has been created, Welcome to the Dunyana.</td></tr><tr><td style='padding: 10px 0 10px 0;'>From now on, please log in to your account using email: " + userDto.Email + " and password: " + Pwdid.ToString().Substring(0, 7) + "</td></tr><tr><td  style='padding: 10px 0 10px 0;'>  Please do not share this Password with anyone.</td></tr><tr><td  style='padding: 15px 0 15px 0;'> Regards,<br /> Dunyana</td></tr></table>";
                            await _emailService.SendEmail(CustomerRegistrationDto.Email, "Your Registration Details for Dunyana Account", Message);
                        }
                        catch (Exception ex)
                        {
                            return Ok(new GenericResultDto<string>
                            {
                                Result = "Unable to send email to the user.",
                                ReEmail = _checkLoginAuthentication.Username,
                                LoginType = _checkLoginAuthentication.Type,
                                LoginStatus = "F"
                            });
                        }
                        return Ok(new GenericResultDto<string>
                        {
                            Result = "User login details has been sent to email id",
                            LoginStatus = "S"
                        });

                    }
                }
                else
                {
                    return Ok(new GenericResultDto<string>
                    {
                        Result = "Email Id already registered",
                        ReEmail = _checkLoginAuthentication.Username,
                        LoginType = _checkLoginAuthentication.Type,
                        LoginStatus = "F"
                    });
                }
                return BadRequest(new GenericResultDto<string> { Result = "User not created", LoginStatus = "F" });

            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message, LoginStatus = "F" });
            }
            return Ok(new GenericResultDto<string> { Result = "Categories created successfully" });
        }

        [HttpPost, Route("updateUser"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> UpdateUser([FromBody] UserDto user)
        {
            try
            {
                Users users = new Users();
                if (user.UserType == "C")
                {
                    CustomerRegistration customerRegistration = _customerRegistrationService.GetCustomer(user.Id);
                    users = await _usersService.GetUser(customerRegistration.UsersID.Value);
                }
                else if (user.UserType == "M")
                {
                    Merchant merchant = await _merchantService.GetMerchant(user.Id);
                    users = await _usersService.GetUser(merchant.UsersID.Value);
                }
                else if (user.UserType == "N")
                {
                    NaqelUsers naqelUsers = await _naqelUsersService.GetNaqelUser(user.Id);
                    users = await _usersService.GetUser(naqelUsers.UsersID.Value);
                    naqelUsers.FirstName = user.FirstName;
                    naqelUsers.LastName = user.LastName;
                    naqelUsers.Email = user.Email;
                    naqelUsers.Address = user.Address;
                    naqelUsers.Country = Convert.ToInt32(user.Country);
                    naqelUsers.UserType = user.NaqelUserType;
                    naqelUsers.Mobile = user.Mobile;
                    await _naqelUsersService.UpdateNaqelUser(naqelUsers);
                    string _getNaqelUsertypedec = await _lookupTypeValuesService.Getlookupdec(Convert.ToInt32(user.NaqelUserType));
                    await _usersService.UpdateUserType(user.Email, _getNaqelUsertypedec);
                }
                if (users != null)
                {
                    users.Status = user.IsActive == "1" ? 1 : 0;
                }
                await _usersService.UpdateUser(users);
                return Ok(new GenericResultDto<string> { Result = "User updated successfully" });
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
            return Ok(new GenericResultDto<string> { Result = "User updated successfully" });
        }
    }
}
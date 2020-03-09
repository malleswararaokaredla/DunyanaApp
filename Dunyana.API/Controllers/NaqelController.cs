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
using System.Threading.Tasks;

namespace Dunyana.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class NaqelController : ControllerBase
    {
        private readonly NaqelServices _NaqelServices;
        private readonly NaqelUsersService _naqelUsersService;
        private readonly OrdersService _OrdersService;
        private readonly MerchantContractService _MerchantContractService;
        private readonly MerchantRequestService _MerchantRequestService;
        private readonly MerchantService _MerchantService;
        private readonly MerchantRedirectionService _MerchantRedirectionService;
        private readonly LookupTypeService _LookupTypeService;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly WalletHistoryService _WalletHistoryService;
        private readonly PaymentResponseService _PaymentResponseService;
        private readonly MerchantCatalogService _MerchantCatalogService;
        private readonly CategoryService _CategoryService;
        private readonly MerchantRequestDetailsService _MerchantRequestDetailsService;
        private readonly CustomerRegistrationService _CustomerRegistrationService;
        private readonly MerchantAccountDetailsService _MerchantAccountDetailsService;
        string strMerchantImages = string.Empty;
        public NaqelController(NaqelServices NaqelServices, OrdersService OrdersService, MerchantContractService MerchantContractService, MerchantRequestService MerchantRequestService, MerchantService MerchantService, MerchantRedirectionService MerchantRedirectionService, LookupTypeService LookupTypeService, NaqelUsersService naqelUsersService,
                              IConfiguration configuration, IEmailService emailService, WalletHistoryService WalletHistoryService, PaymentResponseService PaymentResponseService,
                              MerchantCatalogService MerchantCatalogService, CategoryService CategoryService, MerchantRequestDetailsService MerchantRequestDetailsService,
                              CustomerRegistrationService CustomerRegistrationService, MerchantAccountDetailsService MerchantAccountDetailsService)
        {
            _NaqelServices = NaqelServices;
            _OrdersService = OrdersService;
            _MerchantContractService = MerchantContractService;
            _MerchantRequestService = MerchantRequestService;
            _MerchantService = MerchantService;
            _MerchantRedirectionService = MerchantRedirectionService;
            _LookupTypeService = LookupTypeService;
            _naqelUsersService = naqelUsersService;
            _configuration = configuration;
            _emailService = emailService;
            _WalletHistoryService = WalletHistoryService;
            _PaymentResponseService = PaymentResponseService;
            _MerchantCatalogService = MerchantCatalogService;
            _CategoryService = CategoryService;
            _MerchantRequestDetailsService = MerchantRequestDetailsService;
            _CustomerRegistrationService = CustomerRegistrationService;
             _MerchantAccountDetailsService = MerchantAccountDetailsService;
        }
        [HttpPost, Route("TraceByWaybill")]
        [TransactionFilter]
        public async Task<IActionResult> TraceByWaybill([FromBody] TraceByWaybillDto TraceByWaybillDto)
        {
            try
            {

                Tracking[] TraceByWaybillResponse = new Tracking[0];
                return Ok(TraceByWaybillResponse);
                //await _NaqelServices.TraceByWaybillNoDetails(TraceByWaybillDto);
                //if (TraceByWaybillResponse.Length > 0)
                //{
                //    return Ok(TraceByWaybillResponse);
                //}
                //else
                //{
                //    return BadRequest(new GenericResultDto<string> { Result = "There is no information on the Waybill, Please try again later" });
                //}
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }

        }
        [HttpGet, Route("getAllOrders"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                var _getCustomerOrders = _OrdersService.GetAllDetails();

                if (_getCustomerOrders.Count > 0)
                {
                    foreach (var CustomerOrders in _getCustomerOrders)
                    {
                        decimal OrderWalletPayment = 0.0m;
                        decimal OrderPayment = 0.0m;
                        OrderWalletPayment = await _WalletHistoryService.GetOrderHistory(CustomerOrders.OrderID);
                        OrderPayment = await _PaymentResponseService.GetOrderPayment(CustomerOrders.OrderID);
                        if (CustomerOrders.COD == "Y")
                        {
                            CustomerOrders.PaidbyWallet = OrderWalletPayment;
                            CustomerOrders.Paidbycard = OrderPayment;
                            CustomerOrders.PaidatMerchant = 0.0m;

                            if (OrderWalletPayment < 0)
                            {
                                CustomerOrders.PaidbyWallet = Decimal.Negate(OrderWalletPayment);
                            }
                            else
                            {
                                CustomerOrders.PaidbyWallet = OrderWalletPayment;
                            }
                            if (OrderPayment < 0)
                            {
                                CustomerOrders.Paidbycard = Decimal.Negate(OrderPayment);
                            }
                            else
                            {
                                CustomerOrders.Paidbycard = OrderPayment;
                            }
                        }
                        else if (CustomerOrders.COD == "N")
                        {
                            CustomerOrders.PaidbyWallet = 0.0m;
                            CustomerOrders.Paidbycard = 0.0m;
                            CustomerOrders.PaidatMerchant = OrderPayment;
                            if (OrderPayment < 0)
                            {
                                CustomerOrders.PaidbyWallet = Decimal.Negate(OrderPayment);
                            }
                            else
                            {
                                CustomerOrders.PaidbyWallet = OrderPayment;
                            }
                        }

                    }

                    return Ok(_getCustomerOrders);
                }
                else
                {
                    return Ok(_getCustomerOrders);
                }

            }
            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        // GET: api/<controller>
        [HttpPost, Route("getMerchantRequests"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> getMerchantRequest([FromBody]NaqelRequestDto NaqelRequestDto)
        {
            try
            {
                var _getMerchantRequestlist = await _MerchantRequestService.GetRequestDetails(NaqelRequestDto);
                if (_getMerchantRequestlist.Count > 0)
                {

                    return Ok(_getMerchantRequestlist);
                }

                return Ok(_getMerchantRequestlist);

            }
            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        [HttpPost, Route("updateMerchantRequest"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> updateMerchantRequest([FromBody]ModifyMerchantRequestDto ModifyMerchantRequestDto)
        {
            try
            {
                await _MerchantRequestService.UpdateRequestDetails(ModifyMerchantRequestDto.RequestID, ModifyMerchantRequestDto.ApprovalStatus, ModifyMerchantRequestDto.Description, ModifyMerchantRequestDto.RequestAssignee,"");
                await _MerchantRequestDetailsService.InsertMerchantRequestDetails(ModifyMerchantRequestDto.RequestID, ModifyMerchantRequestDto.ApprovalStatus, ModifyMerchantRequestDto.Description, ModifyMerchantRequestDto.RequestAssignee);
                await _MerchantService.UpdateRequestDetails(ModifyMerchantRequestDto);

                if (ModifyMerchantRequestDto.ApprovalStatusdesc == "Approved")
                {
                    int Merchantid = await _MerchantAccountDetailsService.GetMerchantContractNumberDetails(ModifyMerchantRequestDto.MerchantID);
                    if(Merchantid >0 )
                    {
                        await _MerchantAccountDetailsService.UpdateMerchantContractNumberDetails(ModifyMerchantRequestDto.MerchantID, ModifyMerchantRequestDto.MerchantContractNumber);
                    }
                    else
                    {
                        await _MerchantAccountDetailsService.InsertMerchantContractNumberDetails(ModifyMerchantRequestDto.MerchantID, ModifyMerchantRequestDto.MerchantContractNumber);
                    }
                    var Merchantdetails = await _MerchantService.GetMerchantDetailswithid(ModifyMerchantRequestDto.MerchantID);
                    string strURL = _configuration["LoginUrl:LoginURL"];
                    string Message = "<table width='100%'><tr><td> Dear " + ModifyMerchantRequestDto.MerchantName + ",</td></tr><tr><td style='padding: 10px 0 10px 0;'>This is to inform you that your Dunyana account is approved, Click <a href=" + strURL + " >here</a> to login Dunyana account.</td></tr><tr><td  style='padding: 10px 0 10px 0;'>  For any clarifications you may write us your queries at <a href='mailto:Support@Dunyana.com' target='_blank' rel='noopener'>Support@Dunyana.com</a> </td></tr><tr><td  style='padding: 15px 0 15px 0;'> Regards,<br /> Dunyana</td></tr></table>";
                    await _emailService.SendEmail(Merchantdetails.Email, "Dunyana Account Activation", Message);
                }
                return Ok(new GenericResultDto<string> { Result = "MerchantRequest successfully updated" });

            }
            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }

        // GET: api/<controller>
        [HttpGet, Route("getMerchantRedirectionlist/{Merchant}"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> getMerchantRedirectionlist(string Merchant)
        {
            try
            {
                var _getMerchantRedirectionlist = await _MerchantRedirectionService.getMerchantRedirectionlist(Merchant);
                if (_getMerchantRedirectionlist.Count > 0)
                {

                    return Ok(_getMerchantRedirectionlist);
                }

                return Ok(_getMerchantRedirectionlist);

            }
            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        // GET: api/<controller>
        [HttpGet, Route("getMerchantApprovalstatus"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> getMerchantApprovalstatus()
        {
            try
            {
                var getMerchantApprovalstatus = await _LookupTypeService.GetLookupType("ApprovalStatus");
                if (getMerchantApprovalstatus.Count > 0)
                {

                    return Ok(getMerchantApprovalstatus);
                }

                return Ok(getMerchantApprovalstatus)
;

            }
            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        [HttpPost, Route("updateNaqelUser"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> updateNaqelUser(NaqelUsersDto NaqelUsersDto)
        {
            try
            {

                Guid strMerchantImagesID = Guid.NewGuid();
                strMerchantImages = _configuration["FilePath:ImagePath"] + "NaqelUsersImages/";
                if (!String.IsNullOrEmpty(NaqelUsersDto.Image))
                {
                    if (NaqelUsersDto.Image.Substring(NaqelUsersDto.Image.Length - 3) != "jpg")
                    {
                        if (!String.IsNullOrEmpty(NaqelUsersDto.Image))
                        {
                            if (!Directory.Exists(strMerchantImages))
                                Directory.CreateDirectory(strMerchantImages);
                            Byte[] imageByteData = Convert.FromBase64String(NaqelUsersDto.Image);
                            var fs = new BinaryWriter(new FileStream(strMerchantImages + strMerchantImagesID + ".jpg", FileMode.Create, FileAccess.Write));
                            fs.Write(imageByteData);
                            fs.Close();
                            NaqelUsersDto.Image = strMerchantImagesID + ".jpg";
                        }
                    }
                    else
                    {
                        NaqelUsersDto.Image = Path.GetFileName(NaqelUsersDto.Image);
                    }
                }
                else
                {
                    NaqelUsersDto.Image = "";
                }

                await _naqelUsersService.UpdateNaqelUserRegistrationDetails(NaqelUsersDto);
                return Ok(new GenericResultDto<string> { Result = "NaqelUser updated successfully", ReFirstName = NaqelUsersDto.FirstName, ReEmail = NaqelUsersDto.Email });
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        // GET: api/<controller>
        [HttpGet, Route("getCustomerWalletBalance"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> getCustomerWalletBalance()
        {
            try
            {
                var getCustomerwalletdetails = await _CustomerRegistrationService.getCustomerwallet();
                if (getCustomerwalletdetails.Count > 0)
                {

                    return Ok(getCustomerwalletdetails);
                }

                return BadRequest(new GenericResultDto<string> { Result = "Present there is no customers" });

            }
            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
    }
}

using Checkout;
using Checkout.Payments;
using Dunyana.Domain.Models;
using Dunyana.Dto;
using Dunyana.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Dunyana.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Dunyana.Domain.Enums;
using System.Linq;
using System.Collections.Generic;
using Dunyana.Core;

namespace Dunyana.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class PaymentController : Controller
    {
        private readonly ICheckoutApi _checkoutApi;
        private readonly ISerializer _serializer;
        private readonly WalletHistoryService _walletHistoryService;
        private readonly UsersService _usersService;
        private readonly AppSettings _appSettings;
        private readonly PaymentCardsService _paymentCardsService;
        private readonly PaymentResponseService _paymentResponseService;
        private readonly CustomerRegistrationService _customerService;

        public PaymentController(ICheckoutApi checkoutApi, ISerializer serializer,
            WalletHistoryService walletHistoryService, UsersService usersService, IOptions<AppSettings> appSettings,
            PaymentCardsService paymentCardsService,
            PaymentResponseService paymentResponseService, CustomerRegistrationService customerService)
        {
            _checkoutApi = checkoutApi ?? throw new ArgumentNullException(nameof(checkoutApi));
            _serializer = serializer ?? throw new ArgumentNullException(nameof(serializer));
            _walletHistoryService = walletHistoryService;
            _usersService = usersService;
            _appSettings = appSettings.Value;
            _paymentCardsService = paymentCardsService;
            _paymentResponseService = paymentResponseService;
            _customerService = customerService;
        }


        [HttpPost, Route("postPayment")]
        [AllowAnonymous]
        //  [ValidateAntiForgeryToken]
        public async Task<IActionResult> PostPayment(PaymentModel model)
        {
            try
            {
                
               
                var user = _usersService.GetUser(model.CustomerId).Result;
                bool isMada = false;
                #region Check for Mada

                CardBinHelper cardBinHelper = new CardBinHelper();
                IList<string> binValues = new List<string>();
                binValues = cardBinHelper.GetMadaCardBins();

                var isFound = binValues.Where(b => b == model.CardBin).FirstOrDefault();
                if(isFound !=null)
                {
                    isMada = true;
                }

                #endregion
                #region Source - user existing card 

                if (model.isExistingCard.Value)
                {
                    if (string.IsNullOrWhiteSpace(model.CVV))
                        return Ok(new GenericResultDto<string> { Result = "Please enter cvv" });
                    GetPaymentCardsDto paymentCardsDto = _paymentCardsService.GetPaymentCardInfo(model.PaymentCardId.Value);

                    var source = new SourceInfo(paymentCardsDto.CardSourceId, model.CVV);

                    var sourceRequest = new PaymentRequest<SourceInfo>(source, model.Currency, Convert.ToInt32(model.Amount))
                    {
                        Capture = model.Capture,
                        Reference = model.Reference,
                        ThreeDS = false,//model.DoThreeDS,
                        Customer = new Checkout.Payments.CustomerRequest
                        {
                            Email = user.Username,
                            Id = paymentCardsDto.CardCustomerId,
                            Name = user.CustomerRegistration.FirstName + " " + user.CustomerRegistration.LastName
                        }

                    };
                    var sourceResponse = await _checkoutApi.Payments.RequestAsync(sourceRequest);
                    //if (sourceResponse.Payment.Approved)
                    //{
                    //    await _walletHistoryService.InsertWalletHistory(new WalletHistoryDto
                    //    {
                    //        CustomerID = model.CustomerId,
                    //        Status = 1,
                    //        Transaction = model.Currency,
                    //        TransactionAmount = model.Amount,
                    //        TransactionDate = System.DateTime.Now,
                    //        TransactionDescription = model.Reference,
                    //        Type = "CC"

                    //    });
                    //}
                    if(!string.IsNullOrEmpty(sourceResponse.Payment.ResponseCode))
                    sourceResponse.Payment.ResponseSummary = new PaymentStatusCodes().GetPaymentStatus(sourceResponse.Payment.ResponseCode);
                
                    return Ok(sourceResponse);
                }
                #endregion

               else
               {
                   
                    if (string.IsNullOrWhiteSpace(model.CardToken))
                        throw new ArgumentException("Model", $"{nameof(model.CardToken)} is missing.");

                    var tokenSource = new TokenSource(model.CardToken);
                    var metaData = new Dictionary<string, object>();
                    metaData.Add("udf1", "mada");  
                    var paymentRequest = new PaymentRequest<TokenSource>(tokenSource, model.Currency, Convert.ToInt32(model.Amount))
                    {
                       // Capture = model.Capture,
                        Reference = model.Reference,
                        ThreeDS = new ThreeDSRequest { Enabled = model.DoThreeDS, AttemptN3D = true },
                        Customer = new Checkout.Payments.CustomerRequest
                        {
                            Email = user.Username,
                         //   Id = user.GUID,
                            Name = user.CustomerRegistration.FirstName + " " + user.CustomerRegistration.LastName
                        } 
                    };
                if (isMada)
                {
                      
                    paymentRequest.Metadata = metaData;
                }
                    var response = await _checkoutApi.Payments.RequestAsync(paymentRequest);
                    if (model.SaveCard)
                    {
                        PaymentCardsDto paymentCardsDto = new PaymentCardsDto();
                        StoreCard(paymentCardsDto);
                    }
                    if (response.IsPending && response.Pending.RequiresRedirect())
                    {
                        //await _walletHistoryService.InsertWalletHistory(new WalletHistoryDto
                        //{
                        //    CustomerID = model.CustomerId,
                        //    Status = 1,
                        //    Transaction = model.Currency,
                        //    TransactionAmount = model.Amount,
                        //    TransactionDate = System.DateTime.Now,
                        //    TransactionDescription = model.Reference,
                        //    Type = "CC"

                        //});
                        return Ok(response);
                    }



                    //if (response.Payment.Approved)
                    //{
                    //    await _walletHistoryService.InsertWalletHistory(new WalletHistoryDto
                    //    {
                    //        CustomerID = model.CustomerId,
                    //        Status = 1,
                    //        Transaction = model.Currency,
                    //        TransactionAmount = model.Amount,
                    //        TransactionDate = System.DateTime.Now,
                    //        TransactionDescription = model.Reference,
                    //        Type = "CC"

                    //    });

                    //}
                    return Ok(response);
                }
                
            }
            catch(CheckoutValidationException validateEx)
            {
                Checkout.Payments.PaymentResponse response = new Checkout.Payments.PaymentResponse();
                response.Payment = null;
                return Ok(new PaymentResultDto<Checkout.Payments.PaymentResponse> { Result = response ,
                Message = validateEx.Message +  "Invalid CVV"
                });
            }
            catch (Exception ex)
            {                
                return Ok(new GenericResultDto<string> { Result = ex.Message });
                
            } 
        }
        private void StoreCard(PaymentCardsDto paymentCardsDto)
        {

        }
        private void StoreModelInTempData(PaymentModel model)
        {

            TempData[nameof(PaymentModel)] = _serializer.Serialize(model);
        }

        [HttpGet,Route("threeDSSuccess"), Authorize(AuthenticationSchemes = "Bearer")]
        public Task<IActionResult> ThreeDSSuccess([FromQuery(Name = "cko-session-id")] string ckoSessionId)
                        => GetThreeDsPaymentAsync(ckoSessionId);
        private void StorePaymentInTempData(PaymentProcessed payment)
        {
            ViewData[nameof(PaymentProcessed)] = _serializer.Serialize(payment);
        }
        private async Task<IActionResult> GetThreeDsPaymentAsync(string sessionId)
        {       
            GetPaymentResponse payment = await _checkoutApi.Payments.GetAsync(sessionId);
            //if (payment.Approved)
            //{ 
            //    return Redirect(_appSettings.ClientURL + "customer/payment-success");
            //}
            //else
            //{
            //    return Redirect(_appSettings.ClientURL + "customer/payment-failure");
            //}         
            if(!payment.Approved)
            {
                if (payment.Actions != null)
                {
                    List<Checkout.Payments.PaymentActionSummary> paymentActionSummaries =
                                        payment.Actions.ToList();

                    if (!string.IsNullOrEmpty(paymentActionSummaries[0].ResponseCode))
                        paymentActionSummaries[0].ResponseSummary = new PaymentStatusCodes().GetPaymentStatus(paymentActionSummaries[0].ResponseCode);
                }
            }

            if (payment.Approved)
            {
                CustomerRegistration customer = _customerService.GetCustomerwithEmail(
                    ((Checkout.Payments.CustomerResponse)payment.Customer).Email);

              await  _paymentResponseService.InsertPaymentDetails(new PaymentResponseDto {
                  Amount = Convert.ToDecimal(payment.Amount),
                  Cardscheme = ((Checkout.Payments.CardSourceResponse) payment.Source).Scheme,
                  Currency = payment.Currency,
                  CardType = ((Checkout.Payments.CardSourceResponse)payment.Source).CardType,
                  PaymentCustomerId = ((Checkout.Payments.CustomerResponse)payment.Customer).Id,
                  PaymentSourceId = ((Checkout.Payments.CardSourceResponse)payment.Source).Id,
                  TransactionId = payment.Id,
                  PaymentDate = payment.RequestedOn,
                  PaymentStatus = "Approved",
                  CustomerId = customer.Id,
                  Card = Convert.ToInt32(((Checkout.Payments.CardSourceResponse)payment.Source).Last4),
                  TransactionType = ((Checkout.Payments.CardSourceResponse)payment.Source).Type,
                  OrderId = 0

              });

            }
            return Ok(payment);
        }

    }

}
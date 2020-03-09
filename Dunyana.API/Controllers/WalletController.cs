using Dunyana.API.Filters;
using Dunyana.Dto;
using Dunyana.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Checkout.Payments;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace Dunyana.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class WalletController : ControllerBase
    {
        private readonly WalletHistoryService _WalletHistoryService;
        private readonly UsersService _UsersService;
        private readonly PaymentCardsService _paymentCardsService;
        public WalletController(WalletHistoryService WalletHistoryService, UsersService UsersService,
            PaymentCardsService paymentCardsService)
        {
            _WalletHistoryService = WalletHistoryService;
            _UsersService = UsersService;
            _paymentCardsService = paymentCardsService;
        }
        [HttpGet, Route("GetWalletHistory/{CustomerID}"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> Get(string CustomerID)
        {
            try
            {
                var getCustomerID = await _UsersService.getCustomerID(CustomerID);
                var _getWalletHistory =await _WalletHistoryService.GetAll(getCustomerID);           
                return Ok(_getWalletHistory);
            }
            catch (Exception err)
            {

                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        [HttpPost, Route("InsertWalletHistory"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> InsertWalletHistory([FromBody] WalletHistoryDto walletHistoryDto)
        {
            try
            {
                if (walletHistoryDto.isExistingCard.Value)
                {
                    Checkout.Payments.PaymentResponse paymentResponse = walletHistoryDto.PaymentResponseSource;
                    walletHistoryDto.Transaction = paymentResponse.Payment.Id;
                    walletHistoryDto.TransactionDescription = ((Checkout.Payments.CardSourceResponse)paymentResponse.Payment.Source).Scheme
                        + "****" + ((Checkout.Payments.CardSourceResponse)paymentResponse.Payment.Source).Last4;
                }
                else
                {
                    if (walletHistoryDto.SourceId != null)
                    {
                        Checkout.Payments.GetPaymentResponse payment = walletHistoryDto.SourceId;
                        if (walletHistoryDto.SaveCard)
                        {
                            var customerID = await _UsersService.getCustomerID(walletHistoryDto.CustomerID);
                            List<GetPaymentCardsDto> paymentCards = _paymentCardsService.GetPaymentByCustomer(walletHistoryDto.CustomerID);
                            var itemExists = paymentCards.Find(p => p.CardType == ((Checkout.Payments.CardSourceResponse)payment.Source).Scheme
                            && p.Expyear == Convert.ToInt32(((Checkout.Payments.CardSourceResponse)payment.Source).ExpiryYear)
                            && p.Expmonth == Convert.ToInt32(((Checkout.Payments.CardSourceResponse)payment.Source).ExpiryMonth)
                            && p.last4digits == Convert.ToInt32(((Checkout.Payments.CardSourceResponse)payment.Source).Last4)
                            );
                            if (itemExists == null)
                            {
                                await _paymentCardsService.InsertPaymentCards(
                                    new PaymentCardsDto
                                    {
                                        CardCustomerId = ((Checkout.Payments.CustomerResponse)payment.Customer).Id,
                                        CardSourceId = ((Checkout.Payments.CardSourceResponse)payment.Source).Id,
                                        CardType = ((Checkout.Payments.CardSourceResponse)payment.Source).Scheme,
                                        CustomerId = customerID,
                                        Expyear = Convert.ToInt32(((Checkout.Payments.CardSourceResponse)payment.Source).ExpiryYear),
                                        Expmonth = Convert.ToInt32(((Checkout.Payments.CardSourceResponse)payment.Source).ExpiryMonth),
                                        last4digits = Convert.ToInt32(((Checkout.Payments.CardSourceResponse)payment.Source).Last4)
                                    }
                                );
                            }
                        }
                        walletHistoryDto.Transaction = payment.Id;
                        walletHistoryDto.TransactionDescription = ((Checkout.Payments.CardSourceResponse)payment.Source).Scheme
                            + "****" + ((Checkout.Payments.CardSourceResponse)payment.Source).Last4;

                    }
                }
                await _WalletHistoryService.InsertWalletHistory(walletHistoryDto);
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
            return Ok(new GenericResultDto<string> { Result = "Insert successfully" });
        }
        [HttpGet, Route("getPaymentCards/{CustomerID}"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> GetPaymentCards(string CustomerID)
        {
            try
            {

                List<GetPaymentCardsDto> paymentCards =  _paymentCardsService.GetPaymentByCustomer(CustomerID);
                return Ok(paymentCards);
            }
            catch (Exception err)
            {

                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
    }
 
}
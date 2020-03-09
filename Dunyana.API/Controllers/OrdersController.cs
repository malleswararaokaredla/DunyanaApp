using Dunyana.API.Filters;
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
    public class OrdersController : ControllerBase
    {
        private readonly OrdersService _OrdersService;
        private readonly OrdersAddressService _OrdersAddressService;
        private readonly OrdersDetailsService _OrdersDetailsService;
        private readonly PaymentResponseService _PaymentResponseService;
        private readonly UsersService _UsersService;
        private readonly IConfiguration _configuration;
        private readonly PaymentCardsService _paymentCardsService;
        private readonly WalletHistoryService _WalletHistoryService;
        private readonly WayBillService _WayBillService;
        string strImagePath = string.Empty;
        string strMerchantImages = string.Empty;
        public OrdersController(OrdersService OrdersService, OrdersAddressService OrdersAddressService,
            OrdersDetailsService OrdersDetailsService, UsersService UsersService, IConfiguration configuration, WayBillService WayBillService,
            PaymentResponseService PaymentResponseService, PaymentCardsService paymentCardsService, WalletHistoryService WalletHistoryService)
        {
            _OrdersService = OrdersService;
            _OrdersAddressService = OrdersAddressService;
            _OrdersDetailsService = OrdersDetailsService;
            _PaymentResponseService = PaymentResponseService;
            _UsersService = UsersService;
            _configuration = configuration;
            _paymentCardsService = paymentCardsService;
            _WalletHistoryService = WalletHistoryService;
            _WayBillService = WayBillService;
        }

        // GET: api/<controller>
        /// <summary>
        /// Returns the details of the logged in user orders ( Customer).
        /// </summary>
        /// <param name="CustomerID"></param>
        /// <remarks>CustomerID is required.</remarks>        
        /// <returns>A task that upon completion contains the customer orders.</returns>
        [Authorize(Roles = Role.Customer)]
        [HttpGet, Route("GetOrders/{CustomerID}"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> Get(string CustomerID)
        {
            try
            {
                string Username = await _UsersService.getGUID(CustomerID);
                var _CustomerOrders = await _OrdersService.GetAll(Username);
                strImagePath = _configuration["FilePath:ImagePath"] + "OrderImage/";
                string strServerURL = _configuration["FilePath:ServerURL"] + "OrderImage/";
                strMerchantImages = _configuration["FilePath:ImagePath"] + "MerchantImages/";
                string strMerchantServerURL = _configuration["FilePath:ServerURL"] + "MerchantImages/";
                if (_CustomerOrders.Count > 0)
                {
                    for (int i = 0; i < _CustomerOrders.Count(); i++)
                    {

                        foreach (var returnlist in _CustomerOrders[i].Products)
                        {
                            if (System.IO.File.Exists(strImagePath + _CustomerOrders[i].OrderID + "/" + returnlist.ProductImage))
                            {
                                //byte[] imageBytes = System.IO.File.ReadAllBytes("OrderImage/" + _types[i].Id + "/" + returnlist.ProductImage);
                                //string base64String = Convert.ToBase64String(imageBytes);
                                returnlist.ProductImage = strServerURL + _CustomerOrders[i].OrderID + "/" + returnlist.ProductImage;
                            }
                            else
                            {
                                returnlist.ProductImage = "";
                            }
                          
                        }
                        if (System.IO.File.Exists(strMerchantImages +_CustomerOrders[i].MerchantImage))
                        {
                            //byte[] imageBytes = System.IO.File.ReadAllBytes("OrderImage/" + _types[i].Id + "/" + returnlist.ProductImage);
                            //string base64String = Convert.ToBase64String(imageBytes);
                            _CustomerOrders[i].MerchantImage = strMerchantServerURL + _CustomerOrders[i].MerchantImage;
                        }
                        else
                        {
                            _CustomerOrders[i].MerchantImage = "";
                        }
                    }
                    return Ok(_CustomerOrders);
                }
                else
                {
                    return Ok(_CustomerOrders);
                }

            }
            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }


        [HttpPost, Route("InsertOrders")]
        [TransactionFilter]
        public async Task<IActionResult> OrdersDetails([FromBody]MerchantResponseDto MerchantReposesDto)
        {
            try
            {
                var _checkLoginAuthentication = await _UsersService.LoginAuthenticate(new CustomerRegistrationDto
                {
                    Email = MerchantReposesDto.MerchantUserName
                });
                if (_checkLoginAuthentication != null)
                {
                    if (EncryptionHelper.Decrypt(_checkLoginAuthentication.PWD) == MerchantReposesDto.MerchantPassword)
                    {
                        strImagePath = _configuration["FilePath:ImagePath"] + "OrderImage/";

                        for (int i = 0; i < MerchantReposesDto.OrderDetails.Count(); i++)
                        {
                            GetOrderDetailsDto objGetOrderDetails = new GetOrderDetailsDto();
                            if (MerchantReposesDto.MerchantID > 0 && MerchantReposesDto.CustomerID > 0)
                            {
                                var Checkorders = _OrdersService.CheckOrderDetails(MerchantReposesDto.OrderDetails[i].OrderNo);
                                if (Checkorders.Count == 0)
                                {
                                    if (MerchantReposesDto.OrderDetails[i].COD != "")
                                    {
                                        if (MerchantReposesDto.OrderDetails[i].COD == "Y")
                                        {
                                            int OrderId = 0;
                                            objGetOrderDetails.OrderNo = MerchantReposesDto.OrderDetails[i].OrderNo;
                                            objGetOrderDetails.OrderDate = MerchantReposesDto.OrderDetails[i].OrderDate;
                                            objGetOrderDetails.OrderAmount = MerchantReposesDto.OrderDetails[i].OrderAmount;
                                            objGetOrderDetails.CurrenyCode = MerchantReposesDto.OrderDetails[i].CurrenyCode;
                                            objGetOrderDetails.COD = MerchantReposesDto.OrderDetails[i].COD;
                                            objGetOrderDetails.OrderStatus = MerchantReposesDto.OrderDetails[i].OrderStatus;
                                            objGetOrderDetails.CustomerID = MerchantReposesDto.CustomerID;
                                            objGetOrderDetails.MerchantID = MerchantReposesDto.MerchantID;
                                            await _OrdersService.InsertOrder(objGetOrderDetails);

                                            var getOrderId = _OrdersService.OrderId(objGetOrderDetails);

                                            OrderId = Convert.ToInt32(getOrderId.Id);
                                            objGetOrderDetails.ConsigneeAddressLine1 = MerchantReposesDto.OrderDetails[i].ConsigneeAddressLine1;
                                            objGetOrderDetails.ConsigneeAddressLine2 = MerchantReposesDto.OrderDetails[i].ConsigneeAddressLine2;
                                            objGetOrderDetails.ConsigneeAddressCity = MerchantReposesDto.OrderDetails[i].ConsigneeAddressCity;
                                            objGetOrderDetails.ConsigneeAddressState = MerchantReposesDto.OrderDetails[i].ConsigneeAddressState;
                                            objGetOrderDetails.ConsigneeAddressCountry = MerchantReposesDto.OrderDetails[i].ConsigneeAddressCountry;
                                            objGetOrderDetails.ConsigneeAddresszip = MerchantReposesDto.OrderDetails[i].ConsigneeAddresszip;
                                            objGetOrderDetails.ConsigneeAddressMobileNo = MerchantReposesDto.OrderDetails[i].ConsigneeAddressMobileNo;
                                            objGetOrderDetails.ConsigneeAddressPhone = MerchantReposesDto.OrderDetails[i].ConsigneeAddressPhone;
                                            objGetOrderDetails.Latitude = MerchantReposesDto.OrderDetails[i].Latitude;
                                            objGetOrderDetails.Longitude = MerchantReposesDto.OrderDetails[i].Longitude;

                                            await _OrdersAddressService.InsertOrderAddress(objGetOrderDetails, OrderId);

                                            for (int L = 0; L < MerchantReposesDto.OrderDetails[i].Waybill.Count(); L++)
                                            {
                                                await _WayBillService.InsertWayBill(OrderId, MerchantReposesDto.OrderDetails[i].Waybill[L].WaybillNo);
                                                int getWayBillId = await _WayBillService.GetWayBillId(OrderId, MerchantReposesDto.OrderDetails[i].Waybill[L].WaybillNo);

                                                for (int K = 0; K < MerchantReposesDto.OrderDetails[i].Waybill[L].Products.Count(); K++)
                                                {
                                                    if (MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductID > 0)
                                                    {
                                                        Guid Imagguid = Guid.NewGuid();
                                                        ProductDetailsDto objProductDetailsDto = new ProductDetailsDto();
                                                        objProductDetailsDto.ProductSKU = MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductSKU;
                                                        if (MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductImage.Substring(MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductImage.Length - 3) != "jpg" && MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductImage.Substring(MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductImage.Length - 3) != "png")
                                                        {
                                                            if (!String.IsNullOrEmpty(MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductImage))
                                                            {
                                                                if (!Directory.Exists(strImagePath + getOrderId.Id))
                                                                    Directory.CreateDirectory(strImagePath + getOrderId.Id);
                                                                Byte[] imageByteData = Convert.FromBase64String(MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductImage);
                                                                var fs = new BinaryWriter(new FileStream(strImagePath + getOrderId.Id + "/" + Imagguid + ".jpg", FileMode.Create, FileAccess.ReadWrite));
                                                                fs.Write(imageByteData);
                                                                fs.Close();
                                                            }
                                                            objProductDetailsDto.ProductImage = Imagguid + ".jpg";
                                                        }
                                                        objProductDetailsDto.ProductImage = MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductImage;
                                                        objProductDetailsDto.ProductName = MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductName;
                                                        objProductDetailsDto.Description = MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].Description;
                                                        objProductDetailsDto.Quantity = MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].Quantity;
                                                        objProductDetailsDto.UnitCost = MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].UnitCost;
                                                        objProductDetailsDto.CurrenyCode = MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].CurrenyCode;
                                                        objProductDetailsDto.Returndate = MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].Returndate;

                                                        await _OrdersDetailsService.InsertProductDetails(getWayBillId, Convert.ToInt32(getOrderId.Id), objProductDetailsDto);
                                                    }
                                                }
                                            }
                                        }
                                        else
                                        {

                                            if (!string.IsNullOrEmpty(MerchantReposesDto.OrderDetails[i].PaymentDetails[0].TransactionId)
                                                && !string.IsNullOrEmpty(MerchantReposesDto.OrderDetails[i].PaymentDetails[0].TransactionType)
                                                && MerchantReposesDto.OrderDetails[i].PaymentDetails[0].Amount > 0)
                                            {
                                                int OrderId = 0;
                                                objGetOrderDetails.OrderNo = MerchantReposesDto.OrderDetails[i].OrderNo;
                                                objGetOrderDetails.OrderDate = MerchantReposesDto.OrderDetails[i].OrderDate;
                                                objGetOrderDetails.OrderAmount = MerchantReposesDto.OrderDetails[i].OrderAmount;
                                                objGetOrderDetails.CurrenyCode = MerchantReposesDto.OrderDetails[i].CurrenyCode;
                                                objGetOrderDetails.COD = MerchantReposesDto.OrderDetails[i].COD;
                                                objGetOrderDetails.OrderStatus = MerchantReposesDto.OrderDetails[i].OrderStatus;
                                                objGetOrderDetails.CustomerID = MerchantReposesDto.CustomerID;
                                                objGetOrderDetails.MerchantID = MerchantReposesDto.MerchantID;
                                                await _OrdersService.InsertOrder(objGetOrderDetails);

                                                var getOrderId = _OrdersService.OrderId(objGetOrderDetails);

                                                OrderId = Convert.ToInt32(getOrderId.Id);
                                                objGetOrderDetails.ConsigneeAddressLine1 = MerchantReposesDto.OrderDetails[i].ConsigneeAddressLine1;
                                                objGetOrderDetails.ConsigneeAddressLine2 = MerchantReposesDto.OrderDetails[i].ConsigneeAddressLine2;
                                                objGetOrderDetails.ConsigneeAddressCity = MerchantReposesDto.OrderDetails[i].ConsigneeAddressCity;
                                                objGetOrderDetails.ConsigneeAddressState = MerchantReposesDto.OrderDetails[i].ConsigneeAddressState;
                                                objGetOrderDetails.ConsigneeAddressCountry = MerchantReposesDto.OrderDetails[i].ConsigneeAddressCountry;
                                                objGetOrderDetails.ConsigneeAddresszip = MerchantReposesDto.OrderDetails[i].ConsigneeAddresszip;
                                                objGetOrderDetails.ConsigneeAddressMobileNo = MerchantReposesDto.OrderDetails[i].ConsigneeAddressMobileNo;
                                                objGetOrderDetails.ConsigneeAddressPhone = MerchantReposesDto.OrderDetails[i].ConsigneeAddressPhone;
                                                objGetOrderDetails.Latitude = MerchantReposesDto.OrderDetails[i].Latitude;
                                                objGetOrderDetails.Longitude = MerchantReposesDto.OrderDetails[i].Longitude;

                                                await _OrdersAddressService.InsertOrderAddress(objGetOrderDetails, OrderId);
                                                for (int L = 0; L < MerchantReposesDto.OrderDetails[i].Waybill.Count(); L++)
                                                {
                                                    await _WayBillService.InsertWayBill(OrderId, MerchantReposesDto.OrderDetails[i].Waybill[L].WaybillNo);
                                                    int getWayBillId = await _WayBillService.GetWayBillId(OrderId, MerchantReposesDto.OrderDetails[i].Waybill[L].WaybillNo);
                                                    for (int K = 0; K < MerchantReposesDto.OrderDetails[i].Waybill[L].Products.Count(); K++)
                                                    {
                                                        if (MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductID > 0)
                                                        {
                                                            Guid ImagNonCODguid = Guid.NewGuid();
                                                            ProductDetailsDto objProductDetailsDto = new ProductDetailsDto();
                                                            objProductDetailsDto.ProductSKU = MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductSKU;
                                                            if (MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductImage.Substring(MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductImage.Length - 3) != "jpg" && MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductImage.Substring(MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductImage.Length - 3) != "png")
                                                            {
                                                                if (!String.IsNullOrEmpty(MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductImage))
                                                                {
                                                                    if (!Directory.Exists(strImagePath + getOrderId.Id))
                                                                        Directory.CreateDirectory(strImagePath + getOrderId.Id);
                                                                    Byte[] imageByteData = Convert.FromBase64String(MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductImage);
                                                                    var fs = new BinaryWriter(new FileStream(strImagePath + getOrderId.Id + "/" + ImagNonCODguid + ".jpg", FileMode.Create, FileAccess.ReadWrite));
                                                                    fs.Write(imageByteData);
                                                                    fs.Close();
                                                                }
                                                                objProductDetailsDto.ProductImage = ImagNonCODguid + ".jpg";
                                                            }
                                                            objProductDetailsDto.ProductImage = MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductImage;
                                                            objProductDetailsDto.ProductName = MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].ProductName;
                                                            objProductDetailsDto.Description = MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].Description;
                                                            objProductDetailsDto.Quantity = MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].Quantity;
                                                            objProductDetailsDto.UnitCost = MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].UnitCost;
                                                            objProductDetailsDto.CurrenyCode = MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].CurrenyCode;
                                                            objProductDetailsDto.Returndate = MerchantReposesDto.OrderDetails[i].Waybill[L].Products[K].Returndate;
                                                            await _OrdersDetailsService.InsertProductDetails(getWayBillId, Convert.ToInt32(getOrderId.Id), objProductDetailsDto);
                                                        }
                                                    }
                                                }

                                                for (int M = 0; M < MerchantReposesDto.OrderDetails[i].PaymentDetails.Count(); M++)
                                                {
                                                    Guid Imagguid = Guid.NewGuid();
                                                    PaymentResponseWithoutRequiredDto objPaymentDto = new PaymentResponseWithoutRequiredDto();
                                                    objPaymentDto.PaymentDate = MerchantReposesDto.OrderDetails[i].PaymentDetails[M].PaymentDate;
                                                    objPaymentDto.Amount = MerchantReposesDto.OrderDetails[i].PaymentDetails[M].Amount;
                                                    objPaymentDto.Currency = MerchantReposesDto.OrderDetails[i].PaymentDetails[M].Currency;
                                                    objPaymentDto.Card = MerchantReposesDto.OrderDetails[i].PaymentDetails[M].Card;
                                                    objPaymentDto.Cardscheme = MerchantReposesDto.OrderDetails[i].PaymentDetails[M].Cardscheme;
                                                    objPaymentDto.CardType = MerchantReposesDto.OrderDetails[i].PaymentDetails[M].CardType;
                                                    objPaymentDto.PaymentStatus = MerchantReposesDto.OrderDetails[i].PaymentDetails[M].PaymentStatus;
                                                    objPaymentDto.TransactionId = MerchantReposesDto.OrderDetails[i].PaymentDetails[M].TransactionId;
                                                    objPaymentDto.TransactionType = MerchantReposesDto.OrderDetails[i].PaymentDetails[M].TransactionType;
                                                    objPaymentDto.ReturnPaymentResponse = MerchantReposesDto.OrderDetails[i].PaymentDetails[M].ReturnPaymentResponse;
                                                    await _PaymentResponseService.InsertOrderPaymentDetails(objPaymentDto, OrderId, MerchantReposesDto.CustomerID);
                                                }

                                            }
                                            else
                                            {
                                                return BadRequest(new OrderResultDto<string> { Result = "Order PaymentDetails Required", ReOrderNo = MerchantReposesDto.OrderDetails[i].OrderNo });
                                            }
                                        }
                                    }
                                    else
                                    {
                                        return BadRequest(new OrderResultDto<string> { Result = "Order Required COD", ReOrderNo = MerchantReposesDto.OrderDetails[i].OrderNo });
                                    }
                                }

                                else
                                {
                                    return BadRequest(new OrderResultDto<string> { Result = "OrderNo already exsist", ReOrderNo = MerchantReposesDto.OrderDetails[i].OrderNo });
                                }
                            }
                            else if (MerchantReposesDto.MerchantID == 0)
                            {
                                return BadRequest(new OrderResultDto<string> { Result = "Invalid Merchant ID ", ReOrderNo = MerchantReposesDto.OrderDetails[i].OrderNo });
                            }
                            else if (MerchantReposesDto.CustomerID == 0)
                            {
                                return BadRequest(new OrderResultDto<string>
                                {
                                    Result = " Invalid Customer ID",
                                    ReOrderNo = MerchantReposesDto.OrderDetails[i].OrderNo
                                });
                            }
                        }
                    }
                    else
                    {
                        return BadRequest(new OrderResultDto<string> { Result = "Invalid Password" });
                    }
                }
                else
                {
                    return BadRequest(new OrderResultDto<string> { Result = "Invalid Merchant" });
                }
            }

            catch (Exception err)
            {
                return BadRequest(new OrderResultDto<string> { Result = err.Message });
            }
            return Ok(new OrderResultDto<string> { Result = "Orders created successfully" });
        }

        [HttpPost, Route("payOrder"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> PayOrder([FromBody] WalletHistoryDto walletHistoryDto)
        {
            try
            {
                var customerID = await _UsersService.getCustomerID(walletHistoryDto.CustomerID);
                if (walletHistoryDto.isExistingCard.Value)
                {
                    Checkout.Payments.PaymentResponse paymentResponse = walletHistoryDto.PaymentResponseSource;
                    string TrasnsactionId = paymentResponse.Payment.Id;
                    string TransactionDescription = ((Checkout.Payments.CardSourceResponse)paymentResponse.Payment.Source).Scheme
                        + "****" + ((Checkout.Payments.CardSourceResponse)paymentResponse.Payment.Source).Last4;


                    await _PaymentResponseService.InsertPaymentDetails(new PaymentResponseDto
                    {
                        Amount = Convert.ToDecimal(paymentResponse.Payment.Amount),
                        Cardscheme = ((Checkout.Payments.CardSourceResponse)paymentResponse.Payment.Source).Scheme,
                        Currency = paymentResponse.Payment.Currency,
                        CardType = ((Checkout.Payments.CardSourceResponse)paymentResponse.Payment.Source).CardType,
                        PaymentCustomerId = ((Checkout.Payments.CustomerResponse)paymentResponse.Payment.Customer).Id,
                        PaymentSourceId = ((Checkout.Payments.CardSourceResponse)paymentResponse.Payment.Source).Id,
                        TransactionId = paymentResponse.Payment.Id,
                        PaymentDate = paymentResponse.Payment.ProcessedOn,
                        PaymentStatus = "Approved",
                        CustomerId = customerID,
                        Card = Convert.ToInt32(((Checkout.Payments.CardSourceResponse)paymentResponse.Payment.Source).Last4),
                        TransactionType = ((Checkout.Payments.CardSourceResponse)paymentResponse.Payment.Source).Type,
                        OrderId = walletHistoryDto.OrderID.Value

                    });
                }
                else
                {
                    if (walletHistoryDto.SourceId != null)
                    {
                        Checkout.Payments.GetPaymentResponse payment = walletHistoryDto.SourceId;

                        if (walletHistoryDto.SaveCard)
                        {

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
                        string TrasnsactionId = payment.Id;
                        string TransactionDescription = ((Checkout.Payments.CardSourceResponse)payment.Source).Scheme
                            + "****" + ((Checkout.Payments.CardSourceResponse)payment.Source).Last4;

                        await _PaymentResponseService.InsertPaymentDetails(new PaymentResponseDto
                        {
                            Amount = Convert.ToDecimal(payment.Amount),
                            Cardscheme = ((Checkout.Payments.CardSourceResponse)payment.Source).Scheme,
                            Currency = payment.Currency,
                            CardType = ((Checkout.Payments.CardSourceResponse)payment.Source).CardType,
                            PaymentCustomerId = ((Checkout.Payments.CustomerResponse)payment.Customer).Id,
                            PaymentSourceId = ((Checkout.Payments.CardSourceResponse)payment.Source).Id,
                            TransactionId = payment.Id,
                            PaymentDate = payment.RequestedOn,
                            PaymentStatus = "Approved",
                            CustomerId = customerID,
                            Card = Convert.ToInt32(((Checkout.Payments.CardSourceResponse)payment.Source).Last4),
                            TransactionType = ((Checkout.Payments.CardSourceResponse)payment.Source).Type,
                            OrderId = walletHistoryDto.OrderID.Value

                        });

                    }
                }
                if (walletHistoryDto.OrderWalletPaymentAmount > 0)
                {
                    OrderPaymentDto OrderPaymentDto = new OrderPaymentDto
                    {
                        CustomerId = walletHistoryDto.CustomerID,
                        OrderAmount = walletHistoryDto.OrderWalletPaymentAmount.ToString(),
                        OrderId = walletHistoryDto.OrderID.Value.ToString()
                    };
                    await _WalletHistoryService.OrderWalletPayment(OrderPaymentDto);

                }
                await _OrdersService.UpdatePaymentStatus(Convert.ToInt32(walletHistoryDto.OrderID));
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
            return Ok(new GenericResultDto<string> { Result = "Insert successfully" });
        }
        [HttpPost, Route("mobilePayOrder"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> MobilePayOrder([FromBody] MobileWalletHistoryDto MobilewalletHistoryDto)
        {
            try
            {
                var customerID = await _UsersService.getCustomerID(MobilewalletHistoryDto.CustomerID);
                if (MobilewalletHistoryDto.isExistingCard.Value)
                {
                    Checkout.Payments.PaymentResponse paymentResponse = MobilewalletHistoryDto.PaymentResponseSource;
                    string TrasnsactionId = paymentResponse.Payment.Id;
                    string TransactionDescription = ((Checkout.Payments.MobileCardSourceResponse)paymentResponse.Payment.Source).Scheme
                        + "****" + ((Checkout.Payments.MobileCardSourceResponse)paymentResponse.Payment.Source).Last4;


                    await _PaymentResponseService.InsertPaymentDetails(new PaymentResponseDto
                    {
                        Amount = Convert.ToDecimal(paymentResponse.Payment.Amount),
                        Cardscheme = ((Checkout.Payments.MobileCardSourceResponse)paymentResponse.Payment.Source).Scheme,
                        Currency = paymentResponse.Payment.Currency,
                        CardType = ((Checkout.Payments.MobileCardSourceResponse)paymentResponse.Payment.Source).Card_Type,
                        PaymentCustomerId = ((Checkout.Payments.CustomerResponse)paymentResponse.Payment.Customer).Id,
                        PaymentSourceId = ((Checkout.Payments.MobileCardSourceResponse)paymentResponse.Payment.Source).Id,
                        TransactionId = paymentResponse.Payment.Id,
                        PaymentDate = paymentResponse.Payment.ProcessedOn,
                        PaymentStatus = "Approved",
                        CustomerId = customerID,
                        Card = Convert.ToInt32(((Checkout.Payments.MobileCardSourceResponse)paymentResponse.Payment.Source).Last4),
                        TransactionType = ((Checkout.Payments.MobileCardSourceResponse)paymentResponse.Payment.Source).Type,
                        OrderId = MobilewalletHistoryDto.OrderID.Value

                    });
                }
                else
                {
                    if (MobilewalletHistoryDto.SourceId != null)
                    {
                        Checkout.Payments.GetMobilePaymentResponse payment = MobilewalletHistoryDto.SourceId;

                        if (MobilewalletHistoryDto.SaveCard)
                        {

                            List<GetPaymentCardsDto> paymentCards = _paymentCardsService.GetPaymentByCustomer(MobilewalletHistoryDto.CustomerID);
                            var itemExists = paymentCards.Find(p => p.CardType == ((Checkout.Payments.MobileCardSourceResponse)payment.Source).Scheme
                            && p.Expyear == Convert.ToInt32(((Checkout.Payments.MobileCardSourceResponse)payment.Source).Expiry_Year)
                            && p.Expmonth == Convert.ToInt32(((Checkout.Payments.MobileCardSourceResponse)payment.Source).Expiry_Month)
                            && p.last4digits == Convert.ToInt32(((Checkout.Payments.MobileCardSourceResponse)payment.Source).Last4)
                            );
                            if (itemExists == null)
                            {
                                await _paymentCardsService.InsertPaymentCards(
                                    new PaymentCardsDto
                                    {
                                        CardCustomerId = ((Checkout.Payments.CustomerResponse)payment.Customer).Id,
                                        CardSourceId = ((Checkout.Payments.MobileCardSourceResponse)payment.Source).Id,
                                        CardType = ((Checkout.Payments.MobileCardSourceResponse)payment.Source).Scheme,
                                        CustomerId = customerID,
                                        Expyear = Convert.ToInt32(((Checkout.Payments.MobileCardSourceResponse)payment.Source).Expiry_Year),
                                        Expmonth = Convert.ToInt32(((Checkout.Payments.MobileCardSourceResponse)payment.Source).Expiry_Month),
                                        last4digits = Convert.ToInt32(((Checkout.Payments.MobileCardSourceResponse)payment.Source).Last4)
                                    }
                                );
                            }
                        }
                        string TrasnsactionId = payment.Id;
                        string TransactionDescription = ((Checkout.Payments.MobileCardSourceResponse)payment.Source).Scheme
                            + "****" + ((Checkout.Payments.MobileCardSourceResponse)payment.Source).Last4;

                        await _PaymentResponseService.InsertPaymentDetails(new PaymentResponseDto
                        {
                            Amount = Convert.ToDecimal(payment.Amount),
                            Cardscheme = ((Checkout.Payments.MobileCardSourceResponse)payment.Source).Scheme,
                            Currency = payment.Currency,
                            CardType = ((Checkout.Payments.MobileCardSourceResponse)payment.Source).Card_Type,
                            PaymentCustomerId = ((Checkout.Payments.CustomerResponse)payment.Customer).Id,
                            PaymentSourceId = ((Checkout.Payments.MobileCardSourceResponse)payment.Source).Id,
                            TransactionId = payment.Id,
                            PaymentDate = payment.Requested_On,
                            PaymentStatus = "Approved",
                            CustomerId = customerID,
                            Card = Convert.ToInt32(((Checkout.Payments.MobileCardSourceResponse)payment.Source).Last4),
                            TransactionType = ((Checkout.Payments.MobileCardSourceResponse)payment.Source).Type,
                            OrderId = MobilewalletHistoryDto.OrderID.Value

                        });

                    }
                }
                if (MobilewalletHistoryDto.OrderWalletPaymentAmount > 0)
                {
                    OrderPaymentDto OrderPaymentDto = new OrderPaymentDto
                    {
                        CustomerId = MobilewalletHistoryDto.CustomerID,
                        OrderAmount = MobilewalletHistoryDto.OrderWalletPaymentAmount.ToString(),
                        OrderId = MobilewalletHistoryDto.OrderID.Value.ToString()
                    };
                    await _WalletHistoryService.OrderWalletPayment(OrderPaymentDto);

                }
                await _OrdersService.UpdatePaymentStatus(Convert.ToInt32(MobilewalletHistoryDto.OrderID));
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
            return Ok(new GenericResultDto<string> { Result = "Insert successfully" });
        }
        [HttpPost, Route("orderWalletPayment"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> OrderPayment([FromBody]OrderPaymentDto orderPaymeentDto)
        {
            string returnmessage = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(orderPaymeentDto.OrderAmount))
                {
                    if (Convert.ToDecimal(orderPaymeentDto.OrderAmount) > 0)
                    {
                        returnmessage = await _WalletHistoryService.OrderWalletPayment(orderPaymeentDto);
                    }
                }
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
            return Ok(new GenericResultDto<string> { Result = returnmessage });
        }

    }
}

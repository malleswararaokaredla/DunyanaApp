
using Dunyana.Core;
using Dunyana.DataAccess.Repositories;
using Dunyana.Domain;
using Dunyana.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Sym.Core.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dunyana.Services
{
    public class OrdersService : EntityService<Order, OrderRepository>
    {
        private readonly PaymentResponseService _PaymentResponseService;
        public OrdersService(OrderRepository repository, PaymentResponseService PaymentResponseService,
          IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {
            _PaymentResponseService = PaymentResponseService;
        }

        public async Task<List<GetOrderDetailsDto>> GetAll(string CustomerID)
        {
            //return this.Repository.Where(m => m.CustomerRegistration.Email == CustomerID).ToList();

            var getOrderlist = (from s in this.Repository.Where(m => m.CustomerRegistration.Email == CustomerID)
                                select new
                                {
                                    s.Id,
                                    s.OrderNo,
                                    s.OrderDate,
                                    s.OrderAmount,
                                    s.Currency,
                                    s.OrderStatus,
                                    s.WayBill,
                                    s.OrderAddress,
                                    s.Merchant,
                                    s.Paymentstatus,
                                    s.COD
                                }).ToList();

            List<GetOrderDetailsDto> OrderDetailslist = new List<GetOrderDetailsDto>();
            foreach (var tOrderlist in getOrderlist)
            {
                GetOrderDetailsDto OrderDetails = new GetOrderDetailsDto();
                OrderDetails.OrderID = tOrderlist.Id;
                OrderDetails.OrderNo = tOrderlist.OrderNo;
                OrderDetails.OrderDate = tOrderlist.OrderDate;
                OrderDetails.OrderAmount = tOrderlist.OrderAmount;
                OrderDetails.CurrenyCode = tOrderlist.Currency;
                OrderDetails.OrderStatus = tOrderlist.OrderStatus;
                OrderDetails.MerchantID = tOrderlist.Merchant.Id;
                OrderDetails.MerchantName = tOrderlist.Merchant.Name;
                OrderDetails.MerchantImage = tOrderlist.Merchant.CompanyImage;
                OrderDetails.COD = tOrderlist.COD;
                if (tOrderlist.Paymentstatus != null)
                {
                    OrderDetails.PaymentStatus = tOrderlist.Paymentstatus;
                }
                else
                {
                    OrderDetails.PaymentStatus = "0";
                }
                foreach (var OrderAddress in tOrderlist.OrderAddress)
                {
                    OrderDetails.ConsigneeAddressLine1 = OrderAddress.Line1;
                    OrderDetails.ConsigneeAddressLine2 = OrderAddress.Line1;
                    OrderDetails.ConsigneeAddressCity = OrderAddress.City;
                    OrderDetails.ConsigneeAddressCountry = OrderAddress.Country;
                    OrderDetails.ConsigneeAddresszip = OrderAddress.zip;
                    OrderDetails.ConsigneeAddressMobileNo = OrderAddress.MobileNo;
                    OrderDetails.ConsigneeAddressPhone = OrderAddress.Phone;
                    OrderDetails.Latitude = OrderAddress.Latitude;
                    OrderDetails.Longitude = OrderAddress.Longitude;
                }
                OrderDetails.Products = new List<GetProductDetailsDto>();
                foreach (var ProductWayBillDetails in tOrderlist.WayBill)
                {
                    foreach (var ProductDetails in ProductWayBillDetails.OrderDetails)
                    {
                        GetProductDetailsDto ProductDetailsDto = new GetProductDetailsDto();
                        ProductDetailsDto.ProductID = ProductDetails.Id;
                        ProductDetailsDto.ProductSKU = ProductDetails.ProductSKU;
                        ProductDetailsDto.ProductImage = ProductDetails.ProductImage;
                        ProductDetailsDto.ProductName = ProductDetails.ProductName;
                        ProductDetailsDto.Description = ProductDetails.Description;
                        ProductDetailsDto.Quantity = ProductDetails.Quantity;
                        ProductDetailsDto.UnitCost = ProductDetails.UnitCost;
                        ProductDetailsDto.CurrenyCode = ProductDetails.CurrenyCode;
                        ProductDetailsDto.OrderID = ProductDetails.OrderRefID;
                        ProductDetailsDto.COD = tOrderlist.COD;
                        ProductDetailsDto.TrackingID = ProductWayBillDetails.WaybillNo;
                        OrderDetails.Products.Add(ProductDetailsDto);
                    }
                }

               
                var PaymentResponseService = await _PaymentResponseService.GetOrderPaymentlist(tOrderlist.Id);
                if (PaymentResponseService != null)
                {
                    OrderDetails.PaymentDetails = new List<PaymentResponseWithoutRequiredDto>();
                    foreach (var PaymentResponselDetails in PaymentResponseService)
                    {
                        PaymentResponseWithoutRequiredDto PaymentResponseWithoutRequiredDto = new PaymentResponseWithoutRequiredDto();
                        PaymentResponseWithoutRequiredDto.PaymentDate = PaymentResponselDetails.PaymentDate;
                        PaymentResponseWithoutRequiredDto.Amount = PaymentResponselDetails.Amount;
                        PaymentResponseWithoutRequiredDto.Currency = PaymentResponselDetails.Currency;
                        PaymentResponseWithoutRequiredDto.Card = PaymentResponselDetails.Card;
                        PaymentResponseWithoutRequiredDto.Cardscheme = PaymentResponselDetails.Cardscheme;
                        PaymentResponseWithoutRequiredDto.CardType = PaymentResponselDetails.CardType;
                        PaymentResponseWithoutRequiredDto.PaymentStatus = PaymentResponselDetails.PaymentStatus;
                        PaymentResponseWithoutRequiredDto.TransactionId = PaymentResponselDetails.TransactionId;
                        PaymentResponseWithoutRequiredDto.TransactionType = PaymentResponselDetails.TransactionType;
                        PaymentResponseWithoutRequiredDto.ReturnPaymentResponse = PaymentResponselDetails.ReturnPaymentResponse;
                        OrderDetails.PaymentDetails.Add(PaymentResponseWithoutRequiredDto);
                    }
                }


                OrderDetailslist.Add(OrderDetails);
            }
            return OrderDetailslist;

        }

        public List<NaqelOrderDto> GetAllDetails()
        {
            var getCustomerOrders = (from s in this.Repository
                                     select new
                                     {
                                         s.OrderNo,
                                         s.OrderDate,
                                         s.OrderAmount,
                                         s.MerchantID,
                                         s.Merchant.Name,
                                         s.CustomerID,
                                         s.CustomerRegistration.FirstName,
                                         s.CustomerRegistration.LastName,
                                         s.COD,
                                         s.OrderStatus,
                                         s.Id,
                                     }).ToList();

            List<NaqelOrderDto> NaqelOrderlist = new List<NaqelOrderDto>();
            foreach (var Orderslist in getCustomerOrders)
            {
                NaqelOrderDto NaqelOrder = new NaqelOrderDto();
                NaqelOrder.OrderID = Orderslist.Id;
                NaqelOrder.OrderNo = Orderslist.OrderNo;
                NaqelOrder.OrderDate = Orderslist.OrderDate;
                NaqelOrder.OrderAmount = Orderslist.OrderAmount;
                NaqelOrder.MerchantID = Orderslist.MerchantID;
                NaqelOrder.MerchantName = Orderslist.Name;
                NaqelOrder.CustomerID = Orderslist.CustomerID;
                NaqelOrder.CustomerFirstName = Orderslist.FirstName;
                NaqelOrder.CustomerLastName = Orderslist.LastName;
                NaqelOrder.COD = Orderslist.COD;
                NaqelOrder.OrderStatus = Orderslist.OrderStatus;
                NaqelOrderlist.Add(NaqelOrder);
            }
            return NaqelOrderlist;


        }
        public List<Order> CheckOrderDetails(string OrderNo)
        {
            return this.Repository.Where(m => m.OrderNo == OrderNo).ToList();
        }
        public async Task InsertOrder(GetOrderDetailsDto GetOrderDetailsDto)
        {
            await Repository.InsertAsync(new Order
            {
                CustomerID = Convert.ToInt32(GetOrderDetailsDto.CustomerID),
                COD = GetOrderDetailsDto.COD,
                OrderNo = GetOrderDetailsDto.OrderNo,
                OrderDate = GetOrderDetailsDto.OrderDate,
                OrderAmount = GetOrderDetailsDto.OrderAmount,
                Currency = GetOrderDetailsDto.CurrenyCode,
                OrderStatus = GetOrderDetailsDto.OrderStatus,
                MerchantID = Convert.ToInt32(GetOrderDetailsDto.MerchantID),
            });
        }
        public Order OrderId(GetOrderDetailsDto GetOrderDetailsDto)
        {
            var GetOrderId = Repository.SingleOrDefault(x => x.OrderNo == GetOrderDetailsDto.OrderNo);

            return GetOrderId;
        }
        public async Task UpdatePaymentStatus(int OrderID)
        {
            var GetOrderId = Repository.SingleOrDefault(x => x.Id == OrderID);
            GetOrderId.Paymentstatus = "1";
            await Repository.UpdateAsync(GetOrderId);
        }
    }
}

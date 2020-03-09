using Dunyana.DataAccess.Repositories;
using Dunyana.Domain;
using Dunyana.Dto;
using Microsoft.AspNetCore.Http;
using Sym.Core.Service;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dunyana.Services
{
    public class PaymentResponseService : EntityService<PaymentResponse, PaymentResponseRepository>
    {

        public PaymentResponseService(PaymentResponseRepository repository,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {


        }
        public async Task InsertPaymentDetails(PaymentResponseDto PaymentResponseDto)
        {

            await Repository.InsertAsync(new PaymentResponse
            {
                PaymentDate = PaymentResponseDto.PaymentDate,
                Amount = PaymentResponseDto.Amount,
                Currency = PaymentResponseDto.Currency,
                Card = PaymentResponseDto.Card,
                Cardscheme = PaymentResponseDto.Cardscheme,
                CardType = PaymentResponseDto.CardType,
                PaymentStatus = PaymentResponseDto.PaymentStatus,
                TransactionId = PaymentResponseDto.TransactionId,
                TransactionType = PaymentResponseDto.TransactionType,
                CustomerId = PaymentResponseDto.CustomerId,
                PaymentCustomerId = PaymentResponseDto.PaymentCustomerId,
                PaymentSourceId = PaymentResponseDto.PaymentSourceId,
                ReturnPaymentResponse = PaymentResponseDto.ReturnPaymentResponse,
                OrderId = PaymentResponseDto.OrderId
            });

        }
        public async Task InsertOrderPaymentDetails(PaymentResponseWithoutRequiredDto PaymentResponseDto,int OrderId, int CustomerId)
        {

            await Repository.InsertAsync(new PaymentResponse
            {
                OrderId = OrderId,
                PaymentDate = PaymentResponseDto.PaymentDate,
                Amount = PaymentResponseDto.Amount,
                Currency = PaymentResponseDto.Currency,
                Card = PaymentResponseDto.Card,
                Cardscheme = PaymentResponseDto.Cardscheme,
                CardType = PaymentResponseDto.CardType,
                PaymentStatus = PaymentResponseDto.PaymentStatus,
                TransactionId = PaymentResponseDto.TransactionId,
                TransactionType = PaymentResponseDto.TransactionType,
                CustomerId = CustomerId,
                PaymentCustomerId = "OrderPayment_"+ PaymentResponseDto.TransactionId,
                PaymentSourceId = "OrderPayment_" + PaymentResponseDto.TransactionId,
                ReturnPaymentResponse = PaymentResponseDto.ReturnPaymentResponse,
            });

        }
        public async Task<decimal> GetOrderPayment(int OrderID)
        {
            decimal OrderPaymentAmount = 0.0m;
            OrderPaymentAmount = this.Repository.Where(m => m.OrderId == OrderID).Select(t => t.Amount).Sum();
            return OrderPaymentAmount;
        }
        public async Task<List<PaymentResponseWithoutRequiredDto>> GetOrderPaymentlist(int OrderID)
        {
            var getOrderlist = this.Repository.Where(m => m.OrderId == OrderID).ToList();

            List<PaymentResponseWithoutRequiredDto> PaymentOrderlist = new List<PaymentResponseWithoutRequiredDto>();
            foreach (var Orderslist in getOrderlist)
            {
                PaymentResponseWithoutRequiredDto PaymentOrder = new PaymentResponseWithoutRequiredDto();
                PaymentOrder.PaymentDate = Orderslist.PaymentDate;
                PaymentOrder.Amount = Orderslist.Amount;
                PaymentOrder.Currency = Orderslist.Currency;
                PaymentOrder.Card = Orderslist.Card;
                PaymentOrder.Cardscheme = Orderslist.Cardscheme;
                PaymentOrder.CardType = Orderslist.CardType;
                PaymentOrder.PaymentStatus = Orderslist.PaymentStatus;
                PaymentOrder.TransactionId = Orderslist.TransactionId;
                PaymentOrder.TransactionType = Orderslist.TransactionType;
                PaymentOrder.ReturnPaymentResponse = Orderslist.ReturnPaymentResponse;
                PaymentOrderlist.Add(PaymentOrder);
            }
            return PaymentOrderlist;

        }
    }
}

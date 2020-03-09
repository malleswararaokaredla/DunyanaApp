
using Dunyana.DataAccess.Repositories;
using Dunyana.Domain;
using Dunyana.Dto;
using Microsoft.AspNetCore.Http;
using Sym.Core.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dunyana.Services
{
    public class WalletHistoryService : EntityService<WalletHistory, WalletHistoryRepository>
    {
        UsersService _UsersService;
        WalletService _WalletService;
        OrdersService _OrdersService;
        public WalletHistoryService(WalletHistoryRepository repository,
           IHttpContextAccessor httpContextAccessor, UsersService UsersService, WalletService WalletService, OrdersService OrdersService) : base(repository, httpContextAccessor)
        {
            _UsersService = UsersService;
            _WalletService = WalletService;
            _OrdersService = OrdersService;
        }
        public async Task<List<WalletHistoryDto>> GetAll(int CustomerID)
        {

            var getWalletHistory = (from s in this.Repository.Where(m => m.CustomerID == CustomerID)
                                    select new
                                    {
                                        s.LookupTypeValues.Description,
                                        s.Transaction,
                                        s.TransactionDate,
                                        s.TransactionAmount,
                                        s.TransactionDescription,
                                        s.Status,
                                    }).OrderByDescending(s => s.TransactionDate).ToList();

            List<WalletHistoryDto> walletHistoryList = new List<WalletHistoryDto>();
            foreach (var WalletHistory in getWalletHistory)
            {
                WalletHistoryDto WalletHistoryDto = new WalletHistoryDto();
                WalletHistoryDto.Type = WalletHistory.Description;
                WalletHistoryDto.Transaction = WalletHistory.Transaction;
                WalletHistoryDto.TransactionDate = WalletHistory.TransactionDate;
                if (WalletHistory.TransactionAmount < 0)
                {
                    WalletHistoryDto.TransactionAmount = Decimal.Negate(WalletHistory.TransactionAmount);
                }
                else
                {
                    WalletHistoryDto.TransactionAmount = WalletHistory.TransactionAmount;
                }
                WalletHistoryDto.TransactionDescription = WalletHistory.TransactionDescription;
                WalletHistoryDto.Status = WalletHistory.Status;
                walletHistoryList.Add(WalletHistoryDto);
            }
            return walletHistoryList;
        }

        public async Task InsertWalletHistory(WalletHistoryDto WalletHistoryDto)
        {

           // Guid transactionId = Guid.NewGuid();
            var getCustomerID = await _UsersService.getCustomerID(WalletHistoryDto.CustomerID);
            if (string.IsNullOrEmpty(WalletHistoryDto.TransactionDescription))
                WalletHistoryDto.TransactionDescription = "****";

            await Repository.InsertAsync(new WalletHistory
            {
                CustomerID = Convert.ToInt32(getCustomerID),
                Type = 21,
                Transaction =  WalletHistoryDto.Transaction, //transactionId.ToString(),
                TransactionDate = DateTime.Now,
                TransactionAmount = WalletHistoryDto.TransactionAmount,
                TransactionDescription = WalletHistoryDto.TransactionDescription,
                Status = 1

            });


            await _WalletService.InsertWallet(getCustomerID);

            var _getWalletHistorysum = await GetWalletHistorysum(getCustomerID);
            WalletHistoryDto.TransactionAmount = _getWalletHistorysum + WalletHistoryDto.TransactionAmount;
            WalletHistoryDto.CustomerID = getCustomerID.ToString();
            await _WalletService.UpdateWalletAmount(WalletHistoryDto);


        }
        public async Task<string> OrderWalletPayment(OrderPaymentDto orderPaymeentDto)
        {
            try
            {

                Guid transactionId = Guid.NewGuid();
                var getCustomerID = await _UsersService.getCustomerID(orderPaymeentDto.CustomerId);
                decimal CustomerWallet = await _WalletService.getWalletAmount(Convert.ToInt32(getCustomerID));
                await Repository.InsertAsync(new WalletHistory
                {
                    CustomerID = Convert.ToInt32(getCustomerID),
                    Type = 31,
                    Transaction = transactionId.ToString(),
                    TransactionDate = DateTime.Now,
                    TransactionAmount = -Convert.ToDecimal(orderPaymeentDto.OrderAmount),
                    TransactionDescription = "Order Wallet Payment",
                    Status = 1,
                    OrderID = Convert.ToInt32(orderPaymeentDto.OrderId)
                });

                var _getWalletHistorysum = await GetWalletHistorysum(getCustomerID);
                WalletHistoryDto WalletHistoryDto = new WalletHistoryDto();
                WalletHistoryDto.TransactionAmount = _getWalletHistorysum - Convert.ToDecimal(orderPaymeentDto.OrderAmount);
                WalletHistoryDto.CustomerID = getCustomerID.ToString();
                await _WalletService.UpdateWalletAmount(WalletHistoryDto);
                await _OrdersService.UpdatePaymentStatus(Convert.ToInt32(orderPaymeentDto.OrderId));
                return "Order Payment Success";
            }
            catch(Exception ex)
            {
                return "Order Payment Failed";
            }

        }
        public async Task<decimal> GetWalletHistorysum(int CustomerID)
        {
            decimal walletTotalAmount = 0.0m;
            walletTotalAmount = await _WalletService.getWalletAmount(CustomerID);
            return walletTotalAmount;
        }
        public async Task<decimal> GetOrderHistory(int OrderID)
        {
            decimal walletOrderAmount = 0.0m;
            walletOrderAmount = this.Repository.Where(m => m.OrderID == OrderID).Select(t => t.TransactionAmount).Sum();
            return walletOrderAmount;
        }
    }


}

using Dunyana.DataAccess.Repositories;
using Dunyana.Domain;
using Dunyana.Dto;
using Microsoft.AspNetCore.Http;
using Sym.Core.Service;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Dunyana.Services
{
    public class WalletService : EntityService<Wallet, WalletRepository>
    {
      
        public WalletService(WalletRepository repository,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {
          
        }
        public async Task InsertWallet(int CustomerID)
        {
            var isvalid = Repository.SingleOrDefault(x => x.CustomerID == CustomerID);
            if (isvalid == null)
            {
                await Repository.InsertAsync(new Wallet
                {
                    CustomerID = CustomerID,
                    Amount = 0
                });
            }
                
        }
        public async Task UpdateWalletAmount(WalletHistoryDto WalletHistoryDto)
        {

            var isvalid = Repository.SingleOrDefault(x => x.CustomerID == Convert.ToInt32(WalletHistoryDto.CustomerID));
            isvalid.Amount = WalletHistoryDto.TransactionAmount;
            await Repository.UpdateAsync(isvalid);
        }
        public async Task<decimal> getWalletAmount(int CustomerID)
        {

            var Customeramount = Repository.SingleOrDefault(x => x.CustomerID == CustomerID);
            return Customeramount.Amount;
        }

    }


}
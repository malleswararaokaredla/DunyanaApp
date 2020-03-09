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
    public class WalletPointsService : EntityService<WalletPoints, WalletPointsRepository>
    {

        public WalletPointsService(WalletPointsRepository repository,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {

        }
        public async Task<decimal> getWalletPoints(int CustomerID)
        {

            var Customeramount = Repository.SingleOrDefault(x => x.CustomerID == CustomerID);
            return Customeramount.Points;
        }

    }


}
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
    public class WayBillService : EntityService<WayBill, WayBillRepository>
    {

        public WayBillService(WayBillRepository repository,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {

        }
        public async Task InsertWayBill(int OrderId, string WayBillNo)
        {
            await Repository.InsertAsync(new WayBill
            {
                OrderId = OrderId,
                WaybillNo = WayBillNo
            });
        }
        public async Task<int> GetWayBillId(int OrderId, string WayBillNo)
        {
            var WayBillId = Repository.Where(x => x.OrderId == OrderId).Where(x => x.WaybillNo == WayBillNo).SingleOrDefault();

            return WayBillId.Id;
        }
    }
}

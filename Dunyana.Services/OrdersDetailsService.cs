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
    public class OrdersDetailsService : EntityService<OrderDetails, OrderDetailsRepository>
    {
        public OrdersDetailsService(OrderDetailsRepository repository,
          IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {

        }
        public List<OrderDetails> GetAll()
        {
            return Repository.ToList();
        }
        public async Task InsertProductDetails(int WaybillId,int OrderRefID, ProductDetailsDto ProductDetailsDto)
        {
            await Repository.InsertAsync(new OrderDetails
            {
                OrderRefID = OrderRefID,
                WaybillId = WaybillId,
                ProductSKU = ProductDetailsDto.ProductSKU,
                ProductImage = ProductDetailsDto.ProductImage,
                ProductName = ProductDetailsDto.ProductName,
                Description = ProductDetailsDto.Description,
                Quantity = ProductDetailsDto.Quantity,
                UnitCost = ProductDetailsDto.UnitCost,
                CurrenyCode = ProductDetailsDto.CurrenyCode,
                Returndate = ProductDetailsDto.Returndate,
                Canceldate = ProductDetailsDto.Canceldate,
            });
        }
    }
}
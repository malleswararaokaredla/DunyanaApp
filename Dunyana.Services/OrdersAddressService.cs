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
    public class OrdersAddressService : EntityService<OrderAddress, OrderAddressRepository>
    {
        public OrdersAddressService(OrderAddressRepository repository,
          IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {

        }
        public List<OrderAddress> GetAll(int CustomerID)
        {
            return Repository.ToList();
        }
        public async Task InsertOrderAddress(GetOrderDetailsDto GetOrderDetailsDto, int OrderId)
        {
            await Repository.InsertAsync(new OrderAddress
            {
                OrderRefID = OrderId,
                Line1 = GetOrderDetailsDto.ConsigneeAddressLine1,
                Line2 = GetOrderDetailsDto.ConsigneeAddressLine2,
                City = GetOrderDetailsDto.ConsigneeAddressCity,
                State = GetOrderDetailsDto.ConsigneeAddressState,
                Country = GetOrderDetailsDto.ConsigneeAddressCountry,
                zip = GetOrderDetailsDto.ConsigneeAddresszip,
                MobileNo = GetOrderDetailsDto.ConsigneeAddressMobileNo,
                Phone = GetOrderDetailsDto.ConsigneeAddressPhone,
                Latitude = GetOrderDetailsDto.Longitude,
                Longitude = GetOrderDetailsDto.Latitude
            });
        }
    }
}
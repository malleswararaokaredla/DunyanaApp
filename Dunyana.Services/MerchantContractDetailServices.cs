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
    public class MerchantContractDetailServices : EntityService<MerchantContractDetails, MerchantContractDetailsRepository>
    {
        public MerchantContractDetailServices(MerchantContractDetailsRepository repository,
          IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {

        }
        public async Task InsertMerchantContractdetails(InsertMerchantContractDto InsertMerchantContractDto,int MerchantcontractID)
        {
            await Repository.InsertAsync(new MerchantContractDetails
            {
                MerchantcontractID = MerchantcontractID,
                ContractFileName = InsertMerchantContractDto.ContractFilename,
            });
        }
    }
}

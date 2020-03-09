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
    public class MerchantContractService : EntityService<MerchantContract, MerchantContractRepository>
    {
        public MerchantContractService(MerchantContractRepository repository,
          IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {

        }
        public async Task<int> CheckMerchantContract(int MerchantId,int MerchantRequestId)
        {
            var isvalid = Repository.SingleOrDefault(x => x.Merchant.Id == MerchantId && x.MerchantRequest.Id == MerchantRequestId);
            if (isvalid == null)
                return 0;
            return isvalid.Id;
        }
        public async Task InsertMerchantContract(InsertMerchantContractDto InsertMerchantContractDto)
        {
            await Repository.InsertAsync(new MerchantContract
            {
                MerchantID = InsertMerchantContractDto.MerchantID,
                MerchantrequestID = InsertMerchantContractDto.MerchantrequestID,
                CurrentContractFileName = InsertMerchantContractDto.ContractFilename,
            });
        }
        public async Task UpdateMerchantContract(InsertMerchantContractDto InsertMerchantContractDto)
        {
            var MerchantContractDetails = Repository.SingleOrDefault(x => x.MerchantID == InsertMerchantContractDto.MerchantID);

            if (!string.IsNullOrEmpty(InsertMerchantContractDto.ContractFilename))
            {
                MerchantContractDetails.CurrentContractFileName = InsertMerchantContractDto.ContractFilename;
            }
            await Repository.UpdateAsync(MerchantContractDetails);

        }
    }
}
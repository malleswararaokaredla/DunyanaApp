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
    public class MerchantRequestDetailsService : EntityService<MerchantRequestDetails, MerchantRequestDetailsRepository>
    {
        public MerchantRequestDetailsService(MerchantRequestDetailsRepository repository,
          IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {
        }
        public async Task InsertMerchantRequestDetails(int MerchantRequestID, int ApprovalStatus, string Description, int RequestAssignee)
        {

            await Repository.InsertAsync(new MerchantRequestDetails
            {
                MerchantRequestID = MerchantRequestID,
                ApprovalStatus = ApprovalStatus,
                Description = Description,
                RequestAssignee = RequestAssignee,
            });

        }
    }
}

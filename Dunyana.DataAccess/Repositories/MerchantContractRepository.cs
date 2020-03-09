using Dunyana.Domain;
using Microsoft.AspNetCore.Http;
using Sym.Core.DataAccess;

namespace Dunyana.DataAccess.Repositories
{
    public class MerchantContractRepository : Repository<MerchantContract>
    {
        public MerchantContractRepository(DunyanaDbContext dbContext, IHttpContextAccessor httpContextAccessor) :
            base(dbContext, httpContextAccessor)
        {
        }

    }

}

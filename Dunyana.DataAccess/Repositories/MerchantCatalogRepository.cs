using Dunyana.Domain;
using Microsoft.AspNetCore.Http;
using Sym.Core.DataAccess;

namespace Dunyana.DataAccess.Repositories
{
    public class MerchantCatalogRepository : Repository<MerchantCatalog>
    {
        public MerchantCatalogRepository(DunyanaDbContext dbContext, IHttpContextAccessor httpContextAccessor) :
            base(dbContext, httpContextAccessor)
        {
        }

    }

}

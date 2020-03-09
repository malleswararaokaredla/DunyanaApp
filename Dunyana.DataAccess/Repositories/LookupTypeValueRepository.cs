using Dunyana.Domain;
using Microsoft.AspNetCore.Http;
using Sym.Core.DataAccess;

namespace Dunyana.DataAccess.Repositories
{
    public class LookupTypeValueRepository : Repository<LookupTypeValues>
    {
        public LookupTypeValueRepository(DunyanaDbContext dbContext, IHttpContextAccessor httpContextAccessor) :
                    base(dbContext, httpContextAccessor)
        {
        }
    }
}

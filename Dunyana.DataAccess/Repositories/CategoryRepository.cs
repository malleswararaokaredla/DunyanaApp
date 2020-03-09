using Dunyana.Domain;
using Microsoft.AspNetCore.Http;
using Sym.Core.DataAccess;

namespace Dunyana.DataAccess.Repositories
{
    public class CategoryRepository : Repository<Category>
    {
        public CategoryRepository(DunyanaDbContext dbContext, IHttpContextAccessor httpContextAccessor) :
            base(dbContext, httpContextAccessor)
        {
        }

    }

}

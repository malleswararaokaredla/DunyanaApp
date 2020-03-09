using Dunyana.Domain;
using Microsoft.AspNetCore.Http;
using Sym.Core.DataAccess;

namespace Dunyana.DataAccess.Repositories
{
    public class WalletRepository : Repository<Wallet>
    {
        public WalletRepository(DunyanaDbContext dbContext, IHttpContextAccessor httpContextAccessor) :
            base(dbContext, httpContextAccessor)
        {
        }

    }

}
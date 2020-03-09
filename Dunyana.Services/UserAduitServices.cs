using Dunyana.DataAccess.Repositories;
using Dunyana.Domain;
using Microsoft.AspNetCore.Http;
using Sym.Core.Service;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dunyana.Services
{
    public class UserAduitServices : EntityService<UserAduit, UserAduitRepository>
    {

        public UserAduitServices(UserAduitRepository repository,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {

        }
        public List<UserAduit> GetAll()
        {
            return Repository.ToList();
        }
        public async Task AuditPassword(string Oldpassword, string Newpassword,int UsersID)
        {
            await Repository.InsertAsync(new UserAduit
            {
                Oldvalue = Oldpassword,
                Newvalue = Newpassword,
                UsersID = UsersID
            });
        }

    }


}

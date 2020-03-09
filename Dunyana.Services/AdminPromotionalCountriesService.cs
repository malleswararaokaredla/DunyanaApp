using Dunyana.DataAccess.Repositories;
using Dunyana.Domain;
using Microsoft.AspNetCore.Http;
using Sym.Core.Service;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Dunyana.Services
{
    public class AdminPromotionalCountriesService : EntityService<AdminPromotionalCountries, AdminPromotionalCountriesRepository>
    {

        public AdminPromotionalCountriesService(AdminPromotionalCountriesRepository repository,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {

        }
        public async Task InsertAdminPromotionalCountriesDetails(string strCountries, int AdminPromotionalId)
        {
            string[] strCountriesID = (strCountries).ToString().Split(",");
            for (int i = 0; i < strCountriesID.Length; i++)
            {
                await Repository.InsertAsync(new AdminPromotionalCountries
                {
                    CountryID = Convert.ToInt32(strCountriesID[i]),
                    PromotionalID = AdminPromotionalId

                }
                );
            }
        }
        public async Task deleteAdminPromotional(int AdminPromotionalId)
        {
            var deleteAdminPromotional = this.Repository.Where(m => m.Id == AdminPromotionalId);
            Repository.Delete(deleteAdminPromotional);
        }


    }


}

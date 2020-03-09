using Dunyana.DataAccess.Repositories;
using Dunyana.Domain;
using Microsoft.AspNetCore.Http;
using Sym.Core.Service;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Dunyana.Services
{
    public class MerchantSellCountriesService : EntityService<MerchantSellCountries, MerchantSellCountriesRepository>
    {

        public MerchantSellCountriesService(MerchantSellCountriesRepository repository,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {

        }
        public async Task InsertSellCountriesDetails(int Merchantid, string strCountries)
        {
            string[] strCountriesID = (strCountries).ToString().Split(",");
            for (int i = 0; i < strCountriesID.Length; i++)
            {
                await Repository.InsertAsync(new MerchantSellCountries
                {
                    Country = Convert.ToInt32(strCountriesID[i]),
                    MerchantID = Merchantid
                }
                );
            }
        }
        public async Task deleteMerchantCountries(int MerchantId)
        {
            var deleteMerchantCountries = this.Repository.Where(m => m.MerchantID == MerchantId);
            Repository.Delete(deleteMerchantCountries);
        }


    }


}

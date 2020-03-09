using Dunyana.DataAccess.Repositories;
using Dunyana.Domain;
using Microsoft.AspNetCore.Http;
using Sym.Core.Service;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Dunyana.Services
{
    public class MerchantDealService : EntityService<MerchantDeal, MerchantDealRepository>
    {

        public MerchantDealService(MerchantDealRepository repository,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {

        }
        public async Task InsertMerchantDealDetails(int Merchantid, string strCountries, int DealId)
        {
            string[] strCountriesID = (strCountries).ToString().Split(",");
            for (int i = 0; i < strCountriesID.Length; i++)
            {
                await Repository.InsertAsync(new MerchantDeal
                {
                    CountryID = Convert.ToInt32(strCountriesID[i]),
                    MerchantID = Merchantid,
                    DealID = DealId

                }
                );
            }
        }
        public async Task deleteMerchantDeal(int DealId)
        {
            var deleteMerchantDeal = this.Repository.Where(m => m.DealID == DealId);
            Repository.Delete(deleteMerchantDeal);
        }


    }


}

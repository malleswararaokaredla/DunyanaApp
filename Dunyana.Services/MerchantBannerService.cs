using Dunyana.DataAccess.Repositories;
using Dunyana.Domain;
using Microsoft.AspNetCore.Http;
using Sym.Core.Service;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Dunyana.Services
{
    public class MerchantBannerService : EntityService<MerchantBanner, MerchantBannerRepository>
    {

        public MerchantBannerService(MerchantBannerRepository repository,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {

        }
        public async Task InsertMerchantBannerDetails(int Merchantid, string strCountries,int BannerId)
        {
            string[] strCountriesID = (strCountries).ToString().Split(",");
            for (int i = 0; i < strCountriesID.Length; i++)
            {
                await Repository.InsertAsync(new MerchantBanner
                {
                    CountryID = Convert.ToInt32(strCountriesID[i]),
                    MerchantID = Merchantid,
                    BannerID = BannerId

                }
                );
            }
        }
        public async Task deleteMerchantBanner(int BannerId)
        {
            var deleteMerchantBanner = this.Repository.Where(m => m.BannerID == BannerId);
            Repository.Delete(deleteMerchantBanner);
        }


    }


}

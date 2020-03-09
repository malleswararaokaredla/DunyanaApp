using Dunyana.DataAccess.Repositories;
using Dunyana.Domain;
using Dunyana.Dto;
using Microsoft.AspNetCore.Http;
using Sym.Core.Service;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dunyana.Services
{
    public class MerchantBonusService : EntityService<MerchantBonus, MerchantBonusRepository>
    {
        public MerchantBonusService(MerchantBonusRepository repository,
         IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {
        }
        public async Task<string> UpdateMerchantBonus(UpdateMerchantBonusDto UpdateMerchantBonusDto)
        {
            string returnstaus = "";
            var MerchantContractDetails = Repository.SingleOrDefault(x => x.MerchantID == UpdateMerchantBonusDto.MerchantID);

            if (MerchantContractDetails is null)
            {
                returnstaus = await InsertMerchantBonus(UpdateMerchantBonusDto);
            }
            else
            {
                MerchantContractDetails.MerchantID = UpdateMerchantBonusDto.MerchantID;
                MerchantContractDetails.WalletPoints = UpdateMerchantBonusDto.WalletPoints;
                MerchantContractDetails.WalletAmount = UpdateMerchantBonusDto.WalletAmount;
                await Repository.UpdateAsync(MerchantContractDetails);
                returnstaus = "Bonus updated successfully";
            }
            return returnstaus;

        }
        public async Task<string> InsertMerchantBonus(UpdateMerchantBonusDto UpdateMerchantBonusDto)
        {


            await Repository.InsertAsync(new MerchantBonus
            {
                MerchantID = UpdateMerchantBonusDto.MerchantID,
                WalletPoints = UpdateMerchantBonusDto.WalletPoints,
                WalletAmount = UpdateMerchantBonusDto.WalletAmount,
            });
            return "Bonus created successfully";


        }

    }
}

using Dunyana.DataAccess.Repositories;
using Dunyana.Domain;
using Dunyana.Dto;
using Microsoft.AspNetCore.Http;
using Sym.Core.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dunyana.Services
{
    public class MerchantAccountDetailsService : EntityService<MerchantAccountDetails, MerchantAccountDetailsRepository>
    {

        public MerchantAccountDetailsService(MerchantAccountDetailsRepository repository,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {


        }
        public async Task<string> UpdateMerchantAccountDetails(UpdateMerchantAccountDetailsDto UpdateMerchantAccountDetailsDto)
        {
            try
            {
                var MerchantAccountDetails = Repository.SingleOrDefault(x => x.Id == UpdateMerchantAccountDetailsDto.Id);
                MerchantAccountDetails.CR = UpdateMerchantAccountDetailsDto.AccountCR;
                MerchantAccountDetails.Brand_Account = UpdateMerchantAccountDetailsDto.BrandAccount;
                MerchantAccountDetails.Bank_Name = UpdateMerchantAccountDetailsDto.BankName;
                MerchantAccountDetails.AC_Number = UpdateMerchantAccountDetailsDto.AccountNumber;
                MerchantAccountDetails.Address = UpdateMerchantAccountDetailsDto.Address;
                MerchantAccountDetails.Swift_code = UpdateMerchantAccountDetailsDto.Swiftcode;
                await Repository.UpdateAsync(MerchantAccountDetails);
                return "Success";
            }
            catch (Exception ex)
            {
                return "Fail";
            }

        }
        public async Task<string> InsertMerchantAccountDetails(InsertMerchantAccountDetailsDto InsertMerchantAccountDetailsDto)
        {
            try
            {

                await Repository.InsertAsync(new MerchantAccountDetails
                {
                    MerchantID = InsertMerchantAccountDetailsDto.MerchantId,
                    CR = InsertMerchantAccountDetailsDto.AccountCR,
                    Brand_Account = InsertMerchantAccountDetailsDto.BrandAccount,
                    Bank_Name = InsertMerchantAccountDetailsDto.BankName,
                    AC_Number = InsertMerchantAccountDetailsDto.AccountNumber,
                    Address = InsertMerchantAccountDetailsDto.Address,
                    Swift_code = InsertMerchantAccountDetailsDto.Swiftcode,
                });
                return "Success";
            }
            catch (Exception ex)
            {
                return "Fail";
            }

        }
        public async Task<int> GetMerchantContractNumberDetails(int MerchantID)
        {
            try
            {
                var MerchantContractNumberDetails = Repository.SingleOrDefault(x => x.MerchantID == MerchantID);
                if (MerchantContractNumberDetails == null)
                    return 0;
                return MerchantContractNumberDetails.MerchantID;
            }
            catch (Exception ex)
            {
                return 0;
            }

        }
        public async Task<string> UpdateMerchantContractNumberDetails(int MerchantID, string MerchantContractNumber)
        {
            try
            {
                var MerchantContractNumberDetails = Repository.SingleOrDefault(x => x.MerchantID == MerchantID);
                MerchantContractNumberDetails.MerchantContractNumber = MerchantContractNumber;
                await Repository.UpdateAsync(MerchantContractNumberDetails);
                return "Success";
            }
            catch (Exception ex)
            {
                return "Fail";
            }

        }
        public async Task<string> InsertMerchantContractNumberDetails(int MerchantID, string getMerchantContractNumber)
        {
            try
            {

                await Repository.InsertAsync(new MerchantAccountDetails
                {
                    MerchantID = MerchantID,
                    MerchantContractNumber = getMerchantContractNumber,
                });
                return "Success";
            }
            catch (Exception ex)
            {
                return "Fail";
            }

        }

    }


}

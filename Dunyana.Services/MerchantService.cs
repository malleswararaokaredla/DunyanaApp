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
    public class MerchantService : EntityService<Merchant, MerchantRepository>
    {

        private readonly LookupTypeValuesService _LookupTypeValuesService;
        private readonly MerchantCategoryService _MerchantCategoryService;
        private readonly MerchantSellCountriesService _MerchantSellCountriesService;
        public MerchantService(MerchantRepository repository,
           IHttpContextAccessor httpContextAccessor, LookupTypeValuesService LookupTypeValuesService, MerchantCategoryService MerchantCategoryService, MerchantSellCountriesService MerchantSellCountriesService) : base(repository, httpContextAccessor)
        {
            _LookupTypeValuesService = LookupTypeValuesService;
            _MerchantCategoryService = MerchantCategoryService;
            _MerchantSellCountriesService = MerchantSellCountriesService;
        }
        public List<UserDto> GetAll()
        {
            var getMerchantdetails = (from s in this.Repository
                                      where s.MerchantRequest.LookupTypeValues.Description == "Approved"
                                      select new
                                      {
                                          s.Id,
                                          s.Name,
                                          s.LookupCountry.Description,
                                          s.CreatedDate,
                                          s.Email,
                                          s.Users.Status,
                                          s.Company,
                                          s.LookupApprovalStatus
                                      }).ToList();

            List<UserDto> Merchantlist = new List<UserDto>();
            foreach (var Merchant in getMerchantdetails)
            {
                UserDto MerchantDto = new UserDto();

                MerchantDto.Id = Merchant.Id;
                MerchantDto.FirstName = Merchant.Name;
                MerchantDto.Country = Merchant.Description;
                MerchantDto.Email = Merchant.Email;
                MerchantDto.IsActive = Merchant.Status.ToString();
                MerchantDto.CreatedDt = Merchant.CreatedDate.ToString();
                MerchantDto.Company = Merchant.Company;
                Merchantlist.Add(MerchantDto);
            }
            return Merchantlist.ToList();
        }
        public async Task<Merchant> GetMerchant(int id)
        {
            return await Repository.FindAsync(id);
        }
        public async Task InsertMerchantDetails(InsertMerchantDto InsertMerchantDto, int userID)
        {
            // Guid id = Guid.NewGuid();
            await Repository.InsertAsync(new Merchant
            {
                Name = InsertMerchantDto.Name,
                ProfileImage = InsertMerchantDto.ProfileImage,
                Company = InsertMerchantDto.Company,
                CompanyImage = InsertMerchantDto.CompanyImage,
                Website = InsertMerchantDto.Website,
                Email = InsertMerchantDto.Email,
                Categories = InsertMerchantDto.Categories,
                UsersID = userID,
                Country = InsertMerchantDto.Country,
                SellCountries = InsertMerchantDto.SellCountries,
                ApprovalStatus = 24,
                TermandCondition = Convert.ToInt32(InsertMerchantDto.TermandCondition),
            });
        }
        public async Task<Merchant> GetMerchantDetails(MerchantDto MerchantDto)
        {
            var isvalid = Repository.SingleOrDefault(x => x.Email == MerchantDto.Email);
            if (isvalid == null)
                return null;
            return isvalid;
        }
        public async Task<Merchant> GetMerchantDetailsByStatus(MerchantDto MerchantDto)
        {
            var isvalid = Repository.Where(x => x.Email == MerchantDto.Email && x.MerchantRequest.LookupTypeValues.Description == "Approved").SingleOrDefault();
            if (isvalid == null)
                return null;
            return isvalid;
        }
        public async Task<Merchant> GetMerchantDetailswithid(int Merchantid)
        {
            var isvalid = Repository.SingleOrDefault(x => x.Id == Merchantid);
            if (isvalid == null)
                return null;
            return isvalid;
        }
        public async Task UpdateMerchantRedirectionDetails(MerchantRedirectionDto MerchantRedirectionDto)
        {
            var MerchantDetails = Repository.SingleOrDefault(x => x.Id == MerchantRedirectionDto.Merchantid);
            var MerchantRedirectionUrl = MerchantRedirectionDto.MerchantRedirectionUrl;
            if (MerchantRedirectionUrl.ToUpper().Contains("HTTP") || MerchantRedirectionUrl.ToUpper().Contains("HTTPS"))
            {
                MerchantDetails.MerchantRedirectionUrl = MerchantRedirectionUrl;
            }
            else
            {
                MerchantDetails.MerchantRedirectionUrl = "http://" + MerchantRedirectionUrl;
            }
            await Repository.UpdateAsync(MerchantDetails);
        }
        public async Task<List<MerchantRedirectionlist>> getMerchantRedirection()
        {
            var getMerchantRedirection = (from s in this.Repository
                                          where s.MerchantRequest.LookupTypeValues.Description == "Approved"
                                          select new
                                          {
                                              s.Name,
                                              s.Id,
                                              s.MerchantRedirectionUrl,
                                              s.LookupApprovalStatus,
                                              s.MerchantRequest,
                                          }).ToList();

            List<MerchantRedirectionlist> getMerchantRedirectionlist = new List<MerchantRedirectionlist>();
            foreach (var MerchantRedirection in getMerchantRedirection)
            {
                MerchantRedirectionlist MerchantRedirectionDto = new MerchantRedirectionlist();
                MerchantRedirectionDto.Name = MerchantRedirection.Name;
                MerchantRedirectionDto.Merchantid = MerchantRedirection.Id;
                MerchantRedirectionDto.MerchantRedirectionUrl = MerchantRedirection.MerchantRedirectionUrl;
                getMerchantRedirectionlist.Add(MerchantRedirectionDto);

            }

            return getMerchantRedirectionlist;
        }
        public async Task UpdateRequestDetails(ModifyMerchantRequestDto ModifyMerchantRequestDto)
        {
            //return this.Repository.ToList();
            var UpdateRequest = Repository.SingleOrDefault(x => x.Id == ModifyMerchantRequestDto.MerchantID);
            UpdateRequest.ApprovalStatus = ModifyMerchantRequestDto.ApprovalStatus;
            await Repository.UpdateAsync(UpdateRequest);
        }
        public async Task<string> UpdateRegistrationDetails(MerchantDto MerchantDto)
        {
            var merchantDetails = Repository.SingleOrDefault(x => x.Id == MerchantDto.Id);
            if (!string.IsNullOrEmpty(MerchantDto.Name))
            {
                merchantDetails.Name = MerchantDto.Name;
            }
            if (!string.IsNullOrEmpty(MerchantDto.ProfileImage))
            {
                merchantDetails.ProfileImage = MerchantDto.ProfileImage;
            }
            if (!string.IsNullOrEmpty(MerchantDto.Company))
            {
                merchantDetails.Company = MerchantDto.Company;
            }
            if (!string.IsNullOrEmpty(MerchantDto.CompanyImage))
            {
                merchantDetails.CompanyImage = MerchantDto.CompanyImage;
            }
            if (!string.IsNullOrEmpty(MerchantDto.Website))
            {
                merchantDetails.Website = MerchantDto.Website;
            }
            if (MerchantDto.Country > 0)
            {
                merchantDetails.Country = MerchantDto.Country;
            }
            if (!string.IsNullOrEmpty(MerchantDto.Categories))
            {
                string returnstatus = await _MerchantCategoryService.deleteMerchantCategories(MerchantDto.Id, MerchantDto.Categories);
                if (returnstatus == "Success")
                {
                    await _MerchantCategoryService.InsertMerchantCategory(MerchantDto.Id, MerchantDto.Categories);
                    merchantDetails.Categories = MerchantDto.Categories;
                }
                else
                {
                    return "Fail";
                }
            }
            if (!string.IsNullOrEmpty(MerchantDto.SellCountries))
            {
                await _MerchantSellCountriesService.deleteMerchantCountries(MerchantDto.Id);
                await _MerchantSellCountriesService.InsertSellCountriesDetails(MerchantDto.Id, MerchantDto.SellCountries);
                merchantDetails.SellCountries = MerchantDto.SellCountries;

            }

            await Repository.UpdateAsync(merchantDetails);

            return "Success";
        }
        public async Task<MerchantRedirectionUrllistDto> getMerchantRedirectionlist(int MerchantID)
        {
            //return this.Repository.Where(m => m.MerchantID == MerchantID).ToList();


            var getMerchantRedirection = (from s in this.Repository.Where(m => m.Id == MerchantID)
                                          select new
                                          {
                                              s.Id,
                                              s.MerchantRedirectionUrl,
                                              s.MerchantRedirection,
                                          }).ToList();

            MerchantRedirectionUrllistDto MerchantRedirectionUrllist = new MerchantRedirectionUrllistDto();
            foreach (var MerchantRedirection in getMerchantRedirection)
            {
                MerchantRedirectionUrllist.MerchantRedirectionUrl = MerchantRedirection.MerchantRedirectionUrl;
            }

            List<MerchantRedirectionlistDto> getMerchantRedirectionlist = new List<MerchantRedirectionlistDto>();
            foreach (var MerchantRedirection in getMerchantRedirection)
            {
                foreach (var MerchantRedirectionlist in MerchantRedirection.MerchantRedirection)
                {
                    MerchantRedirectionlistDto MerchantRedirectionDto = new MerchantRedirectionlistDto();
                    MerchantRedirectionDto.MerchantRedirectionId = MerchantRedirectionlist.Id;
                    MerchantRedirectionDto.MerchantAttribute = MerchantRedirectionlist.Attribute;
                    MerchantRedirectionDto.MerchantValue = MerchantRedirectionlist.Value;
                    MerchantRedirectionDto.MerchantDescription = MerchantRedirectionlist.Description;
                    getMerchantRedirectionlist.Add(MerchantRedirectionDto);
                }
            }
            MerchantRedirectionUrllist.MerchantRedirectionlist = getMerchantRedirectionlist;
            return MerchantRedirectionUrllist;
        }
        public async Task<List<merchantcontractdetailsHistoryDto>> GetcontractBymerchant(GetMerchant GetMerchant)
        {

            var getmerchantdetails = (from s in this.Repository
                                      where s.Email == GetMerchant.Email
                                      select new
                                      {
                                          s.MerchantContract,
                                      }).ToList();

                List<merchantcontractdetailsHistoryDto> merchantcontractdetailsHistorylist = new List<merchantcontractdetailsHistoryDto>();
                foreach (var getMerchantContract in getmerchantdetails)
                {
                    foreach (var merchantcontract in getMerchantContract.MerchantContract)
                    {
                    foreach (var MerchantContractDetails in merchantcontract.MerchantContractDetails)
                    {
                        merchantcontractdetailsHistoryDto merchantcontractdetailsHistoryDto = new merchantcontractdetailsHistoryDto();

                        merchantcontractdetailsHistoryDto.ContractFileName = MerchantContractDetails.ContractFileName;
                        merchantcontractdetailsHistoryDto.ContractFileURL = MerchantContractDetails.ContractFileName;
                        merchantcontractdetailsHistoryDto.ContractUploaddate = MerchantContractDetails.CreatedDate;
                        merchantcontractdetailsHistorylist.Add(merchantcontractdetailsHistoryDto);
                    }
                    }
                }
            return merchantcontractdetailsHistorylist.OrderByDescending(s=>s.ContractUploaddate).ToList();

        }
        public async Task<GetMerchantAccountDetailsDto> GetMerchantAccountDetails(MerchantAccountDto MerchantAccountDto)
        {

            var MerchantAccountDetails = (from s in this.Repository
                                      where s.Email == MerchantAccountDto.MerchantEmail && s.MerchantAccountDetails.Id > 0
                                      select new
                                      {
                                          s.MerchantAccountDetails.Id,
                                          s.MerchantAccountDetails.MerchantContractNumber,
                                          s.MerchantAccountDetails.CR,
                                          s.MerchantAccountDetails.Brand_Account,
                                          s.MerchantAccountDetails.Bank_Name,
                                          s.MerchantAccountDetails.AC_Number,
                                          s.MerchantAccountDetails.Address,
                                          s.MerchantAccountDetails.Swift_code,
                                      }).SingleOrDefault();
            GetMerchantAccountDetailsDto GetMerchantAccountDetailsDto = new GetMerchantAccountDetailsDto();
            if (MerchantAccountDetails != null)
            {
                if (!string.IsNullOrEmpty(MerchantAccountDetails.MerchantContractNumber))
                {

                    GetMerchantAccountDetailsDto.Id = MerchantAccountDetails.Id;
                    GetMerchantAccountDetailsDto.MerchantContractNumber = MerchantAccountDetails.MerchantContractNumber;
                    GetMerchantAccountDetailsDto.AccountCR = MerchantAccountDetails.CR;
                    GetMerchantAccountDetailsDto.BrandAccount = MerchantAccountDetails.Brand_Account;
                    GetMerchantAccountDetailsDto.BankName = MerchantAccountDetails.Bank_Name;
                    GetMerchantAccountDetailsDto.AccountNumber = MerchantAccountDetails.AC_Number;
                    GetMerchantAccountDetailsDto.Address = MerchantAccountDetails.Address;
                    GetMerchantAccountDetailsDto.Swiftcode = MerchantAccountDetails.Swift_code;
                }
            }

            return GetMerchantAccountDetailsDto;

        }
       

    }


}

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
    public class MerchantRequestService : EntityService<MerchantRequest, MerchantRequestRepository>
    {
        private readonly LookupTypeValuesService _LookupTypeValuesService;
        public MerchantRequestService(MerchantRequestRepository repository,
          IHttpContextAccessor httpContextAccessor, LookupTypeValuesService LookupTypeValuesService) : base(repository, httpContextAccessor)
        {
            _LookupTypeValuesService = LookupTypeValuesService;
        }

        public async Task<List<MerchantRequestDto>> GetRequestDetails(NaqelRequestDto NaqelRequestDto)
        {
            //return this.Repository.ToList();
            List<MerchantRequestDto> MerchantRequestlist = new List<MerchantRequestDto>();
            if (NaqelRequestDto.RequestType == "O")
            {
                var getMerchantRequest = (from s in this.Repository
                                          select new
                                          {
                                              s.Id,
                                              s.Merchant.Name,
                                              s.Merchant.ApprovalStatus,
                                              s.MerchantID,
                                              s.CreatedDate,
                                              s.NaqelUsers.FirstName,
                                              s.NaqelUsers.LastName,
                                              s.NaqelUsers.Email,
                                              Naqelid = s.NaqelUsers.Id,
                                              s.Merchant.LookupCountry,
                                              s.Merchant.MerchantCategory,
                                              s.Merchant.SellCountries,
                                              s.Merchant.MerchantSellCountries,
                                              s.LookupTypeValues,
                                              s.Description,
                                              s.Merchant.MerchantAccountDetails.MerchantContractNumber,
                                              MerchantRequests = s.ApprovalStatus,

                                          }).Where(M => M.ApprovalStatus == M.MerchantRequests)
                                            .Where(M => M.LookupTypeValues.Description == "Open")
                                            .ToList();


                foreach (var MerchantsRequest in getMerchantRequest)
                {
                    var getgrouplist = (from grouplist in this.Repository
                                        where grouplist.MerchantID == MerchantsRequest.MerchantID
                                        group grouplist by grouplist.MerchantID into g
                                        select new
                                        {
                                            MerchantID = g.Key,
                                            CreatedDate = g.Max(t => t.CreatedDate),

                                        }).FirstOrDefault();

                    var Mingrouplist = (from grouplist in this.Repository
                                        where grouplist.MerchantID == MerchantsRequest.MerchantID
                                        group grouplist by grouplist.MerchantID into g
                                        select new
                                        {
                                            MerchantID = g.Key,
                                            CreatedDate = g.Min(t => t.CreatedDate),

                                        }).FirstOrDefault();
                    if (getgrouplist.MerchantID == MerchantsRequest.MerchantID && getgrouplist.CreatedDate == MerchantsRequest.CreatedDate)
                    {

                        MerchantRequestDto MerchantRequest = new MerchantRequestDto();

                        MerchantRequest.RequestID = MerchantsRequest.Id;
                        MerchantRequest.MerchantName = MerchantsRequest.Name;
                        MerchantRequest.MerchantID = MerchantsRequest.MerchantID;
                        MerchantRequest.RequestDescription = MerchantsRequest.Description;
                        MerchantRequest.SourceLocation = MerchantsRequest.LookupCountry.Description;
                        string CategoryName = "";
                        if (MerchantsRequest.MerchantCategory.Count > 0)
                        {
                            foreach (var MerchantsCategoryRequest in MerchantsRequest.MerchantCategory)
                            {
                                CategoryName += MerchantsCategoryRequest.Category.Name + ", ";


                            }
                            MerchantRequest.Categories = CategoryName.TrimEnd().TrimEnd(',');
                        }
                        string SellCountries = "";
                        if (MerchantsRequest.MerchantSellCountries.Count > 0)
                        {
                            foreach (var MerchantsSellCountriesRequest in MerchantsRequest.MerchantSellCountries)
                            {
                                SellCountries += MerchantsSellCountriesRequest.LookupTypeValues.Description + ", ";


                            }
                            MerchantRequest.OperatingCountries = SellCountries.TrimEnd().TrimEnd(',');
                        }
                        //MerchantRequest.OperatingCountries = MerchantsRequest.SellCountries;
                        MerchantRequest.RequestStatus = MerchantsRequest.LookupTypeValues.Description;
                        MerchantRequest.RequestAssignee = MerchantsRequest.Naqelid;
                        MerchantRequest.RequestAssigneeName = MerchantsRequest.FirstName + ' ' + MerchantsRequest.LastName;
                        MerchantRequest.RequestCreatedOn = Mingrouplist.CreatedDate;
                        MerchantRequest.MerchantContractNumber = MerchantsRequest.MerchantContractNumber;
                        MerchantRequestlist.Add(MerchantRequest);
                    }
                }
                return MerchantRequestlist.OrderByDescending(M => M.RequestCreatedOn).ToList();
            }
            else if (NaqelRequestDto.RequestType == "NO")
            {
                var getMerchantRequest = (from s in this.Repository
                                          select new
                                          {
                                              s.Id,
                                              s.Merchant.Name,
                                              s.Merchant.ApprovalStatus,
                                              s.MerchantID,
                                              s.CreatedDate,
                                              s.NaqelUsers.FirstName,
                                              s.NaqelUsers.LastName,
                                              s.NaqelUsers.Email,
                                              Naqelid = s.NaqelUsers.Id,
                                              s.Merchant.LookupCountry,
                                              s.Merchant.MerchantCategory,
                                              s.Merchant.SellCountries,
                                              s.Merchant.MerchantSellCountries,
                                              s.LookupTypeValues,
                                              s.Description,
                                              s.Merchant.MerchantAccountDetails.MerchantContractNumber,
                                              MerchantRequests = s.ApprovalStatus,

                                          }).Where(M => M.ApprovalStatus == M.MerchantRequests)
                                            .Where(M => M.LookupTypeValues.Description != "Open")
                                            .ToList();

                if (NaqelRequestDto.NaqelUserType != "NSA" && NaqelRequestDto.NaqelUserType != "NA")
                {

                    getMerchantRequest = getMerchantRequest.Where(s => s.Email == NaqelRequestDto.NaqelUserEmail).ToList();
                }
                foreach (var MerchantsRequest in getMerchantRequest)
                {
                    var getgrouplist = (from grouplist in this.Repository
                                        where grouplist.MerchantID == MerchantsRequest.MerchantID
                                        group grouplist by grouplist.MerchantID into g
                                        select new
                                        {
                                            MerchantID = g.Key,
                                            CreatedDate = g.Max(t => t.CreatedDate),

                                        }).FirstOrDefault();

                    var Mingrouplist = (from grouplist in this.Repository
                                        where grouplist.MerchantID == MerchantsRequest.MerchantID
                                        group grouplist by grouplist.MerchantID into g
                                        select new
                                        {
                                            MerchantID = g.Key,
                                            CreatedDate = g.Min(t => t.CreatedDate),

                                        }).FirstOrDefault();
                    if (getgrouplist.MerchantID == MerchantsRequest.MerchantID && getgrouplist.CreatedDate == MerchantsRequest.CreatedDate)
                    {

                        MerchantRequestDto MerchantRequest = new MerchantRequestDto();

                        MerchantRequest.RequestID = MerchantsRequest.Id;
                        MerchantRequest.MerchantName = MerchantsRequest.Name;
                        MerchantRequest.MerchantID = MerchantsRequest.MerchantID;
                        MerchantRequest.RequestDescription = MerchantsRequest.Description;
                        MerchantRequest.SourceLocation = MerchantsRequest.LookupCountry.Description;
                        string CategoryName = "";
                        if (MerchantsRequest.MerchantCategory.Count > 0)
                        {
                            foreach (var MerchantsCategoryRequest in MerchantsRequest.MerchantCategory)
                            {
                                CategoryName += MerchantsCategoryRequest.Category.Name + ", ";


                            }
                            MerchantRequest.Categories = CategoryName.TrimEnd().TrimEnd(',');
                        }
                        string SellCountries = "";
                        if (MerchantsRequest.MerchantSellCountries.Count > 0)
                        {
                            foreach (var MerchantsSellCountriesRequest in MerchantsRequest.MerchantSellCountries)
                            {
                                SellCountries += MerchantsSellCountriesRequest.LookupTypeValues.Description + ", ";


                            }
                            MerchantRequest.OperatingCountries = SellCountries.TrimEnd().TrimEnd(',');
                        }
                        //MerchantRequest.OperatingCountries = MerchantsRequest.SellCountries;
                        MerchantRequest.RequestStatus = MerchantsRequest.LookupTypeValues.Description;
                        MerchantRequest.RequestAssignee = MerchantsRequest.Naqelid;
                        MerchantRequest.RequestAssigneeName = MerchantsRequest.FirstName + ' ' + MerchantsRequest.LastName;
                        MerchantRequest.RequestCreatedOn = Mingrouplist.CreatedDate;
                        MerchantRequest.MerchantContractNumber = MerchantsRequest.MerchantContractNumber;
                        MerchantRequestlist.Add(MerchantRequest);
                    }

                }
                return MerchantRequestlist.OrderByDescending(M => M.RequestCreatedOn).ToList();

            }
            return MerchantRequestlist.OrderByDescending(M => M.RequestCreatedOn).ToList();
        }
        public async Task InsertRequestDetails(int MerchantID, int ApprovalStatus, string Description, int RequestAssignee, string MerchantRequestGUID)
        {


            await Repository.InsertAsync(new MerchantRequest
            {
                MerchantID = MerchantID,
                ApprovalStatus = ApprovalStatus,
                Description = Description,
                RequestAssignee = RequestAssignee,
                MerchantRequestGUID = MerchantRequestGUID,
            });
        }


        public async Task UpdateRequestDetails(int MerchantRequestID, int ApprovalStatus, string Description, int RequestAssignee, string MerchantRequestGUID)
        {

            var UpdateRequest = Repository.SingleOrDefault(m => m.Id == MerchantRequestID);
            UpdateRequest.ApprovalStatus = ApprovalStatus;
            UpdateRequest.Description = Description;
            UpdateRequest.RequestAssignee = RequestAssignee;
            await Repository.UpdateAsync(UpdateRequest);
        }
        public async Task<List<merchantcontractdetailsDto>> Getmerchantcontract()
        {

            var getmerchantdetails = (from s in this.Repository
                                      where s.Merchant.Users.Status == 1
                                      where s.Merchant.MerchantRequest.LookupTypeValues.Description == "Approved"
                                      select new
                                      {
                                          MerchantRequest = s.Id,
                                          s.Merchant.Id,
                                          s.Merchant.Name,
                                          s.Merchant.MerchantContract,
                                      }).ToList();

            List<merchantcontractdetailsDto> merchantcontractdetailslist = new List<merchantcontractdetailsDto>();
            foreach (var getcontractmerchant in getmerchantdetails)
            {
                merchantcontractdetailsDto merchantcontractdetailsDto = new merchantcontractdetailsDto();
                merchantcontractdetailsDto.MerchantID = getcontractmerchant.Id;
                merchantcontractdetailsDto.MerchantName = getcontractmerchant.Name;
                merchantcontractdetailsDto.MerchantrequestID = getcontractmerchant.MerchantRequest;
                if (getcontractmerchant.MerchantContract.Count == 0)
                {
                    merchantcontractdetailsDto.ContractUploaddate = "Pending";
                }
                foreach (var getMerchantContract in getcontractmerchant.MerchantContract)
                {
                    merchantcontractdetailsDto.ActiveContractFileName = getMerchantContract.CurrentContractFileName;
                    merchantcontractdetailsDto.ContractUploaddate = getMerchantContract.UpdatedDate.ToString();
                    merchantcontractdetailsDto.merchantcontractsHistory = new List<merchantcontractdetailsHistoryDto>();
                    foreach (var merchantcontract in getMerchantContract.MerchantContractDetails.OrderByDescending(s => s.CreatedDate))
                    {
                        merchantcontractdetailsHistoryDto merchantcontractdetailsHistoryDto = new merchantcontractdetailsHistoryDto();

                        merchantcontractdetailsHistoryDto.ContractFileName = merchantcontract.ContractFileName;
                        merchantcontractdetailsHistoryDto.ContractFileURL = merchantcontract.ContractFileName;
                        merchantcontractdetailsHistoryDto.ContractUploaddate = merchantcontract.CreatedDate;
                        merchantcontractdetailsDto.merchantcontractsHistory.Add(merchantcontractdetailsHistoryDto);
                    }
                }
                merchantcontractdetailslist.Add(merchantcontractdetailsDto);
            }
            return merchantcontractdetailslist;

        }
        public async Task<int> GetMerchantRequestId(string MerchantRequestGUID)
        {
            var getMerchantRequestId = this.Repository.Where(m => m.MerchantRequestGUID == MerchantRequestGUID).SingleOrDefault();
            if (getMerchantRequestId == null)
                return 0;
            return getMerchantRequestId.Id;
        }
        public List<GetMerchantBonusDto> GetAll()
        {
            //return Repository.OrderBy(x => x.Priority).ToList();

            var getMerchantBonus = (from s in this.Repository
                                    where s.Merchant.MerchantRequest.LookupTypeValues.Description == "Approved"
                                    select new
                                    {
                                        s.Merchant.Id,
                                        s.Merchant.Name,
                                        s.Merchant.MerchantBonus.WalletPoints,
                                        s.Merchant.MerchantBonus.WalletAmount,
                                        s.Merchant.LookupCountry.Description
                                    }).ToList();
            List<GetMerchantBonusDto> GetMerchantBonuslist = new List<GetMerchantBonusDto>();
            foreach (var MerchantBonus in getMerchantBonus)
            {
                GetMerchantBonusDto GetMerchantBonusDto = new GetMerchantBonusDto();

                GetMerchantBonusDto.MerchantID = MerchantBonus.Id;
                GetMerchantBonusDto.MerchantName = MerchantBonus.Name;
                if (MerchantBonus.WalletPoints != null)
                {
                    GetMerchantBonusDto.WalletPoints = MerchantBonus.WalletPoints;
                }
                else
                {
                    GetMerchantBonusDto.WalletPoints = 0;
                }
                if (MerchantBonus.WalletAmount != null)
                {
                    GetMerchantBonusDto.WalletAmount = MerchantBonus.WalletAmount;
                }
                else
                {
                    GetMerchantBonusDto.WalletAmount = 0;
                }
                GetMerchantBonusDto.MerchantCountry = MerchantBonus.Description;
                GetMerchantBonuslist.Add(GetMerchantBonusDto);
            }

            return GetMerchantBonuslist;
        }
    }
}

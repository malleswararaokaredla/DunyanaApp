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
    public class DealsService : EntityService<Deals, DealsRepository>
    {
        DateTime Presentdate = DateTime.Now;
        private readonly MerchantDealService _MerchantDealService;
        private readonly LookupTypeValuesService _LookupTypeValuesService;
        public DealsService(DealsRepository repository, LookupTypeValuesService LookupTypeValuesService,
         IHttpContextAccessor httpContextAccessor, MerchantDealService MerchantDealService) : base(repository, httpContextAccessor)
        {
            _MerchantDealService = MerchantDealService;
            _LookupTypeValuesService = LookupTypeValuesService;

        }
        public async Task<List<GetDealDto>> GetAllDeal(string Ipcountry, string CountryTimezone)
        {
            var getDeallist = (from s in this.Repository
                               select new
                               {
                                   s.Id,
                                   s.MerchantId,
                                   s.Merchant.Name,
                                   s.Merchant.Email,
                                   MerchantStatus = s.Merchant.Users.Status,
                                   s.DealName,
                                   s.DealCode,
                                   s.Country,
                                   s.EnglishImage,
                                   s.ArabicImage,
                                   s.DealURL,
                                   s.DealDescription,
                                   s.Status,
                                   s.StartDate,
                                   s.EndDate,
                                   s.MerchantDeal,
                                   s.TimeZone,
                               }).Where(m => m.Status.Equals(1) && m.MerchantStatus.Equals(1))
                                 .OrderBy(m => m.StartDate).ToList();

            List<GetDealDto> Deallist = new List<GetDealDto>();
            if (Ipcountry.ToUpper() != "NULL" && CountryTimezone.ToUpper() != "NULL")
            {
                int countryID = await _LookupTypeValuesService.GetCountryID(Ipcountry);
                DateTime Timezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Presentdate, TimeZoneInfo.Local.Id, CountryTimezone);
                if (getDeallist.Count > 0)
                {
                    foreach (var Deal in getDeallist)
                    {
                        DateTime StartTimezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Deal.StartDate, Deal.TimeZone, CountryTimezone);
                        DateTime ENDTimezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Deal.EndDate, Deal.TimeZone, CountryTimezone);
                        if (StartTimezone <= Timezone && ENDTimezone >= Timezone)
                        {
                            int DealCountries = 0;
                            foreach (var MerchantDeal in Deal.MerchantDeal)
                            {
                                if (MerchantDeal.CountryID == countryID)
                                {
                                    DealCountries++;
                                }
                            }
                            if (DealCountries > 0)
                            {
                                GetDealDto DealDto = new GetDealDto();

                                DealDto.DealId = Deal.Id;
                                DealDto.MerchantId = Deal.MerchantId;
                                DealDto.MerchantName = Deal.Name;
                                DealDto.Countries = Deal.Country;
                                DealDto.EnglishImage = Deal.EnglishImage;
                                DealDto.ArabicImage = Deal.ArabicImage;
                                if (!string.IsNullOrEmpty(Deal.DealURL))
                                {
                                    if (Deal.DealURL.ToUpper().Contains("HTTP") || Deal.DealURL.ToUpper().Contains("HTTPS"))
                                    {
                                        DealDto.DealURL = Deal.DealURL;
                                    }
                                    else
                                    {
                                        DealDto.DealURL = "http://" + Deal.DealURL;
                                    }
                                }
                                DealDto.DealName = Deal.DealName;
                                DealDto.DealDescription = Deal.DealDescription;
                                DealDto.StartDate = Deal.StartDate;
                                DealDto.EndDate = Deal.EndDate;
                                DealDto.Status = Deal.Status;
                                Deallist.Add(DealDto);
                            }
                        }
                    }
                }
            }

            return Deallist.ToList();

        }
        public async Task<List<GetDealDto>> GetDealByMerchant(MerchantDealDto MerchantDealDto)
        {
            var getDeallist = (from s in this.Repository
                               select new
                               {
                                   s.Id,
                                   s.MerchantId,
                                   s.Merchant.Name,
                                   s.Merchant.Email,
                                   MerchantStatus = s.Merchant.Users.Status,
                                   s.DealName,
                                   s.DealCode,
                                   s.Country,
                                   s.EnglishImage,
                                   s.ArabicImage,
                                   s.DealURL,
                                   s.DealDescription,
                                   s.Status,
                                   s.StartDate,
                                   s.EndDate,
                               }).Where(m => m.Email == MerchantDealDto.MerchantEmail).OrderBy(m => m.StartDate).ToList();
            DateTime Timezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Presentdate, TimeZoneInfo.Local.Id, MerchantDealDto.CountryTimezone);
            if (MerchantDealDto.Type == "A")
            {
                getDeallist = getDeallist.Where(m => m.Status.Equals(1) && m.MerchantStatus.Equals(1))
                                             .Where(m => m.EndDate >= Timezone).ToList();
            }
            else
            {
                getDeallist = getDeallist.Where(m => m.MerchantStatus.Equals(1))
                                             .Where(m => m.EndDate <= Timezone).ToList();
            }
            List<GetDealDto> Deallist = new List<GetDealDto>();
            foreach (var Deal in getDeallist)
            {
                GetDealDto DealDto = new GetDealDto();

                DealDto.DealId = Deal.Id;
                DealDto.MerchantId = Deal.MerchantId;
                DealDto.MerchantName = Deal.Name;
                DealDto.DealName = Deal.DealName;
                DealDto.DealCode = Deal.DealCode;
                DealDto.Countries = Deal.Country;
                DealDto.EnglishImage = Deal.EnglishImage;
                DealDto.ArabicImage = Deal.ArabicImage;
                DealDto.DealURL = Deal.DealURL;
                DealDto.DealDescription = Deal.DealDescription;
                DealDto.StartDate = Deal.StartDate;
                DealDto.EndDate = Deal.EndDate;
                DealDto.Status = Deal.Status;
                Deallist.Add(DealDto);
            }

            return Deallist.ToList();

        }
        public async Task<int> GetDealid(int Merchantid, string Countrys, string ArabicImage, string EnglishImage)
        {
            var isvalid = Repository.Where(x => x.MerchantId == Merchantid).Where(x => x.Country == Countrys)
                                    .Where(x => x.ArabicImage == ArabicImage).Where(x => x.EnglishImage == EnglishImage).SingleOrDefault();
            if (isvalid == null)
                return 0;
            return isvalid.Id;
        }
        public async Task<string> InsertDealDetails(DealDto DealDto, int Merchantid)
        {
            DateTime Timezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Presentdate, TimeZoneInfo.Local.Id, DealDto.CountryTimezone);
            int ActiveDeallist = this.Repository.Where(m => m.EndDate >= Timezone)
                                                  .Where(m => m.Status.Equals(1))
                                                  .Where(m => m.MerchantId == Merchantid).Count();

            if (DealDto.StartDate > Timezone && DealDto.EndDate > DealDto.StartDate)
            {
                if (ActiveDeallist < 3)
                {

                    await Repository.InsertAsync(new Deals
                    {
                        MerchantId = Merchantid,
                        DealName = DealDto.DealName,
                        DealCode = DealDto.DealCode,
                        Country = DealDto.Countries,
                        EnglishImage = DealDto.EnglishImage,
                        ArabicImage = DealDto.ArabicImage,
                        DealURL = DealDto.DealURL,
                        DealDescription = DealDto.DealDescription,
                        StartDate = DealDto.StartDate,
                        EndDate = DealDto.EndDate,
                        TimeZone = DealDto.CountryTimezone,
                        Status = 1
                    });
                    return "Deal created successfully";
                }
                else
                {
                    return "Deal is not created, we allow only three active Deals";
                }

            }
            else if (DealDto.StartDate < Timezone)
            {
                return "Please select the start date is greater then present date";
            }
            else
            {
                return "Please select the end date is greater then start date.";
            }
        }
        public async Task<string> UpdateDeals(UpdateDealDto UpdateDealDto)
        {
            DateTime Timezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Presentdate, TimeZoneInfo.Local.Id, UpdateDealDto.CountryTimezone);
            var DealDetails = Repository.SingleOrDefault(x => x.Id == UpdateDealDto.DealId);
            if (DealDetails.EndDate > Timezone && (DealDetails.StartDate > Timezone || DealDetails.StartDate == UpdateDealDto.StartDate))
            {

                if (UpdateDealDto.EndDate > Timezone && UpdateDealDto.EndDate > UpdateDealDto.StartDate)
                {
                    if (!string.IsNullOrEmpty(UpdateDealDto.DealName))
                    {
                        DealDetails.DealName = UpdateDealDto.DealName;
                    }
                    if (!string.IsNullOrEmpty(UpdateDealDto.DealCode))
                    {
                        DealDetails.DealCode = UpdateDealDto.DealCode;
                    }
                    if (!string.IsNullOrEmpty(UpdateDealDto.Countries))
                    {
                        await _MerchantDealService.deleteMerchantDeal(UpdateDealDto.DealId);
                        await _MerchantDealService.InsertMerchantDealDetails(UpdateDealDto.MerchantId, UpdateDealDto.Countries, UpdateDealDto.DealId);
                        DealDetails.Country = UpdateDealDto.Countries;

                    }
                    if (!string.IsNullOrEmpty(UpdateDealDto.EnglishImage))
                    {
                        DealDetails.EnglishImage = UpdateDealDto.EnglishImage;
                    }
                    if (!string.IsNullOrEmpty(UpdateDealDto.ArabicImage))
                    {
                        DealDetails.ArabicImage = UpdateDealDto.ArabicImage;
                    }
                    if (!string.IsNullOrEmpty(UpdateDealDto.DealURL))
                    {
                        DealDetails.DealURL = UpdateDealDto.DealURL;
                    }
                    if (!string.IsNullOrEmpty(UpdateDealDto.DealDescription))
                    {
                        DealDetails.DealDescription = UpdateDealDto.DealDescription;
                    }
                    if (!string.IsNullOrEmpty(UpdateDealDto.StartDate.ToString()))
                    {
                        DealDetails.StartDate = UpdateDealDto.StartDate;
                    }
                    if (!string.IsNullOrEmpty(UpdateDealDto.EndDate.ToString()))
                    {
                        DealDetails.EndDate = UpdateDealDto.EndDate;
                    }
                    if (!string.IsNullOrEmpty(UpdateDealDto.CountryTimezone.ToString()))
                    {
                        DealDetails.TimeZone = UpdateDealDto.CountryTimezone;
                    }
                    await Repository.UpdateAsync(DealDetails);

                    return "Deal updated successfully";
                }
                else if (UpdateDealDto.EndDate < Timezone)
                {
                    return "Please select the end date is greater then present date";
                }
                else
                {
                    return "Please select the end date is greater then start date.";
                }
            }
            else if (DealDetails.EndDate < Timezone)
            {
                return "Sorry you deal was expired";
            }
            else
            {
                return "Sorry you are not allowed to update, deal is live now";
            }

        }
        public async Task<string> DeleteDeal(DeleteDealDto DeleteDealDto)
        {
            var GetDealdetails = Repository.SingleOrDefault(x => x.Id == DeleteDealDto.DealId);
            DateTime Timezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Presentdate, TimeZoneInfo.Local.Id, DeleteDealDto.CountryTimezone);
            if (GetDealdetails.StartDate > Timezone)
            {
                GetDealdetails.Status = 0;
                await Repository.UpdateAsync(GetDealdetails);
                return "Deal deleted successfully";
            }
            else
            {
                return "Sorry you are not allowed to update,Deal is live now";
            }

        }
    }
}

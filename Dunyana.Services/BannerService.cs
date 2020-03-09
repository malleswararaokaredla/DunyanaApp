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
    public class BannerService : EntityService<Banner, BannerRepository>
    {
        string GetPresentdate = DateTime.Now.ToString("MM-dd-yyyy HH:mm");
        private readonly MerchantBannerService _MerchantBannerService;
        private readonly LookupTypeValuesService _LookupTypeValuesService;
        public BannerService(BannerRepository repository, LookupTypeValuesService LookupTypeValuesService,
         IHttpContextAccessor httpContextAccessor, MerchantBannerService MerchantBannerService) : base(repository, httpContextAccessor)
        {
            _MerchantBannerService = MerchantBannerService;
            //_BannerService = BannerService;
            _LookupTypeValuesService = LookupTypeValuesService;

        }
        public async Task<List<GetBannerDto>> GetAllBanner(string Ipcountry, string CountryTimezone)
        {
            DateTime Presentdate = Convert.ToDateTime(GetPresentdate);
            var getBannerlist = (from s in this.Repository
                                 select new
                                 {
                                     s.Id,
                                     s.MerchantID,
                                     s.Merchant.Name,
                                     s.Merchant.Email,
                                     MerchantStatus = s.Merchant.Users.Status,
                                     s.Country,
                                     s.EnglishImage,
                                     s.ArabicImage,
                                     s.BannerURL,
                                     s.BannerDescription,
                                     s.Status,
                                     s.StartDate,
                                     s.EndDate,
                                     s.MerchantBanner,
                                     s.TimeZone,
                                 }).Where(m => m.Status.Equals(1) && m.MerchantStatus.Equals(1))
                                   .OrderBy(m => m.StartDate).ToList();
            List<GetBannerDto> Bannerlist = new List<GetBannerDto>();
            if (Ipcountry.ToUpper() != "NULL" && CountryTimezone.ToUpper() != "NULL")
            {
                int countryID = await _LookupTypeValuesService.GetCountryID(Ipcountry);
                DateTime Timezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Presentdate, TimeZoneInfo.Local.Id, CountryTimezone);
                if (getBannerlist.Count > 0)
                {
                    foreach (var Banner in getBannerlist)
                    {
                        DateTime StartTimezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Banner.StartDate, Banner.TimeZone, CountryTimezone);
                        DateTime ENDTimezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Banner.EndDate, Banner.TimeZone, CountryTimezone);
                        if (StartTimezone <= Timezone && ENDTimezone >= Timezone)
                        {
                            int BannerCountries = 0;
                            foreach (var MerchantBanner in Banner.MerchantBanner)
                            {
                                if (MerchantBanner.CountryID == countryID)
                                {
                                    BannerCountries++;
                                }
                            }
                            if (BannerCountries > 0)
                            {
                                GetBannerDto BannerDto = new GetBannerDto();

                                BannerDto.BannerId = Banner.Id;
                                BannerDto.MerchantId = Banner.MerchantID;
                                BannerDto.MerchantName = Banner.Name;
                                BannerDto.Countries = Banner.Country;
                                BannerDto.EnglishImage = Banner.EnglishImage;
                                BannerDto.ArabicImage = Banner.ArabicImage;
                                BannerDto.BannerURL = Banner.BannerURL;
                                if (!string.IsNullOrEmpty(Banner.BannerURL))
                                {
                                    if (Banner.BannerURL.ToUpper().Contains("HTTP") || Banner.BannerURL.ToUpper().Contains("HTTPS"))
                                    {
                                        BannerDto.BannerURL = Banner.BannerURL;
                                    }
                                    else
                                    {
                                        BannerDto.BannerURL = "http://" + Banner.BannerURL;
                                    }
                                }
                                BannerDto.BannerDescription = Banner.BannerDescription;
                                BannerDto.StartDate = Banner.StartDate;
                                BannerDto.EndDate = Banner.EndDate;
                                BannerDto.Status = Banner.Status;
                                Bannerlist.Add(BannerDto);
                            }
                        }
                    }
                }
            }

            return Bannerlist.ToList();

        }
        public async Task<List<GetBannerDto>> GetBannerByMerchant(MerchantBannerDto MerchantBannerDto)
        {
            DateTime Presentdate = Convert.ToDateTime(GetPresentdate);
            var getBannerlist = (from s in this.Repository
                                 select new
                                 {
                                     s.Id,
                                     s.MerchantID,
                                     s.Merchant.Name,
                                     s.Merchant.Email,
                                     MerchantStatus = s.Merchant.Users.Status,
                                     s.Country,
                                     s.EnglishImage,
                                     s.ArabicImage,
                                     s.BannerURL,
                                     s.BannerDescription,
                                     s.Status,
                                     s.StartDate,
                                     s.EndDate,
                                 }).Where(m => m.Email == MerchantBannerDto.MerchantEmail).OrderBy(m => m.StartDate).ToList();
            DateTime Timezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Presentdate, TimeZoneInfo.Local.Id, MerchantBannerDto.CountryTimezone);
            if (MerchantBannerDto.Type == "A")
            {
                getBannerlist = getBannerlist.Where(m => m.Status.Equals(1) && m.MerchantStatus.Equals(1))
                                             .Where(m => m.EndDate >= Timezone).ToList();
            }
            else
            {
                getBannerlist = getBannerlist.Where(m => m.MerchantStatus.Equals(1))
                                             .Where(m => m.EndDate <= Timezone).ToList();
            }
            List<GetBannerDto> Bannerlist = new List<GetBannerDto>();
            foreach (var Banner in getBannerlist)
            {
                GetBannerDto BannerDto = new GetBannerDto();

                BannerDto.BannerId = Banner.Id;
                BannerDto.MerchantId = Banner.MerchantID;
                BannerDto.MerchantName = Banner.Name;
                BannerDto.Countries = Banner.Country;
                BannerDto.EnglishImage = Banner.EnglishImage;
                BannerDto.ArabicImage = Banner.ArabicImage;
                BannerDto.BannerURL = Banner.BannerURL;
                BannerDto.BannerDescription = Banner.BannerDescription;
                BannerDto.StartDate = Banner.StartDate;
                BannerDto.EndDate = Banner.EndDate;
                BannerDto.Status = Banner.Status;
                Bannerlist.Add(BannerDto);
            }

            return Bannerlist.ToList();

        }
        public async Task<int> GetBannerid(int Merchantid, string Countrys, string ArabicImage, string EnglishImage)
        {
            var isvalid = Repository.Where(x => x.MerchantID == Merchantid).Where(x => x.Country == Countrys)
                                    .Where(x => x.ArabicImage == ArabicImage).Where(x => x.EnglishImage == EnglishImage).SingleOrDefault();
            if (isvalid == null)
                return 0;
            return isvalid.Id;
        }
        public async Task<string> InsertBannerDetails(BannerDto BannerDto, int Merchantid)
        {
            DateTime Presentdate = Convert.ToDateTime(GetPresentdate);
            DateTime Timezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Presentdate, TimeZoneInfo.Local.Id, BannerDto.CountryTimezone);
            int ActiveBannerlist = this.Repository.Where(m => m.EndDate >= Timezone)
                                                  .Where(m => m.Status.Equals(1))
                                                  .Where(m => m.MerchantID == Merchantid).Count();

            if (BannerDto.StartDate > Timezone && BannerDto.EndDate > BannerDto.StartDate)
            {
                if (ActiveBannerlist < 3)
                {

                    await Repository.InsertAsync(new Banner
                    {
                        MerchantID = Merchantid,
                        Country = BannerDto.Countries,
                        EnglishImage = BannerDto.EnglishImage,
                        ArabicImage = BannerDto.ArabicImage,
                        BannerURL = BannerDto.BannerURL,
                        BannerDescription = BannerDto.BannerDescription,
                        StartDate = BannerDto.StartDate,
                        EndDate = BannerDto.EndDate,
                        TimeZone = BannerDto.CountryTimezone,
                        Status = 1
                    });
                    return "Banner created successfully";
                }
                else
                {
                    return "Banner is not created, we allow only three active Banners";
                }

            }
            else if (BannerDto.StartDate < Timezone)
            {
                return "Please select the start date is greater then present date";
            }
            else
            {
                return "Please select the end date is greater then start date.";
            }
        }
        public async Task<string> UpdateBanners(UpdateBannerDto UpdateBannerDto)
        {
            DateTime Presentdate = Convert.ToDateTime(GetPresentdate);
            DateTime Timezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Presentdate, TimeZoneInfo.Local.Id, UpdateBannerDto.CountryTimezone);
            var BannerDetails = Repository.SingleOrDefault(x => x.Id == UpdateBannerDto.BannerId);
            if (BannerDetails.EndDate > Timezone && (BannerDetails.StartDate > Timezone || BannerDetails.StartDate == UpdateBannerDto.StartDate))
            {

                if (UpdateBannerDto.EndDate > Timezone && UpdateBannerDto.EndDate > UpdateBannerDto.StartDate)
                {
                    if (!string.IsNullOrEmpty(UpdateBannerDto.Countries))
                    {
                        await _MerchantBannerService.deleteMerchantBanner(UpdateBannerDto.BannerId);
                        await _MerchantBannerService.InsertMerchantBannerDetails(UpdateBannerDto.MerchantId, UpdateBannerDto.Countries, UpdateBannerDto.BannerId);
                        BannerDetails.Country = UpdateBannerDto.Countries;

                    }
                    if (!string.IsNullOrEmpty(UpdateBannerDto.EnglishImage))
                    {
                        BannerDetails.EnglishImage = UpdateBannerDto.EnglishImage;
                    }
                    if (!string.IsNullOrEmpty(UpdateBannerDto.ArabicImage))
                    {
                        BannerDetails.ArabicImage = UpdateBannerDto.ArabicImage;
                    }
                    if (!string.IsNullOrEmpty(UpdateBannerDto.BannerURL))
                    {
                        BannerDetails.BannerURL = UpdateBannerDto.BannerURL;
                    }
                    if (!string.IsNullOrEmpty(UpdateBannerDto.BannerDescription))
                    {
                        BannerDetails.BannerDescription = UpdateBannerDto.BannerDescription;
                    }
                    if (!string.IsNullOrEmpty(UpdateBannerDto.StartDate.ToString()))
                    {
                        BannerDetails.StartDate = UpdateBannerDto.StartDate;
                    }
                    if (!string.IsNullOrEmpty(UpdateBannerDto.EndDate.ToString()))
                    {
                        BannerDetails.EndDate = UpdateBannerDto.EndDate;
                    }
                    if (!string.IsNullOrEmpty(UpdateBannerDto.CountryTimezone.ToString()))
                    {
                        BannerDetails.TimeZone = UpdateBannerDto.CountryTimezone;
                    }
                    await Repository.UpdateAsync(BannerDetails);

                    return "Banner updated successfully";
                }
                else if (UpdateBannerDto.StartDate < Timezone)
                {
                    return "Please select the start date is greater then present date";
                }
                else
                {
                    return "Please select the end date is greater then start date.";
                }
            }
            else
            {
                return "Sorry you are not allowed to update,Banner is live now";
            }

        }
        public async Task<string> DeleteBanners(DeleteBannerDto DeleteBannerDto)
        {
            DateTime Presentdate = Convert.ToDateTime(GetPresentdate);
            DateTime Timezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Presentdate, TimeZoneInfo.Local.Id, DeleteBannerDto.CountryTimezone);
            var GetBannerdetails = Repository.SingleOrDefault(x => x.Id == DeleteBannerDto.BannerId);

            if (GetBannerdetails.StartDate > Timezone)
            {
                GetBannerdetails.Status = 0;
                await Repository.UpdateAsync(GetBannerdetails);
                return "Banner deleted successfully";
            }
            else
            {
                return "Sorry you are not allowed to update,Banner is live now";
            }

        }
    }
}

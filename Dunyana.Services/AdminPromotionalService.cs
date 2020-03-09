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
    public class AdminPromotionalService : EntityService<AdminPromotional, AdminPromotionalRepository>
    {
        string GetPresentdate = DateTime.Now.ToString("MM-dd-yyyy HH:mm");

        private readonly AdminPromotionalCountriesService _AdminPromotionalCountriesService;
        private readonly LookupTypeValuesService _LookupTypeValuesService;
        public AdminPromotionalService(AdminPromotionalRepository repository, AdminPromotionalCountriesService AdminPromotionalCountriesService, LookupTypeValuesService LookupTypeValuesService,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {
            _AdminPromotionalCountriesService = AdminPromotionalCountriesService;
            _LookupTypeValuesService = LookupTypeValuesService;

        }
        public async Task<List<GetAdminPromotionalDto>> GetAdminHomePromotional(string Ipcountry, string CountryTimezone)
        {
            var getAdminPromotionallist = (from s in this.Repository
                                           select new
                                           {
                                               s.Id,
                                               s.Promotionalcountries,
                                               s.EnglishImage,
                                               s.ArabicImage,
                                               s.PromotionalURL,
                                               s.AdminPromotionalCountries,
                                               s.Promotionaldescription,
                                               s.Status,
                                               s.StartDate,
                                               s.EndDate,
                                               s.IsDefault,
                                               s.TimeZone,
                                           }).Where(m => m.Status.Equals(1))
                                            .OrderBy(m => m.StartDate).ToList();
            List<GetAdminPromotionalDto> Promotionallist = new List<GetAdminPromotionalDto>();
            if (Ipcountry.ToUpper() != "NULL" && CountryTimezone.ToUpper() != "NULL")
            {
                int countryID = await _LookupTypeValuesService.GetCountryID(Ipcountry);
                DateTime Presentdate = Convert.ToDateTime(GetPresentdate);
                DateTime Timezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Presentdate, TimeZoneInfo.Local.Id, CountryTimezone);
                
                if (getAdminPromotionallist.Count > 0)
                {
                    var getAdminPromotionalActivelist = getAdminPromotionallist.Where(m => m.IsDefault != "1");

                    foreach (var AdminPromotional in getAdminPromotionalActivelist)
                    {
                        DateTime StartTimezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(AdminPromotional.StartDate, AdminPromotional.TimeZone, CountryTimezone);
                        DateTime ENDTimezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(AdminPromotional.EndDate, AdminPromotional.TimeZone, CountryTimezone);
                        if (StartTimezone <= Timezone && ENDTimezone >= Timezone)
                        {
                            int PromotionalCountries = 0;
                            foreach (var AdminPromotionalCountries in AdminPromotional.AdminPromotionalCountries)
                            {
                                if (AdminPromotionalCountries.LookupTypeValues.Id == countryID)
                                {
                                    PromotionalCountries++;
                                }
                            }
                            if (PromotionalCountries > 0)
                            {
                                GetAdminPromotionalDto GetAdminPromotionalDto = new GetAdminPromotionalDto();

                                GetAdminPromotionalDto.PromotionalId = AdminPromotional.Id;
                                GetAdminPromotionalDto.Countries = AdminPromotional.Promotionalcountries;
                                GetAdminPromotionalDto.ArabicImage = AdminPromotional.ArabicImage;
                                GetAdminPromotionalDto.EnglishImage = AdminPromotional.EnglishImage;
                                GetAdminPromotionalDto.AdminPromotionalURL = AdminPromotional.PromotionalURL;
                                if (!string.IsNullOrEmpty(AdminPromotional.PromotionalURL))
                                {
                                    if (AdminPromotional.PromotionalURL.ToUpper().Contains("HTTP") || AdminPromotional.PromotionalURL.ToUpper().Contains("HTTPS"))
                                    {
                                        GetAdminPromotionalDto.AdminPromotionalURL = AdminPromotional.PromotionalURL;
                                    }
                                    else
                                    {
                                        GetAdminPromotionalDto.AdminPromotionalURL = "http://" + AdminPromotional.PromotionalURL;
                                    }
                                }
                                GetAdminPromotionalDto.AdminPromotionalDescription = AdminPromotional.Promotionaldescription;
                                GetAdminPromotionalDto.StartDate = AdminPromotional.StartDate;
                                GetAdminPromotionalDto.EndDate = AdminPromotional.EndDate;
                                GetAdminPromotionalDto.Status = AdminPromotional.Status;

                                Promotionallist.Add(GetAdminPromotionalDto);
                            }
                        }

                    }
                }

            }
            if (getAdminPromotionallist.Count > 0 && Promotionallist.Count == 0)
            {
                var getAdminPromotionalDefaultlist = getAdminPromotionallist.Where(m => m.IsDefault == "1");
                foreach (var AdminPromotional in getAdminPromotionalDefaultlist)
                {
                    GetAdminPromotionalDto GetAdminPromotionalDto = new GetAdminPromotionalDto();
                    GetAdminPromotionalDto.PromotionalId = AdminPromotional.Id;
                    GetAdminPromotionalDto.EnglishImage = AdminPromotional.EnglishImage;
                    GetAdminPromotionalDto.ArabicImage = AdminPromotional.ArabicImage;
                    GetAdminPromotionalDto.AdminPromotionalURL = AdminPromotional.PromotionalURL;
                    if (!string.IsNullOrEmpty(AdminPromotional.PromotionalURL))
                    {
                        if (AdminPromotional.PromotionalURL.ToUpper().Contains("HTTP") || AdminPromotional.PromotionalURL.ToUpper().Contains("HTTPS"))
                        {
                            GetAdminPromotionalDto.AdminPromotionalURL = AdminPromotional.PromotionalURL;
                        }
                        else
                        {
                            GetAdminPromotionalDto.AdminPromotionalURL = "http://" + AdminPromotional.PromotionalURL;
                        }
                    }
                    GetAdminPromotionalDto.AdminPromotionalDescription = AdminPromotional.Promotionaldescription;
                    GetAdminPromotionalDto.Status = AdminPromotional.Status;
                    Promotionallist.Add(GetAdminPromotionalDto);
                }
            }

            return Promotionallist.ToList();

        }
        public async Task<List<GetAdminPromotionalDto>> GetAdminPromotional(AdminPromotionalDto AdminPromotionalDto)
        {
            DateTime Presentdate = Convert.ToDateTime(GetPresentdate);
            DateTime Timezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Presentdate, TimeZoneInfo.Local.Id, AdminPromotionalDto.CountryTimezone);
            var getAdminPromotionallist = (from s in this.Repository
                                           select new
                                           {
                                               s.Id,
                                               s.Promotionalcountries,
                                               s.EnglishImage,
                                               s.ArabicImage,
                                               s.PromotionalURL,
                                               s.Promotionaldescription,
                                               s.Status,
                                               s.StartDate,
                                               s.EndDate,
                                               s.IsDefault,
                                               s.TimeZone,
                                           }).Where(m => m.Status.Equals(1))
                                           .OrderBy(m => m.StartDate).ToList();
            if (AdminPromotionalDto.Type == "A")
            {
                getAdminPromotionallist = getAdminPromotionallist.Where(m => m.Status.Equals(1))
                                                                .Where(m => m.EndDate >= Timezone).Where(m => m.IsDefault != "1").ToList();
            }
            else if (AdminPromotionalDto.Type == "E")
            {
                getAdminPromotionallist = getAdminPromotionallist.Where(m => m.Status.Equals(1))
                                                                 .Where(m => m.EndDate <= Timezone).Where(m => m.IsDefault != "1").ToList();
            }
            else if (AdminPromotionalDto.Type == "D")
            {
                getAdminPromotionallist = getAdminPromotionallist.Where(m => m.Status.Equals(1)).Where(m => m.IsDefault == "1").ToList();
            }
            List<GetAdminPromotionalDto> GetAdminPromotionalDto = new List<GetAdminPromotionalDto>();
            foreach (var AdminPromotional in getAdminPromotionallist)
            {
                GetAdminPromotionalDto getAdminPromotional = new GetAdminPromotionalDto();

                getAdminPromotional.PromotionalId = AdminPromotional.Id;
                getAdminPromotional.Countries = AdminPromotional.Promotionalcountries;
                getAdminPromotional.EnglishImage = AdminPromotional.EnglishImage;
                getAdminPromotional.ArabicImage = AdminPromotional.ArabicImage;
                getAdminPromotional.AdminPromotionalURL = AdminPromotional.PromotionalURL;
                getAdminPromotional.AdminPromotionalDescription = AdminPromotional.Promotionaldescription;
                getAdminPromotional.StartDate = AdminPromotional.StartDate;
                getAdminPromotional.EndDate = AdminPromotional.EndDate;
                getAdminPromotional.Status = AdminPromotional.Status;
                GetAdminPromotionalDto.Add(getAdminPromotional);
            }

            return GetAdminPromotionalDto.ToList();

        }
        public async Task<int> GetAdminPromotionalid(string ArabicImage, string EnglishImage)
        {
            var isvalid = Repository.Where(x => x.ArabicImage == ArabicImage).Where(x => x.EnglishImage == EnglishImage).SingleOrDefault();
            if (isvalid == null)
                return 0;
            return isvalid.Id;
        }
        public async Task<int> CheckAdminPromotionalDefault()
        {
            var isvalid = Repository.Where(x => x.IsDefault == "1" && x.Status.Equals(1)).SingleOrDefault();
            if (isvalid == null)
                return 0;
            return isvalid.Id;
        }
        public async Task<string> InsertAdminPromotionalDetails(InsertAdminPromotionalDto InsertAdminPromotionalDto)
        {
            DateTime Presentdate = Convert.ToDateTime(GetPresentdate);
            if (InsertAdminPromotionalDto.IsDefault == "0")
            {
                DateTime Timezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Presentdate, TimeZoneInfo.Local.Id, InsertAdminPromotionalDto.CountryTimezone);
                if (InsertAdminPromotionalDto.StartDate > Timezone && InsertAdminPromotionalDto.EndDate > InsertAdminPromotionalDto.StartDate)
                {
                    await Repository.InsertAsync(new AdminPromotional
                    {
                        Promotionalcountries = InsertAdminPromotionalDto.Countries,
                        EnglishImage = InsertAdminPromotionalDto.EnglishImage,
                        ArabicImage = InsertAdminPromotionalDto.ArabicImage,
                        PromotionalURL = InsertAdminPromotionalDto.AdminPromotionalURL,
                        Promotionaldescription = InsertAdminPromotionalDto.AdminPromotionalDescription,
                        StartDate = InsertAdminPromotionalDto.StartDate,
                        EndDate = InsertAdminPromotionalDto.EndDate,
                        TimeZone = InsertAdminPromotionalDto.CountryTimezone,
                        Status = 1
                    });
                    return "Admin Promotional created successfully";

                }
                else if (InsertAdminPromotionalDto.StartDate < Timezone)
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
                int DefaultID = await CheckAdminPromotionalDefault();
                if (DefaultID == 0)
                {
                    await Repository.InsertAsync(new AdminPromotional
                    {
                        EnglishImage = InsertAdminPromotionalDto.EnglishImage,
                        ArabicImage = InsertAdminPromotionalDto.ArabicImage,
                        PromotionalURL = InsertAdminPromotionalDto.AdminPromotionalURL,
                        Promotionaldescription = InsertAdminPromotionalDto.AdminPromotionalDescription,
                        StartDate = Presentdate,
                        EndDate = Presentdate,
                        Status = 1,
                        IsDefault = InsertAdminPromotionalDto.IsDefault,
                        TimeZone = InsertAdminPromotionalDto.CountryTimezone,
                    });
                    return "Admin Promotional created successfully";
                }
                else
                {
                    return "Admin Promotional is not created, we allow only one Default AdminPromotional";
                }
            }
            return "Admin Promotional created successfully";
        }
        public async Task<string> UpdateAdminPromotional(UpdateAdminPromotionalDto UpdateAdminPromotionalDto)
        {
            DateTime Presentdate = Convert.ToDateTime(GetPresentdate);
            DateTime Timezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Presentdate, TimeZoneInfo.Local.Id, UpdateAdminPromotionalDto.CountryTimezone);
            var AdminPromotionalDetails = Repository.SingleOrDefault(x => x.Id == UpdateAdminPromotionalDto.PromotionalId);
            if (AdminPromotionalDetails.IsDefault == "0" || String.IsNullOrEmpty(AdminPromotionalDetails.IsDefault))
            {
                if (AdminPromotionalDetails.EndDate > Timezone && (AdminPromotionalDetails.StartDate > Timezone || UpdateAdminPromotionalDto.StartDate == AdminPromotionalDetails.StartDate))
                {

                    if (UpdateAdminPromotionalDto.EndDate > Timezone && UpdateAdminPromotionalDto.EndDate > UpdateAdminPromotionalDto.StartDate)
                    {

                        if (!string.IsNullOrEmpty(UpdateAdminPromotionalDto.Countries))
                        {
                            await _AdminPromotionalCountriesService.deleteAdminPromotional(UpdateAdminPromotionalDto.PromotionalId);
                            await _AdminPromotionalCountriesService.InsertAdminPromotionalCountriesDetails(UpdateAdminPromotionalDto.Countries, UpdateAdminPromotionalDto.PromotionalId);
                            AdminPromotionalDetails.Promotionalcountries = AdminPromotionalDetails.Promotionalcountries;

                        }
                        if (!string.IsNullOrEmpty(UpdateAdminPromotionalDto.EnglishImage))
                        {
                            AdminPromotionalDetails.EnglishImage = UpdateAdminPromotionalDto.EnglishImage;
                        }
                        if (!string.IsNullOrEmpty(UpdateAdminPromotionalDto.ArabicImage))
                        {
                            AdminPromotionalDetails.ArabicImage = UpdateAdminPromotionalDto.ArabicImage;
                        }
                        if (UpdateAdminPromotionalDto.AdminPromotionalURL != null)
                        {
                            AdminPromotionalDetails.PromotionalURL = UpdateAdminPromotionalDto.AdminPromotionalURL;
                        }
                        if (UpdateAdminPromotionalDto.AdminPromotionalDescription != null)
                        {
                            AdminPromotionalDetails.Promotionaldescription = UpdateAdminPromotionalDto.AdminPromotionalDescription;
                        }
                        if (!string.IsNullOrEmpty(UpdateAdminPromotionalDto.StartDate.ToString()))
                        {
                            AdminPromotionalDetails.StartDate = UpdateAdminPromotionalDto.StartDate;
                        }
                        if (!string.IsNullOrEmpty(UpdateAdminPromotionalDto.EndDate.ToString()))
                        {
                            AdminPromotionalDetails.EndDate = UpdateAdminPromotionalDto.EndDate;
                        }
                        if (!string.IsNullOrEmpty(UpdateAdminPromotionalDto.CountryTimezone.ToString()))
                        {
                            AdminPromotionalDetails.TimeZone = UpdateAdminPromotionalDto.CountryTimezone;
                        }
                        await Repository.UpdateAsync(AdminPromotionalDetails);

                        return "Admin Promotional updated successfully";
                    }
                    else if (UpdateAdminPromotionalDto.EndDate < Timezone)
                    {
                        return "Please select the end date is greater then present date";
                    }
                    else
                    {
                        return "Please select the end date is greater then start date.";
                    }
                }
                else if (AdminPromotionalDetails.EndDate < Timezone)
                {
                    return "Sorry you Admin Promotional was expired";
                }
                else
                {
                    return "Sorry you are not allowed to update, Admin Promotional is live now";
                }
            }
            else
            {
                if (!string.IsNullOrEmpty(UpdateAdminPromotionalDto.EnglishImage))
                {
                    AdminPromotionalDetails.EnglishImage = UpdateAdminPromotionalDto.EnglishImage;
                }
                if (!string.IsNullOrEmpty(UpdateAdminPromotionalDto.ArabicImage))
                {
                    AdminPromotionalDetails.ArabicImage = UpdateAdminPromotionalDto.ArabicImage;
                }
                if (!string.IsNullOrEmpty(UpdateAdminPromotionalDto.AdminPromotionalURL))
                {
                    AdminPromotionalDetails.PromotionalURL = UpdateAdminPromotionalDto.AdminPromotionalURL;
                }
                if (!string.IsNullOrEmpty(UpdateAdminPromotionalDto.AdminPromotionalDescription))
                {
                    AdminPromotionalDetails.Promotionaldescription = UpdateAdminPromotionalDto.AdminPromotionalDescription;
                }
                await Repository.UpdateAsync(AdminPromotionalDetails);

                return "Admin Promotional updated successfully";
            }
        }
        public async Task<string> DeleteAdminPromotional(DeleteAdminPromotionalDto DeleteAdminPromotionalDto)
        {
            DateTime Presentdate = Convert.ToDateTime(GetPresentdate);
            DateTime Timezone = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(Presentdate, TimeZoneInfo.Local.Id, DeleteAdminPromotionalDto.CountryTimezone);
            var GetAdminPromotionaldetails = Repository.SingleOrDefault(x => x.Id == DeleteAdminPromotionalDto.PromotionalId);
            if (GetAdminPromotionaldetails.IsDefault == "0")
            {
                if (GetAdminPromotionaldetails.StartDate > Timezone)
                {
                    GetAdminPromotionaldetails.Status = 0;
                    await Repository.UpdateAsync(GetAdminPromotionaldetails);
                    return "Admin Promotional deleted successfully";
                }
                else
                {
                    return "Sorry you are not allowed to update,Admin Promotional is live now";
                }
            }
            else
            {

                GetAdminPromotionaldetails.Status = 0;
                await Repository.UpdateAsync(GetAdminPromotionaldetails);
                return "Admin Promotional deleted successfully";
            }

        }
    }


}

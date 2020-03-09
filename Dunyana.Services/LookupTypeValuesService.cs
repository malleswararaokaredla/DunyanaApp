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
    public class LookupTypeValuesService : EntityService<LookupTypeValues, LookupTypeValueRepository>
    {

        public LookupTypeValuesService(LookupTypeValueRepository repository,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {


        }
        public List<CountryDto> GetAll()
        {

            //var query = this.Repository.OrderBy(m => m.Description).ToList();



            var getCountry = (from s in this.Repository
                              .Where(m => m.LookupTypeID == 1)
                              .Where(m => m.Status.Contains("1"))
                              select new
                              {
                                  s.Description,
                                  s.Id,
                                  s.LookupTypeID,
                                  s.Status,
                                  CountryMobileCode = (s.CountryMobileCode == null) ? 0 : s.CountryMobileCode

                              }).OrderBy(s => s.Description).ToList();

            List<CountryDto> Countrylist = new List<CountryDto>();
            foreach (var Country in getCountry)
            {
                CountryDto CountryDto = new CountryDto();

                CountryDto.Id = Country.Id;
                CountryDto.Description = Country.Description;
                CountryDto.Status = Country.Status;
                CountryDto.Mobilecode = Country.CountryMobileCode;
                Countrylist.Add(CountryDto);
            }

            return Countrylist;

            //var isvalid = Repository.SingleOrDefault(x => x.Status == "1");
            //return isvalid;
        }
        public async Task<string> Getlookupdec(int lookupid)
        {
           // return this.Repository.Where(m => m.Id == lookupid).ToList();

            var isvalid = Repository.SingleOrDefault(m => m.Id == lookupid);
            if (isvalid == null)
                return null;
            return isvalid.ShortDesc.ToString();

        }
        public async Task<int> GetCountryID (string Countryname)
        {
            // return this.Repository.Where(m => m.Id == lookupid).ToList();

            var isvalid = Repository.Where(m => m.Description == Countryname).Where(m => m.Status == "1").SingleOrDefault();
            if (isvalid == null)
                return 5;
            return isvalid.Id;

        }
        public async Task<string> GetCountryName(string CountryId)
        {
            // return this.Repository.Where(m => m.Id == lookupid).ToList();

            var isvalid = Repository.Where(m => m.Id == Convert.ToInt32(CountryId)).Where(m => m.Status == "1").SingleOrDefault();
            if (isvalid == null)
                return "No Country";
            return isvalid.ShortDesc;

        }
        public List<LookupTypeValues> GetNaqelUserTypes()
        {
            return this.Repository.Where(l => l.LookupTypeID ==
            (int)Domain.Enums.NaqelUserTypes.NaqelUserType).Where(l => l.Status.Contains("1")).ToList();
        }


        }


}

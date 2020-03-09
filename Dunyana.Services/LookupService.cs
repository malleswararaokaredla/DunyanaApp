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
    public class LookupTypeService : EntityService<LookupType, LookupTypeRepository>
    {

        public LookupTypeService(LookupTypeRepository repository,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {


        }
        public List<LookupType> GetAll()
        {
            return Repository.ToList();
        }


        public async Task AddLookupType(LookupTypeDto lookupdto)
        {
           await Repository.InsertAsync(new LookupType { Description =lookupdto.Description });
        }
        public async Task<List<LookupTypeValueDto>> GetLookupType(string LookupType)
        {
            //return Repository.Where(x=>x.Description.Equals(LookupType)).ToList();

            var getLookupType = (from s in this.Repository
                                 select new
                                 {
                                     s.Description,
                                     s.LookupTypeValue,
                                 }).Where(x => x.Description.Equals(LookupType)).ToList();

            List<LookupTypeValueDto> LookupTypeValues = new List<LookupTypeValueDto>();
            foreach (var LookupTypelist in getLookupType)
            {
                foreach (var LookupTypevalue in LookupTypelist.LookupTypeValue)
                {
                    LookupTypeValueDto LookupTypeValueDto = new LookupTypeValueDto();

                    LookupTypeValueDto.Id = LookupTypevalue.Id;
                    LookupTypeValueDto.Description = LookupTypevalue.Description;
                    LookupTypeValues.Add(LookupTypeValueDto);
                }
            }

            return LookupTypeValues;
        }
    }

    
}

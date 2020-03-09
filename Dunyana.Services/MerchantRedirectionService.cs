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
    public class MerchantRedirectionService : EntityService<MerchantRedirection, MerchantRedirectionRepository>
    {
        public MerchantRedirectionService(MerchantRedirectionRepository repository,
          IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {

        }

        //public async Task<MerchantRedirectionUrllistDto> getMerchantRedirectionlist(int MerchantID)
        //{
        //    //return this.Repository.Where(m => m.MerchantID == MerchantID).ToList();


        //    var getMerchantRedirection = (from s in this.Repository.Where(m => m.MerchantID == MerchantID)
        //                                  select new
        //                                  {
        //                                      s.Id,
        //                                      s.Attribute,
        //                                      s.Value,
        //                                      s.Description,
        //                                      s.Merchant,
        //                                  }).ToList();

        //    MerchantRedirectionUrllistDto MerchantRedirectionUrllist = new MerchantRedirectionUrllistDto();
        //    foreach (var MerchantRedirection in getMerchantRedirection)
        //    {
        //        MerchantRedirectionUrllist.MerchantRedirectionUrl = MerchantRedirection.Merchant.MerchantRedirectionUrl;
        //    }

        //    List<MerchantRedirectionlistDto> getMerchantRedirectionlist = new List<MerchantRedirectionlistDto>();
        //    foreach (var MerchantRedirection in getMerchantRedirection)
        //    {
        //        MerchantRedirectionlistDto MerchantRedirectionDto = new MerchantRedirectionlistDto();
        //        MerchantRedirectionDto.MerchantRedirectionId = MerchantRedirection.Id;
        //        MerchantRedirectionDto.MerchantAttribute = MerchantRedirection.Attribute;
        //        MerchantRedirectionDto.MerchantValue = MerchantRedirection.Value;
        //        MerchantRedirectionDto.MerchantDescription = MerchantRedirection.Description;
        //        getMerchantRedirectionlist.Add(MerchantRedirectionDto);
        //    }
        //    MerchantRedirectionUrllist.MerchantRedirectionlist = getMerchantRedirectionlist;
        //    return MerchantRedirectionUrllist;
        //}
        public async Task InsertMerchantRedirectionDetails(MerchantRedirectionlistDto MerchantRedirectionlistDto, int MerchantID)
        {
            await Repository.InsertAsync(new MerchantRedirection
            {
                MerchantID = MerchantID,
                Attribute = MerchantRedirectionlistDto.MerchantAttribute,
                Value = MerchantRedirectionlistDto.MerchantValue,
                Description = MerchantRedirectionlistDto.MerchantDescription,
            });
        }
        public async Task UpdateMerchantRedirectionDetails(MerchantRedirectionlistDto MerchantRedirectionlistDto, int MerchantID)
        {
            var isvalid = Repository.SingleOrDefault(x => x.Id == MerchantRedirectionlistDto.MerchantRedirectionId);
            if (!string.IsNullOrEmpty(MerchantRedirectionlistDto.MerchantAttribute))
            {
                isvalid.Attribute = MerchantRedirectionlistDto.MerchantAttribute;
            }
            if (!string.IsNullOrEmpty(MerchantRedirectionlistDto.MerchantValue))
            {
                isvalid.Value = MerchantRedirectionlistDto.MerchantValue;
            }
            if (!string.IsNullOrEmpty(MerchantRedirectionlistDto.MerchantDescription))
            {
                isvalid.Description = MerchantRedirectionlistDto.MerchantDescription;
            }
            await Repository.UpdateAsync(isvalid);
        }

        public async Task<List<MerchantRedirectionlistDto>> getMerchantRedirectionlist(string MerchantEmail)
        {
            //return this.Repository.Where(m => m.MerchantID == MerchantID).ToList();


            var getMerchantRedirection = (from s in this.Repository.Where(m => m.Merchant.Email == MerchantEmail)
                                          select new
                                          {
                                              s.Attribute,
                                              s.Value,
                                              s.Description,
                                          }).ToList();

            List<MerchantRedirectionlistDto> getMerchantRedirectionlist = new List<MerchantRedirectionlistDto>();
            foreach (var MerchantRedirection in getMerchantRedirection)
            {
                MerchantRedirectionlistDto MerchantRedirectionDto = new MerchantRedirectionlistDto();

                MerchantRedirectionDto.MerchantAttribute = MerchantRedirection.Attribute;
                MerchantRedirectionDto.MerchantValue = MerchantRedirection.Value;
                MerchantRedirectionDto.MerchantDescription = MerchantRedirection.Description;
                getMerchantRedirectionlist.Add(MerchantRedirectionDto);
            }

            return getMerchantRedirectionlist;
        }
        public async Task deleteMerchantRedirectionValue(int MerchantId, int MerchantRedirectionId)
        {
            var isvalid = Repository.SingleOrDefault(x => x.MerchantID == MerchantId && x.Id == MerchantRedirectionId);

             Repository.Delete(isvalid);
        }
    }
}


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
    public class NaqelUsersService : EntityService<NaqelUsers, NaqelUsersRepository>
    {
        public NaqelUsersService(NaqelUsersRepository repository,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {

        }
        public List<UserDto> GetAll()
        {

            var getNaqelUsersdetails = (from s in this.Repository
                                        where s.Users.Type != "NSA"
                                        select new
                                      {
                                          s.Id,
                                          s.FirstName,
                                          s.LastName,
                                          s.LookupTypeCountry.Description,
                                          s.CreatedDate,
                                          s.Email,
                                          s.Mobile,
                                          s.Users.Status,
                                          s.LookupTypeUserType,
                                          s.Address
                                      }).ToList();

            List<UserDto> NaqelUserslist = new List<UserDto>();
            foreach (var NaqelUsers in getNaqelUsersdetails)
            {
                UserDto NaqelUsersDto = new UserDto();

                NaqelUsersDto.Id = NaqelUsers.Id;
                NaqelUsersDto.FirstName = NaqelUsers.FirstName;
                NaqelUsersDto.LastName = NaqelUsers.LastName;
                NaqelUsersDto.Country = NaqelUsers.Description;
                NaqelUsersDto.Email = NaqelUsers.Email;
                NaqelUsersDto.Mobile = NaqelUsers.Mobile;
                NaqelUsersDto.IsActive = NaqelUsers.Status.ToString();
                NaqelUsersDto.CreatedDt = NaqelUsers.CreatedDate.ToString();
                NaqelUsersDto.UserType = NaqelUsers.LookupTypeUserType.Description;
                NaqelUsersDto.Address = NaqelUsers.Address;
                NaqelUserslist.Add(NaqelUsersDto);
            }
            return NaqelUserslist.ToList();
        }
        public async Task<NaqelUsers> GetNaqelUser(int id)
        {
            return await Repository.FindAsync(id);
        }
        public async Task<NaqelUsers> GetNaqelUserDetails(NaqelUsersDto NaqelUsersDto)
        {
            var isvalid = Repository.SingleOrDefault(x => x.Email == NaqelUsersDto.Email);

            if (isvalid == null)
                return null;
            return isvalid;
        }
        public async Task AddNaqelUser(NaqelUsers user)
        {
            await Repository.InsertAsync(user);
        }
        public async Task UpdateNaqelUser(NaqelUsers user)
        {
            await Repository.UpdateAsync(user);
        }
        public async Task UpdateNaqelUserRegistrationDetails(NaqelUsersDto NaqelUsersDto)
        {
            int naqelUsersId = (int)NaqelUsersDto.Id;
            var NaqelUsersDetails = Repository.SingleOrDefault(x => x.Id == naqelUsersId);
            if (!string.IsNullOrEmpty(NaqelUsersDto.FirstName))
            {
                NaqelUsersDetails.FirstName = NaqelUsersDto.FirstName;
            }
            if (!string.IsNullOrEmpty(NaqelUsersDto.LastName))
            {
                NaqelUsersDetails.LastName = NaqelUsersDto.LastName;
            }          
            if (!string.IsNullOrEmpty(NaqelUsersDto.Mobile))
            {
                NaqelUsersDetails.Mobile = NaqelUsersDto.Mobile;
            }
            if (!string.IsNullOrEmpty(NaqelUsersDto.Address))
            {
                NaqelUsersDetails.Address = NaqelUsersDto.Address;
            }
            if (!string.IsNullOrEmpty(NaqelUsersDto.Country))
            {
                NaqelUsersDetails.Country = Convert.ToInt32(NaqelUsersDto.Country);
            }
            //if (!string.IsNullOrEmpty(NaqelUsersDto.Image))
            //{
                NaqelUsersDetails.Image = NaqelUsersDto.Image;
            //}
            await Repository.UpdateAsync(NaqelUsersDetails);
        }
    }


}

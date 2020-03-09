
using Dunyana.Core;
using Dunyana.DataAccess.Repositories;
using Dunyana.Domain;
using Dunyana.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Sym.Core.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dunyana.Services
{
    public class UsersService : EntityService<Users, UsersRepository>
    {
        private readonly UserAduitServices _MerchantRequestAduitServices;
        private readonly CustomerRegistrationService _CustomerRegistrationService;
        public UsersService(UsersRepository repository,
           IHttpContextAccessor httpContextAccessor, UserAduitServices MerchantRequestAduitServices, CustomerRegistrationService CustomerRegistrationService) : base(repository, httpContextAccessor)
        {
            _MerchantRequestAduitServices = MerchantRequestAduitServices;
            _CustomerRegistrationService = CustomerRegistrationService;
        }
        public List<Users> GetAll()
        {
            return Repository.ToList();
        }
        public async Task<Users> GetUserInfo(string email)
        {
            return await Repository.Where(u=>u.Username  == email).FirstOrDefaultAsync();
        }
        public async Task<Users> GetUser(string guid)
        {
            return await Repository.Where(u => u.GUID == guid).FirstOrDefaultAsync();
        }
        public async Task<Users> GetUser(int id)
        {
            return await Repository.Where(u => u.Id == id).FirstOrDefaultAsync();
        }
        public async Task<int> UpdateUser(Users user)
        {
            return await Repository.UpdateAsync(user);
        }
        public async Task UserDetails(CustomerRegistrationDto CustomerRegistrationDto)
        {
            Guid id = Guid.NewGuid();
            await Repository.InsertAsync(new Users
            {
                Username = CustomerRegistrationDto.Email,
                PWD = EncryptionHelper.Encrypt(CustomerRegistrationDto.PWD),
                Type = CustomerRegistrationDto.Type,
                GUID = id.ToString(),
                Status = 1,
            });
        }
        public async Task UpdateGUID(CustomerRegistrationDto CustomerRegistrationDto)
        {
            Guid id = Guid.NewGuid();
            var isvalid = Repository.SingleOrDefault(x => x.Username == CustomerRegistrationDto.Email);

            if (string.IsNullOrEmpty(isvalid.GUID))
            {
                isvalid.GUID = id.ToString();
                await Repository.UpdateAsync(isvalid);
            }
        }
        public async Task UpdateLoginverification(CustomerRegistrationDto CustomerRegistrationDto)
        {
            var isvalid = Repository.SingleOrDefault(x => x.Username == CustomerRegistrationDto.Email);
            isvalid.Status = 1;
            await Repository.UpdateAsync(isvalid);
        }
        public async Task UpdateUserType(string Email, string UserType)
        {
            var isvalid = Repository.SingleOrDefault(x => x.Username == Email);
            isvalid.Type = UserType;
            await Repository.UpdateAsync(isvalid);
        }
        public async Task<Users> LoginAuthenticate(CustomerRegistrationDto CustomerRegistrationDto)
        {
            var isvalid = Repository.SingleOrDefault(x => x.Username == CustomerRegistrationDto.Email);
            if (isvalid == null)
                return null;
            return isvalid;
        }
        public async Task<int> MobileAuthenticate(CustomerRegistrationDto CustomerRegistrationDto)
        {
            var isvalid = Repository.Where(x => x.CustomerRegistration.Mobile == CustomerRegistrationDto.Mobile).ToList();
            return isvalid.Count();
        }
        public async Task<Users> UserPWD(CustomerRegistrationDto CustomerRegistrationDto)
        {
            var isvalid = Repository.SingleOrDefault(x => x.Username == CustomerRegistrationDto.Email);
            //if (EncryptionHelper.Decrypt(isvalid.PWD) == CustomerRegistrationDto.PWD)
            //{
            if(isvalid !=null)
            isvalid.PWD = EncryptionHelper.Decrypt(isvalid.PWD);
            return isvalid;
            //}
            //return null;
        }
        public async Task ChangePassword(CustomerRegistrationDto CustomerRegistrationDto)
        {
            //var isvalid = Repository.SingleOrDefault(x => x.Username == CustomerRegistrationDto.Email);
            //isvalid.PWD = EncryptionHelper.Encrypt(CustomerRegistrationDto.PWD);
            //await Repository.UpdateAsync(isvalid);

            var isvalid = Repository.SingleOrDefault(x => x.Username == CustomerRegistrationDto.Email);
            var ECID = EncryptionHelper.Encrypt(CustomerRegistrationDto.PWD);
            await _MerchantRequestAduitServices.AuditPassword(isvalid.PWD, ECID, isvalid.Id);
            isvalid.PWD = ECID;
            await Repository.UpdateAsync(isvalid);

        }
        public async Task<string> getGUID(string CustomerID)
        {
            var isvalid = Repository.SingleOrDefault(x => x.GUID == CustomerID);
            if (isvalid == null)
                return null;
            return isvalid.Username.ToString();
        }
        public async Task<int> getUsersId(string EmailId)
        {
            var getUsersId = Repository.SingleOrDefault(x => x.Username == EmailId);

            return getUsersId.Id;
        }
        public async Task<int> getCustomerID(string strGUID)
        {
            CustomerRegistrationDto objCustomerRegistrationDto = new CustomerRegistrationDto();
            var getCustomerEmail = Repository.SingleOrDefault(x => x.GUID == strGUID);

            objCustomerRegistrationDto.Email = getCustomerEmail.Username;
            var getCustomerID =await _CustomerRegistrationService.Authenticate(objCustomerRegistrationDto);

            return getCustomerID.Id; 
        }



    }


}

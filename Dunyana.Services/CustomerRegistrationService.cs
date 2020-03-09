using Dunyana.DataAccess.Repositories;
using Dunyana.Domain;
using Dunyana.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Sym.Core.Service;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Dunyana.Services
{
    public class CustomerRegistrationService : EntityService<CustomerRegistration, CustomerRegistrationRepository>
    {
        private readonly AppSettings _appSettings;
        public CustomerRegistrationService(CustomerRegistrationRepository repository, IOptions<AppSettings> appSettings,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {
            _appSettings = appSettings.Value;
        }
        public List<UserDto> GetAll()
        {
            var getCustomerdetails = (from s in this.Repository
                                      select new
                                    {
                                        s.Id,
                                        s.FirstName,
                                        s.LastName,
                                        s.LookupCountry.Description,
                                        s.CreatedDate,
                                        s.Email,
                                        s.Mobile,
                                        s.Users.Status,
                                        s.Address
                                      }).ToList();

            List<UserDto> Customerlist = new List<UserDto>();
            foreach (var Customer in getCustomerdetails)
            {
                UserDto CustomerRegistrationDto = new UserDto();

                CustomerRegistrationDto.Id = Customer.Id;
                CustomerRegistrationDto.FirstName = Customer.FirstName;
                CustomerRegistrationDto.LastName = Customer.LastName;
                CustomerRegistrationDto.Country = Customer.Description;
                CustomerRegistrationDto.Email = Customer.Email;
                CustomerRegistrationDto.Mobile = Customer.Mobile;
                CustomerRegistrationDto.IsActive = Customer.Status.ToString();
                CustomerRegistrationDto.CreatedDt = Customer.CreatedDate.ToString();
                CustomerRegistrationDto.Address = Customer.Address;
                Customerlist.Add(CustomerRegistrationDto);
            }

            return Customerlist.ToList();
        }
        public CustomerRegistration GetCustomer(int id)
        {
            return Repository.Where(c=>c.Id == id).FirstOrDefault();
        }
        public CustomerRegistration GetCustomerwithEmail(string email)
        {
            return Repository.Where(c => c.Email == email).FirstOrDefault();
        }

        public async Task InsertRegistrationDetails(InsertCustomerRegistrationDto InsertCustomerRegistrationDto, int CustomerUsersID)
        {
            await Repository.InsertAsync(new CustomerRegistration
            {
                FirstName = InsertCustomerRegistrationDto.FirstName,
                LastName = InsertCustomerRegistrationDto.LastName,
                Email = InsertCustomerRegistrationDto.Email,
                Mobile = InsertCustomerRegistrationDto.Mobile,
                Address = InsertCustomerRegistrationDto.Address,
                Country = Convert.ToInt32(InsertCustomerRegistrationDto.Country),
                City = InsertCustomerRegistrationDto.City,
                EmailVerified = 1,
                UsersID = CustomerUsersID,
                LoginType = InsertCustomerRegistrationDto.LoginType,
                TermandCondition = Convert.ToInt32(InsertCustomerRegistrationDto.TermandCondition)

            });

        }
        public async Task<CustomerRegistration> Authenticate(CustomerRegistrationDto CustomerRegistrationDto)
        {
            var isvalid = Repository.SingleOrDefault(x => x.Email == CustomerRegistrationDto.Email);

            if (isvalid == null)
                return null;
            return isvalid;
        }

        public async Task<TokenDto> GetToken(TokenDto user)
        {
            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Audience = _appSettings.Audience,
                Issuer = _appSettings.Issuer,
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.GUID.ToString()),
                    new Claim(ClaimTypes.Role, user.Type)
                }),
                Expires = DateTime.Now.AddDays(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), 
                                         SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            
            user.Token = tokenHandler.WriteToken(token);

            // remove password before returning
            // user.PWD = null;
            return user;

        }
        public async Task UpdateEmailverification(CustomerRegistrationDto CustomerRegistrationDto)
        {

            var isvalid = Repository.SingleOrDefault(x => x.Email == CustomerRegistrationDto.Email);
            isvalid.EmailVerified = 1;
            await Repository.UpdateAsync(isvalid);
        }

        public async Task<List<CustomerWalletBalance>> getCustomerwallet()
        {
            var getCustomerWalletBalancedetails = (from s in this.Repository
                                                  select new
                                                  {
                                                     s.Id,
                                                     s.Users.GUID,
                                                     s.FirstName,
                                                     s.LastName,
                                                     s.LookupCountry.ShortDesc,
                                                     Amount = (s.Wallet.Amount == null) ? 0 : s.Wallet.Amount
                                                  }).ToList();

            List<CustomerWalletBalance> CustomerWalletBalancelist = new List<CustomerWalletBalance>();
            foreach (var CustomerWalletBalance in getCustomerWalletBalancedetails)
            {
                CustomerWalletBalance CustomerWalletBalanceDto = new CustomerWalletBalance();

                CustomerWalletBalanceDto.CustomerID = CustomerWalletBalance.Id;
                CustomerWalletBalanceDto.CustomerGUID = CustomerWalletBalance.GUID;
                CustomerWalletBalanceDto.CustomerName = CustomerWalletBalance.FirstName + " " + CustomerWalletBalance.LastName;
                CustomerWalletBalanceDto.Currency = CustomerWalletBalance.ShortDesc;
                CustomerWalletBalanceDto.WalletBalance = CustomerWalletBalance.Amount;
                CustomerWalletBalancelist.Add(CustomerWalletBalanceDto);
            }

            return CustomerWalletBalancelist.ToList();
        }

        public async Task UpdateRegistrationDetails(CustomerRegistrationDto CustomerRegistrationDto)
        {
            var isvalid = Repository.SingleOrDefault(x => x.Email == CustomerRegistrationDto.Email);
            //if (!string.IsNullOrEmpty(CustomerRegistrationDto.Image))
            //{
                isvalid.Image = CustomerRegistrationDto.Image;
            //}
            if (!string.IsNullOrEmpty(CustomerRegistrationDto.FirstName))
            {
                isvalid.FirstName = CustomerRegistrationDto.FirstName;
            }
            if (!string.IsNullOrEmpty(CustomerRegistrationDto.LastName))
            {
                isvalid.LastName = CustomerRegistrationDto.LastName;
            }
            if (!string.IsNullOrEmpty(CustomerRegistrationDto.Address))
            {
                isvalid.Address = CustomerRegistrationDto.Address;
            }
            if (!string.IsNullOrEmpty(CustomerRegistrationDto.Country))
            {
                isvalid.Country = Convert.ToInt32(CustomerRegistrationDto.Country);
            }
            if (!string.IsNullOrEmpty(CustomerRegistrationDto.City))
            {
                isvalid.City = CustomerRegistrationDto.City;
            }
            if (!string.IsNullOrEmpty(CustomerRegistrationDto.Mobile))
            {
                isvalid.Mobile = CustomerRegistrationDto.Mobile;
            }
            await Repository.UpdateAsync(isvalid);
        }
        //public CustomerRegistration getCustomerID(CustomerRegistrationDto CustomerRegistrationDto)
        //{
        //    var isvalid = Repository.SingleOrDefault(x => x.Email == CustomerRegistrationDto.Email);
        //    if (isvalid == null)
        //        return null;
        //    return isvalid;
        //}
        //public CustomerRegistration getCustomerEmail(CustomerRegistrationDto CustomerRegistrationDto)
        //{
        //    var isvalid = Repository.SingleOrDefault(x => x.Id == Convert.ToUInt32(EncryptionHelper.Decrypt(CustomerRegistrationDto.EncId)));

        //    return isvalid;
        //}
    }


}


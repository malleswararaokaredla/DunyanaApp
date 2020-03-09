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
    public class OTPAuthenticationService : EntityService<OTPAuthentication, OTPAuthenticationRepository>
    {

        public OTPAuthenticationService(OTPAuthenticationRepository repository,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {


        }
        public List<OTPAuthentication> GetAll()
        {
            return Repository.ToList();
        }

        public async Task<int> InsertOTPAuthentication(CustomerRegistrationDto CustomerRegistrationDto)
        {
            //var varCount = this.Repository.ToList();
            //varCount = varCount.Where(m => m.VerificationId == CustomerRegistrationDto.Email).ToList();
            //if (varCount.Count < 4)
            //{
                Random random = new Random();
                int intOTP = random.Next(100000, 999999);
                DateTime currentTime = DateTime.Now;
                await Repository.InsertAsync(new OTPAuthentication
                {
                    OTP = intOTP,
                    VerificationId = CustomerRegistrationDto.Email,
                    StartDate = currentTime,
                    EndDate = currentTime.AddMinutes(5),
                });
                return intOTP;
            //}
            //return "_" + varCount.Count.ToString();
        }
        public async Task<int> InsertMobileOTPAuthentication(MobileOTPDto MobileOTPDto)
        {
            //var varCount = this.Repository.ToList();
            //varCount = varCount.Where(m => m.VerificationId == CustomerRegistrationDto.Email).ToList();
            //if (varCount.Count < 4)
            //{
            Random random = new Random();
            int intOTP = random.Next(100000, 999999);
            DateTime currentTime = DateTime.Now;
            await Repository.InsertAsync(new OTPAuthentication
            {
                OTP = intOTP,
                VerificationId = MobileOTPDto.Mobile,
                StartDate = currentTime,
                EndDate = currentTime.AddMinutes(10),
            });
            return intOTP;
            //}
            //return "_" + varCount.Count.ToString();
        }

        public async Task<string> OTPVerifyAuthenticate(CustomerRegistrationDto CustomerRegistrationDto)
        {
            //Internal testing Purpose
            //if (CustomerRegistrationDto.OTP==778899)
            //{
            //    return "Success";
            //}
            var OTPVerifyResponse = Repository.SingleOrDefault(x => x.VerificationId == CustomerRegistrationDto.Email && x.OTP == CustomerRegistrationDto.OTP);
            if (OTPVerifyResponse == null)
            {
                return "Invalid OTP!";
            }
            if (OTPVerifyResponse != null)
            {
                DateTime Presentdate = DateTime.Now;
                var query = this.Repository.ToList();
                query = query.Where(m => Presentdate >= m.StartDate && Presentdate <= m.EndDate)
                             .Where(m => m.VerificationId == CustomerRegistrationDto.Email)
                             .Where(m => m.OTP == CustomerRegistrationDto.OTP).ToList();
                if (query.Count > 0)
                    return "Success";
            }
            return "OTP Expried!";
        }
        public async Task<string> OTPMobileVerifyAuthenticate(CustomerRegistrationDto CustomerRegistrationDto)
        {
            //Internal testing Purpose
            //if (CustomerRegistrationDto.OTP==778899)
            //{
            //    return "Success";
            //}
            var OTPVerifyResponse = Repository.SingleOrDefault(x => x.VerificationId == CustomerRegistrationDto.Mobile && x.OTP == CustomerRegistrationDto.MobileOTP);
            if (OTPVerifyResponse == null)
            {
                return "Invalid MobileOTP!";
            }
            if (OTPVerifyResponse != null)
            {
                DateTime Presentdate = DateTime.Now;
                var query = this.Repository.ToList();
                query = query.Where(m => Presentdate >= m.StartDate && Presentdate <= m.EndDate)
                             .Where(m => m.VerificationId == CustomerRegistrationDto.Mobile)
                             .Where(m => m.OTP == CustomerRegistrationDto.MobileOTP).ToList();
                if (query.Count > 0)
                    return "Success";
            }
            return "MobileOTP Expried!";
        }
        public async Task DeleteOTPVerifydetails(CustomerRegistrationDto CustomerRegistrationDto)
        {
            var varCount = this.Repository.Where(m => m.VerificationId == CustomerRegistrationDto.Email).ToList();
            await Repository.DeleteAsync(varCount);
        }
        public async Task DeleteMobileOTPVerifydetails(CustomerRegistrationDto CustomerRegistrationDto)
        {
            var varCount = this.Repository.Where(m => m.VerificationId == CustomerRegistrationDto.Mobile).ToList();
            await Repository.DeleteAsync(varCount);
        }
    }
}
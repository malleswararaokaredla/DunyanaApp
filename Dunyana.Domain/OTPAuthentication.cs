using Sym.Core;
using System;

namespace Dunyana.Domain
{
    public class OTPAuthentication : TrackAndAuditEntity<OTPAuthentication, int>
    {
        public OTPAuthentication()
        {

        }
        public override int Id { get; set; }
        public int OTP { get; set; }
        public string VerificationId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
       
    }
}
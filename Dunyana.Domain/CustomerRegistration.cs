using Sym.Core;

namespace Dunyana.Domain
{
    public class CustomerRegistration : TrackAndAuditEntity<CustomerRegistration, int>
    {
        public CustomerRegistration()
        {

        }
        public override int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Address { get; set; }
        public int Country { get; set; }
        public string City { get; set; }
        public string Image { get; set; }
        public int EmailVerified { get; set; }
        //public bool MobileVerified { get; set; }
        public string LoginType { get; set; }
        public string FBID { get; set; }
        public string GoogleID { get; set; }
        public int? TermandCondition { get; set; }
        // public string PWD { get; set; }
        //public string Type { get; set; }
        public virtual Order Order { get; set; }
        public virtual Wallet Wallet { get; set; }
        public virtual WalletPoints WalletPoints { get; set; }
        public int? UsersID { get; set; }
        public virtual Users Users { get; set; }
        public virtual LookupTypeValues LookupCountry { get; set; }
        public virtual PaymentResponse PaymentResponse { get; set; }
        public virtual PaymentCards PaymentCards { get; set; }
    }
}

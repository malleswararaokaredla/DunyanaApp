
using Sym.Core;

namespace Dunyana.Domain
{
    public class NaqelUsers : TrackAndAuditEntity<NaqelUsers, int>
    {
        public NaqelUsers()
        {

        }
        public override int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public int Country { get; set; }
        public string Image { get; set; }
        public int? UsersID { get; set; }
        public int? UserType { get; set; }
        public virtual MerchantRequest MerchantRequest { get; set; }
        public virtual MerchantRequestDetails MerchantRequestDetails { get; set; }
        public virtual Users Users { get; set; }
        public virtual LookupTypeValues LookupTypeCountry { get; set; }
        public virtual LookupTypeValues LookupTypeUserType { get; set; }
    }
}

using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class CustomerRegistrationMap : TrackAndAuditEntityMap<CustomerRegistration, int>
    {
        public override void Map(EntityTypeBuilder<CustomerRegistration> b)
        {
            b.ToTable("tblcustomer");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.FirstName);
            b.Property(x => x.LastName);
            b.Property(x => x.Email);
            b.Property(x => x.Mobile);
            b.Property(x => x.Address);
            //b.Property(x => x.Country);
            b.Property(x => x.City);
            b.Property(x => x.Image);
            b.Property(x => x.EmailVerified);
            //b.Property(x => x.MobileVerified);
            b.Property(x => x.LoginType);
            b.Property(x => x.FBID);
            b.Property(x => x.GoogleID);
            b.Property(x => x.TermandCondition);
            b.HasOne<Users>(s => s.Users).WithOne(g => g.CustomerRegistration).HasForeignKey<CustomerRegistration>(s => s.UsersID);
            b.HasOne<LookupTypeValues>(s => s.LookupCountry).WithOne(g => g.CustomerCountry).HasForeignKey<CustomerRegistration>(s => s.Country);
        }
    }
}

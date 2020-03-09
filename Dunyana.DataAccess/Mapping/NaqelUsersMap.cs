
using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class NaqelUsersMap : TrackAndAuditEntityMap<NaqelUsers, int>
    {
        public override void Map(EntityTypeBuilder<NaqelUsers> b)
        {
            b.ToTable("tblnaqel");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.FirstName);
            b.Property(x => x.LastName);
            b.Property(x => x.Email);
            //b.Property(x => x.Country);
            b.Property(x => x.Mobile);
            b.Property(x => x.Address);
            b.HasOne<Users>(s => s.Users).WithOne(g => g.NaqelUsers).HasForeignKey<NaqelUsers>(s => s.UsersID);
            b.HasOne<LookupTypeValues>(s => s.LookupTypeCountry).WithOne(g => g.NaqelCountry).HasForeignKey<NaqelUsers>(s => s.Country);
            b.HasOne<LookupTypeValues>(s => s.LookupTypeUserType).WithOne(g => g.NaqelUserType).HasForeignKey<NaqelUsers>(s => s.UserType);
        }
    }
}

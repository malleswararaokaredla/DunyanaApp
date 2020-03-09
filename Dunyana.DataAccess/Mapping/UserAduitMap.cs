using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class UserAduitMap : TrackAndAuditEntityMap<UserAduit, int>
    {
        public override void Map(EntityTypeBuilder<UserAduit> b)
        {
            b.ToTable("tblUseraduit");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.UsersID);
            b.Property(x => x.Newvalue);
            b.Property(x => x.Oldvalue);
            b.HasOne<Users>(s => s.Users).WithMany(g => g.UserAduit).HasForeignKey(s => s.UsersID);
        }
    }
}

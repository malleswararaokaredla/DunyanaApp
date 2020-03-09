using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class UsersMap : TrackAndAuditEntityMap<Users, int>
    {
        public override void Map(EntityTypeBuilder<Users> b)
        {
            b.ToTable("tblUsers");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.Username);
            b.Property(x => x.PWD);
            b.Property(x => x.Type);
            b.Property(x => x.Status);
        }
    }
}

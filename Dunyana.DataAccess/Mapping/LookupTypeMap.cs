using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class LookupTypeMap : TrackAndAuditEntityMap<LookupType, int>
    {
        public override void Map(EntityTypeBuilder<LookupType> b)
        {
            b.ToTable("tbllookuptype");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.Description);
            
        }
    }
    
}

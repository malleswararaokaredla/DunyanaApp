using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class LookupTypeValuesMap : TrackAndAuditEntityMap<LookupTypeValues, int>
    {
        public override void Map(EntityTypeBuilder<LookupTypeValues> b)
        {
            b.ToTable("tbllookupvalues");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();

            b.HasOne<LookupType>(s => s.LookupType).WithMany(g => g.LookupTypeValue).HasForeignKey(s => s.LookupTypeID);

            b.Property(x => x.Description);
            b.Property(x => x.Status);
            b.Property(x => x.ShortDesc);
            b.Property(x => x.CountryMobileCode);

        }
    }

}

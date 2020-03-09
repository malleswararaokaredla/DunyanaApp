using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class AdminPromotionalCountriesMap : TrackAndAuditEntityMap<AdminPromotionalCountries, int>
    {
        public override void Map(EntityTypeBuilder<AdminPromotionalCountries> b)
        {
            b.ToTable("tblpromotionalcountries");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.HasOne<LookupTypeValues>(s => s.LookupTypeValues).WithMany(g => g.AdminPromotionalCountries).HasForeignKey(s => s.CountryID);
            b.HasOne<AdminPromotional>(s => s.AdminPromotional).WithMany(g => g.AdminPromotionalCountries).HasForeignKey(s => s.PromotionalID);
        }
    }
}
using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class AdminPromotionalMap : TrackAndAuditEntityMap<AdminPromotional, int>
    {
        public override void Map(EntityTypeBuilder<AdminPromotional> b)
        {
            b.ToTable("tbladminpromotional");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.Promotionalcountries);
            b.Property(x => x.EnglishImage);
            b.Property(x => x.ArabicImage);
            b.Property(x => x.PromotionalURL);
            b.Property(x => x.Promotionaldescription);
            b.Property(x => x.Status);
            b.Property(x => x.IsDefault);
            b.Property(x => x.StartDate);
            b.Property(x => x.EndDate);
            b.Property(x => x.TimeZone);
        }
    }
}

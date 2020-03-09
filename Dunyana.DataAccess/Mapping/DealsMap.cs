using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class DealsMap : TrackAndAuditEntityMap<Deals, int>
    {
        public override void Map(EntityTypeBuilder<Deals> b)
        {
            b.ToTable("tbldeals");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.MerchantId);
            b.Property(x => x.Country);
            b.Property(x => x.EnglishImage);
            b.Property(x => x.ArabicImage);
            //b.Property(x => x.language);
            b.Property(x => x.DealURL);
            b.Property(x => x.DealDescription);
            b.Property(x => x.Status);
            //b.Property(x => x.StartDate);
            //b.Property(x => x.EndDate);
            b.Property(x => x.TimeZone);
            b.HasOne<Merchant>(s => s.Merchant).WithOne(g => g.Deals).HasForeignKey<Deals>(s => s.MerchantId);
        }
    }
}

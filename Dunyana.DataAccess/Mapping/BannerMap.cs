using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class BannerMap : TrackAndAuditEntityMap<Banner, int>
    {
        public override void Map(EntityTypeBuilder<Banner> b)
        {
            b.ToTable("tblBanner");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.MerchantID);
            b.Property(x => x.Country);
            b.Property(x => x.EnglishImage);
            b.Property(x => x.ArabicImage);
            //b.Property(x => x.language);
            b.Property(x => x.BannerURL);
            b.Property(x => x.BannerDescription);
            b.Property(x => x.Status);
            b.Property(x => x.IsDefault);
            //b.Property(x => x.StartDate);
            //b.Property(x => x.EndDate);
            b.Property(x => x.TimeZone);
            b.HasOne<Merchant>(s => s.Merchant).WithOne(g => g.Banners).HasForeignKey<Banner>(s => s.MerchantID);
        }
    }
}

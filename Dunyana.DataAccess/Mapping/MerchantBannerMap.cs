
using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class MerchantBannerMap : TrackAndAuditEntityMap<MerchantBanner, int>
    {
        public override void Map(EntityTypeBuilder<MerchantBanner> b)
        {
            b.ToTable("tblmerchantsBanner");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.HasOne<Merchant>(s => s.Merchant).WithMany(g => g.MerchantBanner).HasForeignKey(s => s.MerchantID);
            b.HasOne<LookupTypeValues>(s => s.LookupTypeValues).WithMany(g => g.MerchantBanner).HasForeignKey(s => s.CountryID);
            b.HasOne<Banner>(s => s.Banner).WithMany(g => g.MerchantBanner).HasForeignKey(s => s.BannerID);
        }
    }
}
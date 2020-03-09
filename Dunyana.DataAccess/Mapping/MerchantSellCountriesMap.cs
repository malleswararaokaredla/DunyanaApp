using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class MerchantSellCountriesMap : TrackAndAuditEntityMap<MerchantSellCountries, int>
    {
        public override void Map(EntityTypeBuilder<MerchantSellCountries> b)
        {
            b.ToTable("tblMerchantSellCountries");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.HasOne<Merchant>(s => s.Merchant).WithMany(g => g.MerchantSellCountries).HasForeignKey(s => s.MerchantID);
            b.HasOne<LookupTypeValues>(s => s.LookupTypeValues).WithMany(g => g.MerchantSellCountries).HasForeignKey(s => s.Country);
        }
    }
}
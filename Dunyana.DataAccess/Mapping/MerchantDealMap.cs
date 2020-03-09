using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class MerchantDealMap : TrackAndAuditEntityMap<MerchantDeal, int>
    {
        public override void Map(EntityTypeBuilder<MerchantDeal> b)
        {
            b.ToTable("tblmerchantsdeals");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.HasOne<Merchant>(s => s.Merchant).WithMany(g => g.MerchantDeal).HasForeignKey(s => s.MerchantID);
            b.HasOne<LookupTypeValues>(s => s.LookupTypeValues).WithMany(g => g.MerchantDeal).HasForeignKey(s => s.CountryID);
            b.HasOne<Deals>(s => s.Deals).WithMany(g => g.MerchantDeal).HasForeignKey(s => s.DealID);
        }
    }
}
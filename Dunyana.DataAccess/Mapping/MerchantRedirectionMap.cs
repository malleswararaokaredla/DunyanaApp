using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class MerchantRedirectionMap : TrackAndAuditEntityMap<MerchantRedirection, int>
    {
        public override void Map(EntityTypeBuilder<MerchantRedirection> b)
        {
            b.ToTable("tblMerchantRedirection");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            //b.Property(x => x.MerchantID);
            b.Property(x => x.Attribute);
            b.Property(x => x.Value);
            b.Property(x => x.Description);
            b.HasOne<Merchant>(s => s.Merchant).WithMany(g => g.MerchantRedirection).HasForeignKey(s => s.MerchantID);
        }
    }
}
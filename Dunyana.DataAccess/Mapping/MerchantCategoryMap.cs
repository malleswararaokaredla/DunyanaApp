using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class MerchantCategoryMap : TrackAndAuditEntityMap<MerchantCategory, int>
    {
        public override void Map(EntityTypeBuilder<MerchantCategory> b)
        {
            b.ToTable("tblMerchantCategory");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            //b.Property(x => x.MerchantID);
            b.Property(x => x.CategoryID);
            b.HasOne<Merchant>(s => s.Merchant).WithMany(g => g.MerchantCategory).HasForeignKey(s => s.MerchantID);
            b.HasOne<Category>(s => s.Category).WithMany(g => g.MerchantCategory).HasForeignKey(s => s.CategoryID);
        }
    }
}
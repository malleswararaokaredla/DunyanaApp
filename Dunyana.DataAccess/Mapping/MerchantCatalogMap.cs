using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class MerchantCatalogMap : TrackAndAuditEntityMap<MerchantCatalog, int>
    {
        public override void Map(EntityTypeBuilder<MerchantCatalog> b)
        {
            b.ToTable("tblMerchantCatalog");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.Subcategory);
            b.Property(x => x.Brand);
            b.Property(x => x.Product);
            b.HasOne<Merchant>(s => s.Merchant).WithMany(g => g.MerchantCatalog).HasForeignKey(s => s.MerchantID);
            b.HasOne<Category>(s => s.Category).WithMany(g => g.MerchantCatalog).HasForeignKey(s => s.CategoryID);
        }
    }
}
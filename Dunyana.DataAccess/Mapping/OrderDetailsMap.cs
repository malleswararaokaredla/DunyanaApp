using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class OrderDetailsMap : TrackAndAuditEntityMap<OrderDetails, int>
    {
        public override void Map(EntityTypeBuilder<OrderDetails> b)
        {
            b.ToTable("tblorderdetails");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            //b.Property(x => x.OrderRefID);
            //b.Property(x => x.WaybillId);
            b.Property(x => x.ProductSKU);
            b.Property(x => x.ProductImage);
            b.Property(x => x.ProductName);
            b.Property(x => x.Description);
            b.Property(x => x.Quantity);
            b.Property(x => x.UnitCost);
            b.Property(x => x.CurrenyCode);
            b.Property(x => x.Returndate);
            b.Property(x => x.Canceldate);
            b.HasOne<WayBill>(s => s.WayBill).WithMany(g => g.OrderDetails).HasForeignKey(s => s.WaybillId);
        }
    }
}

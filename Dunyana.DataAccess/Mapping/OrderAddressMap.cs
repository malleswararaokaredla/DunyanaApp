using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class OrderAddressMap : TrackAndAuditEntityMap<OrderAddress, int>
    {
        public override void Map(EntityTypeBuilder<OrderAddress> b)
        {
            b.ToTable("tblOrderAddress");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            //b.Property(x => x.OrderRefID);
            b.Property(x => x.Line1);
            b.Property(x => x.Line2);
            b.Property(x => x.City);
            b.Property(x => x.State);
            b.Property(x => x.Country);
            b.Property(x => x.zip);
            b.Property(x => x.MobileNo);
            b.Property(x => x.Phone);
            b.Property(x => x.Latitude);
            b.Property(x => x.Longitude);
            b.HasOne<Order>(s => s.Order).WithMany(g => g.OrderAddress).HasForeignKey(s => s.OrderRefID);
        }
    }
}

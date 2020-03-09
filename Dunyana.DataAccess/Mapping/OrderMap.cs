using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class OrderMap : TrackAndAuditEntityMap<Order, int>
    {
        public override void Map(EntityTypeBuilder<Order> b)
        {
            b.ToTable("tblorder");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            //b.Property(x => x.CustomerID);
            b.Property(x => x.OrderNo);
            b.Property(x => x.OrderDate);
            b.Property(x => x.OrderAmount);
            b.Property(x => x.Currency);
            b.Property(x => x.OrderStatus);
            b.Property(x => x.COD);
            b.Property(x => x.Paymentstatus);
            b.HasOne<CustomerRegistration>(s => s.CustomerRegistration).WithOne(g => g.Order).HasForeignKey<Order>(s => s.CustomerID);
            b.HasOne<Merchant>(s => s.Merchant).WithMany(g => g.Order).HasForeignKey(s => s.MerchantID);
        }
    }
}

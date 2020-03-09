using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class WayBillMap : TrackAndAuditEntityMap<WayBill, int>
    {
        public override void Map(EntityTypeBuilder<WayBill> b)
        {
            b.ToTable("tblorderwaybill");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.WaybillNo);
        }
    }
}

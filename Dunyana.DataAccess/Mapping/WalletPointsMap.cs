using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class WalletPointsMap : TrackAndAuditEntityMap<WalletPoints, int>
    {
        public override void Map(EntityTypeBuilder<WalletPoints> b)
        {
            b.ToTable("tblwalletpoints");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.Points);
            b.HasOne<CustomerRegistration>(s => s.CustomerRegistration).WithOne(g => g.WalletPoints).HasForeignKey<WalletPoints>(s => s.CustomerID);
        }
    }
}

using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class WalletMap : TrackAndAuditEntityMap<Wallet, int>
    {
        public override void Map(EntityTypeBuilder<Wallet> b)
        {
            b.ToTable("tblwallet");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.Amount);
            b.HasOne<CustomerRegistration>(s => s.CustomerRegistration).WithOne(g => g.Wallet).HasForeignKey<Wallet>(s => s.CustomerID);
        }
    }
}

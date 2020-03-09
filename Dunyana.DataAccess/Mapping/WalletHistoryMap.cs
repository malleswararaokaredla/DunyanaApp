using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class WalletHistoryMap : TrackAndAuditEntityMap<WalletHistory, int>
    {
        public override void Map(EntityTypeBuilder<WalletHistory> b)
        {
            b.ToTable("tblwallethistory");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.CustomerID);
            b.Property(x => x.Type);
            b.Property(x => x.Transaction);
            b.Property(x => x.TransactionDate);
            b.Property(x => x.TransactionAmount);
            b.Property(x => x.TransactionDescription);
            b.Property(x => x.Status);
            b.Property(x => x.OrderID);
            b.HasOne<LookupTypeValues>(s => s.LookupTypeValues).WithOne(g => g.WalletHistory).HasForeignKey<WalletHistory>(s => s.Type);
        }
    }
}
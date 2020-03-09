using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class WalletPointsHistoryMap : TrackAndAuditEntityMap<WalletPointsHistory, int>
    {
        public override void Map(EntityTypeBuilder<WalletPointsHistory> b)
        {
            b.ToTable("tblwalletpointshistory");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.CustomerID);
            b.Property(x => x.Transaction);
            b.Property(x => x.TransactionDate);
            b.Property(x => x.TransactionPoints);
            b.Property(x => x.TransactionDescription);
            b.Property(x => x.Status);
            b.Property(x => x.OrderID);
        }
    }
}
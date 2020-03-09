using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class MerchantBonusMap : TrackAndAuditEntityMap<MerchantBonus, int>
    {
        public override void Map(EntityTypeBuilder<MerchantBonus> b)
        {
            b.ToTable("tblmerchantbonus");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.WalletAmount);
            b.Property(x => x.WalletPoints);
            b.HasOne<Merchant>(s => s.Merchant).WithOne(g => g.MerchantBonus).HasForeignKey<MerchantBonus>(s => s.MerchantID);
        }
    }
}
